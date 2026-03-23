import { PCPart } from "./PCPart.js";

export class Memory extends PCPart {
    memoryType = null;
    capacityGB = 0;
    errorCorrection = null;
    
    formFactor = null;

    constructor({ attrs, memoryType, capacityGB, errorCorrection, formFactor = null }) {
        super(attrs);
        this.memoryType = memoryType;
        this.capacityGB = capacityGB;
        this.errorCorrection = errorCorrection;

        this.formFactor = formFactor;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        // Handle capacity conversion from bytes to GB
        let capacityGB = 0;
        if (row.module_size && typeof row.module_size === 'object' && row.module_size.total) {
            const moduleCapacityGB = Math.round(row.module_size.total / (1024 * 1024 * 1024)); // Convert bytes to GB
            capacityGB = (row.number_of_modules || 1) * moduleCapacityGB;
        } else if (row.capacity_gb) {
            capacityGB = row.capacity_gb;
        }

        return new Memory({
            attrs,
            memoryType: row.memory_type?.toLowerCase?.() ?? row.memory_type ?? null,
            capacityGB,
            errorCorrection: row.error_correction?.toLowerCase?.() ?? row.error_correction ?? null,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null
        });
    }

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass.name) {
            case 'Motherboard':
                constraints.push(this.makeConstraint({ 
                    dbField: "memory_types", 
                    domainField: 'memoryTypes',
                    op: 'eq', 
                    val: this.memoryType,
                    isMissing: this.memoryType == null
                }));
                constraints.push(this.makeConstraint({ 
                    dbField: "max_ram", 
                    domainField: 'maxRam',
                    op: "gte", 
                    val: this.capacityGB,
                    isMissing: this.capacityGB === 0
                }));

                // if (this.errorCorrection != null) {
                //     if (this.errorCorrection.indexOf("non") > 0) {
                //         constraints.push({ field: "supports_ecc", op: 'eq', val: false })
                //     } else {
                //         constraints.push({ field: "supports_ecc", op: 'eq', val: true })
                //     }
                // }
                break;
            default:
                return [];
        }

        return constraints;
    }
}