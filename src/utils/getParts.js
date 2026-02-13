import { caseResults } from "../data/results/caseResults.js";
import { cpuCoolerResults } from "../data/results/cpuCoolerResults.js";
import { cpuResults } from "../data/results/cpuResults.js";
import { gpuResults } from "../data/results/gpuResults.js";
import { memoryResults } from "../data/results/memoryResults.js";
import { motherboardResults } from "../data/results/motherboardResults.js";
import { powerSupplyResults } from "../data/results/powerSupplyResults.js";
import { storageResults } from "../data/results/storageResults.js";

import { partClasses } from "../domain/partClasses.js";

const resultsMap = {
    'case': caseResults,
    'cpu': cpuResults,
    'cpu-cooler': cpuCoolerResults,
    'video-card': gpuResults,
    'memory': memoryResults,
    'motherboard': motherboardResults,
    'power-supply': powerSupplyResults,
    'internal-hard-drive': storageResults
};

async function fetchParts(partName) {
    // api call --> python script to get all parts based on name
    console.log(`Retrieving ${[partName]}s...`)
    const normalized = partName.toLowerCase().trim();
    const results = resultsMap[normalized];

    if (!results) {
        throw new Error("Invalid part name");
    }

    const parsed = JSON.parse(results);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(parsed);
        }, 1000)
    });
}

export async function findParts(partName, max = 5, random = false) {
    try {
        const results = await fetchParts(partName);

        const partClass = partClasses[partName];
        const partsClassed = results.map(part => {
            return partClass.decode(part);
        })
        .filter(part => {
            return part.price <= 200
        });

        let maxResults;
        if (random) {
            const length = partsClassed.length;
            maxResults = new Array(max).fill(0).map(() => partsClassed[Math.floor(Math.random()*length)]);
            
        } else {
            maxResults = partsClassed.slice(0, max);
        }

        return maxResults;
    } catch(err) {
        return err;
    }
}