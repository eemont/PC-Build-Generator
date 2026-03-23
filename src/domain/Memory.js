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

        // Handle capacity conversion from bytes to GB
        let capacityGB = 0;
        if (row.module_size && typeof row.module_size === 'object' && row.module_size.total) {
            const moduleCapacityGB = Math.round(row.module_size.total / (1024 * 1024 * 1024)); // Convert bytes to GB
            capacityGB = (row.number_of_modules || 1) * moduleCapacityGB;
        } else if (row.capacity_gb) {
            capacityGB = row.capacity_gb;
        }

        return new Memory({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            memoryType: row.module_type?.toLowerCase?.() ?? row.module_type ?? null,
            capacityGB: capacityGB,
            errorCorrection: row.error_correction?.toLowerCase?.() ?? row.error_correction ?? null,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null
        });
    }

    static decode(row) {
        return this.fromRow(row);
    }
}