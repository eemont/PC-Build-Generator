import { PCPart } from "./PCPart.js";

export class Case extends PCPart {
    type = null;
    internalBays = 0;

    formFactors = [];
    maxGPULength = 0;   // millimeters

    constructor({ brand, model, price, img = "", link = "", type, internalBays, formFactors = null, maxGPULength = null }) {
        super(brand, model, price, img, link);
        this.type = type;
        this.internalBays = internalBays;
        
        this.formFactors = formFactors;
        this.maxGPULength = maxGPULength;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new Case({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            type: row.type?.toLowerCase?.() ?? row.type ?? null,
            internalBays: row.internal_bays ?? 0,
            formFactors: row.form_factors ?? null,
            maxGPULength: row.max_gpu_length ?? 0
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.name) {
            case 'Motherboard':
            case 'PowerSupply':
                if (this.formFactors != null) constraints.push({ field: "form_factor", op: 'in', val: this.formFactors });
                break;
            case 'GPU':
                if (this.maxGPULength > 0) constraints.push({ field: 'length', op: 'lte', val: this.maxGPULength }); 
                break;
            default:
                return [];
        }

        return constraints;
    }
}