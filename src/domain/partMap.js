import { Case } from "./Case.js";
import { CPU } from "./CPU.js";
import { CPUCooler } from "./CPUCooler.js"
import { GPU } from "./GPU.js";
import { Memory } from "./Memory.js";
import { Motherboard } from "./Motherboard.js";
import { PowerSupply } from "./PowerSupply.js";
import { Storage } from "./Storage.js";

export const partMap = {
    "case": {
        class: Case,
        table: "pc_case",
    },
    "cpu": {
        class: CPU,
        table: "cpu"
    },
    "cpu-cooler": {
        class: CPUCooler,
        table: "cpu_cooler"
    },
    "video-card": {
        class: GPU,
        table: "gpu"
    },
    "memory": {
        class: Memory,
        table: "memory"
    },
    "motherboard": {
        class: Motherboard,
        table: "motherboard"
    },
    "power-supply": {
        class: PowerSupply,
        table: "power_supply"
    },
    "internal-hard-drive": {
        class: Storage,
        table: "storage"
    }
};