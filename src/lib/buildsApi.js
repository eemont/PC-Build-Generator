import { supabase } from './supabaseClient';
import { CPU } from '../domain/CPU';
import { CPUCooler } from '../domain/CPUCooler';
import { GPU } from '../domain/GPU';
import { Memory } from '../domain/Memory';
import { Motherboard } from '../domain/Motherboard';
import { PowerSupply } from '../domain/PowerSupply';
import { Storage } from '../domain/Storage';
import { Case } from '../domain/Case';

const BUILDS_SELECT = `
  *,
  cpu_part:cpu(*),
  cooler_part:cpu_cooler(*),
  mobo_part:motherboard(*),
  memory_part:memory(*),
  storage_part:storage(*),
  gpu_part:gpu(*),
  case_part:pc_case(*),
  psu_part:power_supply(*)
`.trim();

function partsToIds(selectedParts) {
  return {
    cpu_id:     selectedParts.cpu?.part?.id     ?? null,
    cooler_id:  selectedParts.cooler?.part?.id  ?? null,
    mobo_id:    selectedParts.mobo?.part?.id    ?? null,
    memory_id:  selectedParts.memory?.part?.id  ?? null,
    storage_id: selectedParts.storage?.part?.id ?? null,
    gpu_id:     selectedParts.gpu?.part?.id     ?? null,
    case_id:    selectedParts.case?.part?.id    ?? null,
    psu_id:     selectedParts.psu?.part?.id     ?? null,
  };
}

function rowToSelectedParts(row) {
  const slots = [
    { key: 'cpu',     data: row.cpu_part,     Class: CPU },
    { key: 'cooler',  data: row.cooler_part,  Class: CPUCooler },
    { key: 'mobo',    data: row.mobo_part,    Class: Motherboard },
    { key: 'memory',  data: row.memory_part,  Class: Memory },
    { key: 'storage', data: row.storage_part, Class: Storage },
    { key: 'gpu',     data: row.gpu_part,     Class: GPU },
    { key: 'case',    data: row.case_part,    Class: Case },
    { key: 'psu',     data: row.psu_part,     Class: PowerSupply },
  ];

  const parts = {};
  for (const { key, data, Class } of slots) {
    if (data) {
      parts[key] = { part: Class.fromRow(data), issues: [], compatible: true };
    }
  }
  return parts;
}

function rowToBuild(row) {
  return {
    id: row.id,
    name: row.name,
    notes: row.notes ?? '',
    totalPrice: parseFloat(row.total_price),
    generatedBudget: row.generated_budget ? parseFloat(row.generated_budget) : null,
    dateSaved: new Date(row.date_saved).toLocaleDateString(),
    parts: rowToSelectedParts(row),
  };
}

export async function getUserBuilds(userId) {
  const { data, error } = await supabase
    .from('builds')
    .select(BUILDS_SELECT)
    .eq('user_id', userId)
    .order('date_saved', { ascending: false });

  if (error) throw error;
  return data.map(rowToBuild);
}

export async function saveBuild({ buildId, userId, name, notes, totalPrice, generatedBudget, selectedParts }) {
  const payload = {
    user_id: userId,
    name,
    notes: notes || null,
    total_price: totalPrice,
    generated_budget: generatedBudget || null,
    ...partsToIds(selectedParts),
  };

  if (buildId) {
    const { data, error } = await supabase
      .from('builds')
      .update(payload)
      .eq('id', buildId)
      .eq('user_id', userId)
      .select(BUILDS_SELECT)
      .single();
    if (error) throw error;
    return rowToBuild(data);
  }

  const { data, error } = await supabase
    .from('builds')
    .insert(payload)
    .select(BUILDS_SELECT)
    .single();
  if (error) throw error;
  return rowToBuild(data);
}

export async function deleteBuild(buildId, userId) {
  const { error } = await supabase
    .from('builds')
    .delete()
    .eq('id', buildId)
    .eq('user_id', userId);

  if (error) throw error;
}
