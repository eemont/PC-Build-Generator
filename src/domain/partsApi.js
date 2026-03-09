import { supabase } from "../lib/supabaseClient.js";
import { partClasses } from "./partClasses";
import { partTableMap } from "./partTableMap";

export async function findParts(partType, limit = 50) {
  const table = partTableMap[partType];
  const PartClass = partClasses[partType];

  if (!table || !PartClass) {
    throw new Error(`Unsupported part type: ${partType}`);
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .limit(limit);

  if (error) throw error;

  return data.map((row) => PartClass.fromRow(row));
}