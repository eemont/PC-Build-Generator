import { PCPart } from "./PCPart.js";

export class CPU extends PCPart {
    cores = 0;
    tdp = 0;                        // watts
    integratedGraphics = null;
    multithreading = false;

    sockets = null;
    memoryType = null;

    constructor({ attrs, cores, tdp, integratedGraphics, multithreading, sockets = null, memoryType = null }) {
        super(attrs);
        this.cores = cores;
        this.tdp = tdp;
        this.integratedGraphics = integratedGraphics;
        this.multithreading = multithreading;
        this.sockets = sockets;
        this.memoryType = memoryType;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new CPU({
            attrs,
            cores: row.cores,
            tdp: row.tdp,
            integratedGraphics: row.integrated_graphics?.toLowerCase?.() ?? row.integrated_graphics ?? null,
            multithreading: row.multithreading,
            sockets: row.sockets ?? null,
            memoryType: row.memory_type?.toLowerCase?.() ?? row.memory_type ?? null
        });
    }

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass) {
            case 'CPUCooler':
                constraints.push(this.makeConstraint({ 
                    dbField: "sockets", 
                    domainField: 'sockets',
                    op: "contains", 
                    val: [this.sockets],
                    isMissing: this.sockets == null
                }));
                break;
            case 'Motherboard':
                constraints.push(this.makeConstraint({ 
                    dbField: "socket", 
                    domainField: 'socket',
                    op: "eq", 
                    val: this.sockets,
                    isMissing: this.sockets == null
                }));
                break;
            default:
                return [];
        }
        
        return constraints;
    }
}
