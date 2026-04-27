const BUDGET_ALLOCATION = [
    { slot: "cpu",     fraction: 0.17, partType: "cpu" },
    { slot: "gpu",     fraction: 0.50, partType: "video-card" },
    { slot: "mobo",    fraction: 0.10, partType: "motherboard" },
    { slot: "memory",  fraction: 0.065, partType: "memory" },
    { slot: "storage", fraction: 0.065, partType: "internal-hard-drive" },
    { slot: "psu",     fraction: 0.04, partType: "power-supply" },
    { slot: "case",    fraction: 0.04, partType: "case" },
    { slot: "cooler",  fraction: 0.02, partType: "cpu-cooler" },
];

function scorePart(part, slot) {
    switch (slot) {
        case "gpu": {
            const vramScore = Math.min((part.vram || 0) / 24, 1) * 50;
            const clockScore = Math.min((part.boostClock || part.coreClock || 0) / 3.0, 1) * 30;
            const tdpPenalty = (part.tdp || 0) > 450 ? -5 : 0;
            return vramScore + clockScore + tdpPenalty + 20;
        }
        case "cpu": {
            const coreScore = Math.min((part.cores || 0) / 24, 1) * 40;
            const mtBonus = part.multithreading ? 15 : 0;
            const tdpPenalty = (part.tdp || 0) > 170 ? -5 : 0;
            return coreScore + mtBonus + tdpPenalty + 25;
        }
        case "mobo": {
            const ramSlotScore = Math.min((part.ramSlots || 0) / 4, 1) * 20;
            const m2Score = Math.min((part.m2Slots || 0) / 4, 1) * 20;
            const maxRamScore = Math.min((part.maxRam || 0) / 192, 1) * 15;
            return ramSlotScore + m2Score + maxRamScore + 25;
        }
        case "memory": {
            const capScore = Math.min((part.capacityGB || 0) / 64, 1) * 50;
            const ddr5Bonus = part.memoryType === "ddr5" ? 15 : 0;
            return capScore + ddr5Bonus + 20;
        }
        case "storage": {
            const capScore = Math.min((part.capacity || 0) / 4000, 1) * 35;
            const nvmeBonus = part.nvme ? 20 : 0;
            const ssdBonus = part.type === "ssd" ? 15 : 0;
            return capScore + nvmeBonus + ssdBonus + 20;
        }
        case "psu": {
            const wattScore = Math.min((part.wattage || 0) / 1200, 1) * 35;
            const effMap = { titanium: 25, platinum: 20, gold: 15, silver: 10, bronze: 5 };
            const effScore = effMap[part.efficiencyRating] || 0;
            return wattScore + effScore + 20;
        }
        case "case": {
            const gpuClearance = Math.min((part.maxGPULength || 0) / 450, 1) * 30;
            const bayScore = Math.min((part.internalBays || 0) / 6, 1) * 15;
            return gpuClearance + bayScore + 25;
        }
        case "cooler": {
            const radBonus = (part.radiatorSize || 0) > 0 ? 20 : 0;
            const radSize = Math.min((part.radiatorSize || 0) / 360, 1) * 25;
            return radBonus + radSize + 25;
        }
        default:
            return 50;
    }
}

function pickBestPart(results, slotBudget, slot) {
    const validCompatible = results.filter(
        (r) => r.part.price > 0 && r.compatible
    );
    const validAll = results.filter((r) => r.part.price > 0);

    const pool = validCompatible.length > 0 ? validCompatible : validAll;
    if (pool.length === 0) return null;

    const withinBudget = pool
        .filter((r) => r.part.price <= slotBudget)
        .sort((a, b) => {
            const scoreA = scorePart(a.part, slot);
            const scoreB = scorePart(b.part, slot);
            if (scoreB !== scoreA) return scoreB - scoreA;
            return (scoreB / b.part.price) - (scoreA / a.part.price);
        });

    if (withinBudget.length > 0) return withinBudget[0].part;

    const cheapest = [...pool].sort((a, b) => a.part.price - b.part.price);
    return cheapest[0]?.part || null;
}


export async function generateSmartBuild(budget, findParts, measurePartCompatibility) {
    const selectedParts = {};

    let savings = 0;

    for (const { slot, fraction, partType } of BUDGET_ALLOCATION) {
        const baseBudget = budget * fraction;
        const available = baseBudget + savings * 0.5;
        savings -= savings * 0.5;

        try {
            const results = await findParts({
                partType,
                selectedParts,
                limit: null,
                ignoreCompatibility: false,
            });

            if (!results || results.length === 0) {
                console.warn(`No parts found for slot: ${slot}`);
                savings += available;
                continue;
            }

            const best = pickBestPart(results, available, slot);

            if (best) {
                selectedParts[slot] = { part: best };

                for (const [key, selected] of Object.entries(selectedParts)) {
                    selectedParts[key] = measurePartCompatibility(selected.part, selectedParts);
                }

                savings += available - best.price;
            } else {
                savings += available;
            }
        } catch (err) {
            console.error(`Failed to fetch parts for ${slot}:`, err);
            savings += available;
        }
    }

    const totalPrice = Object.values(selectedParts).reduce(
        (sum, s) => sum + (s.part?.price ?? 0),
        0
    );

    return { parts: selectedParts, totalPrice };
}