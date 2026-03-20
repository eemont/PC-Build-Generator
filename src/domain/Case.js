import { PCPart } from "./PCPart.js";

export class Case extends PCPart {
    type = null;
    internalBays = 0;

    formFactors = [];
    maxGPULength = 0;   // millimeters

    constructor({ attrs, type, internalBays, formFactors = [], maxGPULength = 0 }) {
        super(attrs);
        this.type = type;
        this.internalBays = internalBays;
        
        this.formFactors = formFactors;
        this.maxGPULength = maxGPULength;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new Case({
            attrs,
            type: row.type?.toLowerCase?.() ?? row.type ?? null,
            internalBays: row.internal_bays ?? 0,
            formFactors: row.form_factors ?? [],
            maxGPULength: row.max_gpu_length ?? 0
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.name) {
            case 'Motherboard':
            case 'PowerSupply':
                constraints.push(this.makeConstraint({ 
                    dbField: "form_factor",
                    domainField: 'formFactor',
                    op: 'in', 
                    val: this.formFactors,
                    isMissing: this.formFactors.length === 0,
                }));
                break;
            case 'GPU':
                constraints.push(this.makeConstraint({ 
                    dbField: 'length', 
                    domainField: 'length',
                    op: 'lte', 
                    val: this.maxGPULength,
                    isMissing: this.maxGPULength === 0
                }));
                break;
            default:
                return [];
        }

        return constraints;
    }
}