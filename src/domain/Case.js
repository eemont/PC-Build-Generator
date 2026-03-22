import { PCPart } from "./PCPart.js";

export class Case extends PCPart {
    type = null;
    internalBays = 0;

    formFactors = [];
    maxGPULength = 0;   // millimeters
    supportedRadiatorLengths = [];   // mm
    maxSupportedRadiatorLength = 0;  // mm
    maxCPUCoolerHeight = 0;  // mm

    constructor({ 
        attrs, type, internalBays, formFactors = [], maxGPULength = 0, 
        supportedRadiatorLengths = [], maxSupportedRadiatorLength = 0,
        maxCPUCoolerHeight = 0 }) {
        super(attrs);
        this.type = type;
        this.internalBays = internalBays;
        
        this.formFactors = formFactors;
        this.maxGPULength = maxGPULength;
        this.supportedRadiatorLengths = supportedRadiatorLengths;
        this.maxSupportedRadiatorLength = maxSupportedRadiatorLength;
        this.maxCPUCoolerHeight = maxCPUCoolerHeight
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new Case({
            attrs,
            type: row.type?.toLowerCase?.() ?? row.type ?? null,
            internalBays: row.internal_bays ?? 0,
            formFactors: row.form_factors ?? [],
            maxGPULength: row.max_gpu_length ?? 0,
            supportedRadiatorLengths: row.supported_radiator_lengths ?? [],
            maxSupportedRadiatorLength: row.max_supported_radiator_length ?? [],
            maxCPUCoolerHeight: row.max_cpu_cooler_height ?? 0
        });
    }

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass) {
            case 'CPUCooler':
                if (targetPart.waterCooled) {
                    constraints.push(this.makeConstraint({
                        dbField: 'radiator_size',
                        domainField: 'radiatorSize',
                        op: 'lte',
                        val: this.maxSupportedRadiatorLength,
                        isMissing: this.maxSupportedRadiatorLength === 0
                    }))
                } else {
                    constraints.push(this.makeConstraint({
                        dbField: 'height',
                        domainField: 'height',
                        op: 'lte',
                        val: this.maxCPUCoolerHeight,
                        isMissing: this.maxCPUCoolerHeight === 0
                    }))
                }
                break;
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