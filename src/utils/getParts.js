import { mockCases } from "../data/mockCases.js";
import { mockCPUCoolers } from "../data/mockCPUCoolers.js";
import { mockCPUs } from "../data/mockCPUs.js";
import { mockMemory } from "../data/mockMemory.js";
import { mockMotherBoards } from "../data/mockMotherBoards.js";
import { mockPowerSupplies } from "../data/mockPowerSupplies.js";
import { mockStorage } from "../data/mockStorage.js";
import { mockGPUs } from "../data/mockGPUs.js";

const resultsMap = {
  'case': mockCases,
  'cpu': mockCPUs,
  'cpu-cooler': mockCPUCoolers,
  'video-card': mockGPUs,
  'memory': mockMemory,
  'motherboard': mockMotherBoards,
  'power-supply': mockPowerSupplies,
  'internal-hard-drive': mockStorage
};

async function fetchParts(partName) {
  console.log(`Retrieving ${partName}s...`);
  const normalized = partName.toLowerCase().trim();
  const results = resultsMap[normalized];
  
  if (!results) {
    throw new Error("Invalid part name");
  }
  
  // No JSON.parse needed - data is already instantiated objects
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });
}

export async function findParts(partName, max = 5, random = false) {
  try {
    const results = await fetchParts(partName);
    
    // No need to decode - objects are already class instances
    const partsFiltered = results.filter(part => part.price <= 200);
    
    let maxResults;
    if (random) {
      const length = partsFiltered.length;
      maxResults = new Array(max).fill(0).map(() => 
        partsFiltered[Math.floor(Math.random() * length)]
      );
    } else {
      maxResults = partsFiltered.slice(0, max);
    }
    
    return maxResults;
  } catch (err) {
    return err;
  }
}