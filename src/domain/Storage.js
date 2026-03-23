import { PCPart } from "./PCPart.js";

export class Storage extends PCPart {
    type = null;
    capacity = 0;
    formFactor = null;
    connectionType = null;

    nvme = null;

    constructor({ brand, model, price, img = "", link = "", type, capacity, formFactor, connectionType, nvme = null }) {
        super(brand, model, price, img, link);
        this.type = type;
        this.capacity = capacity;
        this.formFactor = formFactor;
        this.connectionType = connectionType; 

        this.nvme = nvme;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        // Handle capacity conversion from bytes to GB
        let capacity = 0;
        if (row.capacity && typeof row.capacity === 'object' && row.capacity.total) {
            capacity = Math.round(row.capacity.total / (1000 * 1000 * 1000)); // Convert bytes to GB
        } else if (typeof row.capacity === 'number') {
            capacity = row.capacity;
        }

        return new Storage({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            type: row.storage_type?.toLowerCase?.() ?? row.storage_type ?? null,
            capacity: capacity,
            formFactor: row.form_factor ?? null, // Preserve original case
            connectionType: row.interface?.toLowerCase?.() ?? row.interface ?? null,
            nvme: row.nvme ?? null
        });
    }

    static decode(row) {
        return this.fromRow(row);
    }
}