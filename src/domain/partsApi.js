import { supabase } from "../lib/supabaseClient.js";
import { partMap } from "./partMap.js";

const operatorHandler = {
  contains(query, field, val) {
    return query.contains(field, val);
  },
  notContains(query, field, val) {
    return query.not(field, 'ilike', `%${val}%`);
  },

  in(query, field, val) {
    return query.in(field, val);
  },

  eq(query, field, val) {
    return query.eq(field, val);
  },

  gte(query, field, val) {
    return query.gte(field, val);
  },

  lte(query, field, val) {
    return query.lte(field, val);
  },
};

export async function findParts(partType, selectedParts, ignoreCompatibility, limit = null) {
  const table = partMap[partType].table;
  const PartClass = partMap[partType].class;

  if (!table || !PartClass) {
    throw new Error(`Unsupported part type: ${partType}`);
  }

  let query = supabase
    .from(table)
    .select("*")
  
  if (limit != null) {
    query.limit(limit);
  }

  // Handle queries added on for compatibility
  if (!ignoreCompatibility) {
    for (const [partName, part] of Object.entries(selectedParts)) {
      const constraints = part.getCompatibilityFields(PartClass);
      console.log(`found constraints for ${partName}`, constraints);

      constraints.forEach(constraint => {
        const handler = operatorHandler[constraint.op];
        query = handler(query, constraint.field, constraint.val);
      });
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((row) => PartClass.fromRow(row));
}