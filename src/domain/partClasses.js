import { Case } from "./Case.js";
import { CPU } from "./CPU.js";
import { CPUCooler } from "./CPUCooler.js"
import { GPU } from "./GPU.js";
import { Memory } from "./Memory.js";
import { Motherboard } from "./Motherboard.js";
import { PowerSupply } from "./PowerSupply.js";
import { Storage } from "./Storage.js";

export const partClasses = {
    'case': Case,
    'cpu': CPU,
    'cpu-cooler': CPUCooler,
    'video-card': GPU,
    'memory': Memory,
    'motherboard': Motherboard,
    'power-supply': PowerSupply,
    'internal-hard-drive': Storage
};