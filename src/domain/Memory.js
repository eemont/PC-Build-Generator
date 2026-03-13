import { PCPart } from "./PCPart.js";

export class Memory extends PCPart {
    memoryType = null;
    capacityGB = 0;
    errorCorrection = null;
    
    formFactor = null;

    constructor({ brand, model, price, img = "", link = "", memoryType, capacityGB, errorCorrection, formFactor = null }) {
        super(brand, model, price, img, link);
        this.memoryType = memoryType;
        this.capacityGB = capacityGB;
        this.errorCorrection = errorCorrection;

        this.formFactor = formFactor;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new Memory({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            memoryType: row.memory_type?.toLowerCase?.() ?? row.memory_type ?? null,
            capacityGB: row.capacity_gb ?? 0,
            errorCorrection: row.error_correction?.toLowerCase?.() ?? row.error_correction ?? null,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.nam) {
            case 'Motherboard':
                if (this.memoryType != null) constraints.push({ field: "memory_types", op: 'contains', val: this.memoryType });
                if (this.capacityGB > 0) constraints.push({ field: "max_ram", op: "gte", val: this.capacityGB});
                if (this.errorCorrection != null) constraints.push({ field: "supports_ecc", op: 'eq', val: this.errorCorrection })
                break;
            default:
                return [];
        }

        return constraints;
    }
}