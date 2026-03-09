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

        return new Storage({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            type: row.type?.toLowerCase?.() ?? row.type ?? null,
            capacity: row.capacity ?? 0,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null,
            connectionType: row.connection_type?.toLowerCase?.() ?? row.connection_type ?? null,
            nvme: row.nvme ?? null
        });
    }
}