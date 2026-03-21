import { supabase } from "../lib/supabaseClient.js";
import { partMap } from "./partMap.js";

export const operatorHandler = {
  null: () => { return null },

  contains: {
    text: 'contain',
    query: (query, field, val) => query.contains(field, val),
    evaluate: (actual, val) => actual.includes(val?.[0] || val)
  },

  notLike: {
    text: 'not matching',
    query: (query, field, val) => query.not(field, 'ilike', `%${val}%`),
    evaluate: (actual, val) => actual.indexOf(val) === -1
  },      

  in: {
    text: 'in',
    query: (query, field, val) => query.in(field, val),
    evaluate: (actual, val) => val.indexOf(actual) !== -1
  },

  eq: {
    text: 'equal to',
    query: (query, field, val) => query.eq(field, val),
    evaluate: (actual, val) => actual === val
  },

  gte: {
    text: '>=',
    query: (query, field, val) => query.gte(field, val),
    evaluate: (actual, val) => actual >= val
  },

  lte: { 
    text: '<=',
    query: (query, field, val) => query.lte(field, val),
    evaluate: (actual, val) => actual <= val
  },

  order: {
    text: '',
    query: (query, field, val) => query.order(field, { ascending: val }),
    evaluate: null
  }
};

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
      const constraints = selected?.part?.getCompatibilityFields(PartClass);
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
    const constraints = selected.part.getCompatibilityFields(part.constructor);

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