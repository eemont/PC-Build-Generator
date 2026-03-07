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
    
    static decode(partObj) {
        const attrs = super.decode(partObj);

        const numModules = partObj.number_of_modules;
        const moduleSize = partObj.module_size.total / 1000000000;
        const capacityGB = numModules * moduleSize;

        return new Memory({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            memoryType: partObj.module_type?.toLowerCase(),
            capacityGB,
            errorCorrection: partObj.error_correction?.toLowerCase(),
        });
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
}