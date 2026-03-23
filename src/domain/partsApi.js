import { supabase } from "../lib/supabaseClient.js";
import { partMap } from "./partMap.js";
import { operatorHandler } from "../utils/operatorHandler.js";

export async function findParts({
  partType, 
  selectedParts = {}, 
  limit = null,
  ignoreCompatibility = false,
  additionalFilters = []
}) {
  const table = partMap[partType].table;
  const PartClass = partMap[partType].class;

  if (!table || !PartClass) {
    throw new Error(`Unsupported part type: ${partType}`);
  }

  let query = supabase
    .from(table)
    .select("*")
  
  if (limit != null) query.limit(limit);

  if (additionalFilters.length > 0) {
    additionalFilters.forEach(filter => {
      const handler = operatorHandler[filter.op];
      query = handler.query(query, filter.field, filter.val);
    })
  }

  // Handle queries added on for compatibility
  if (!ignoreCompatibility) {
     for (const [, selected] of Object.entries(selectedParts)) {
      const constraints = selected?.part?.getCompatibilityFields(selected?.part);
      // console.log(`found constraints for ${selected.part.constructor.name}`, constraints);

      constraints?.forEach(constraint => {
        if (constraint.op && constraint.field.db) {
          const handler = operatorHandler[constraint.op];
          // console.log(selected, constraint, constraint.field);
          query = handler.query(query, constraint.field.db, constraint.val);
        }
      });
    }
  }
 
  const { data, error } = await query;

  if (error) {
    console.error(error)
    throw error;
  }

  const parts = data.map((row) => PartClass.fromRow(row));
  const partsEvaluated = parts.map(part => measurePartCompatibility(part, selectedParts));
  return partsEvaluated;
}

export function measurePartCompatibility(part, selectedParts) {
  const issues = [];
  
  for (const [slot, selected] of Object.entries(selectedParts)) {
    const constraints = selected.part.getCompatibilityFields(part);

    constraints.forEach(constraint => {
      const predicted = constraint.val;
      const actual = constraint.field.domain.indexOf(".") == -1
        ? part[constraint.field.domain]
        : constraint.field.domain.split(".")?.reduce(
            (part, field) => part[field],
            part
          );

      
      if (actual != null) {
        let failed = false;

        const handler = operatorHandler[constraint.op];

        failed = !handler.evaluate(actual, predicted);

        // console.group(slot);
        // console.log('actual:', actual);
        // console.log(constraint.op)
        // console.log('predicted:', constraint.val)
        // console.log('failed:', failed);
        // console.groupEnd();

        if (failed) {
          issues.push(({
            sourceSlot: slot,
            ...constraint
          }));
        }

      } else {
        issues.push(({
          sourceSlot: slot,
          ...constraint
        }));
      }

    });
  }
  
  return {
    part,
    compatible: issues.length === 0,
    issues
  };
}