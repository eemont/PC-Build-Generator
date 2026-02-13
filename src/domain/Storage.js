import { PCPart } from "./PCPart.js";

export class Storage extends PCPart {

    type = null;
    capacity = 0;
    formFactor = null;
    connectionType = null;

    nvme = null;

    constructor({brand, model, price, img="", link="", type, capacity, formFactor, connectionType, nvme=null}) {
        super(brand, model, price, img, link);
        this.type = type;
        this.capacity = capacity;
        this.formFactor = formFactor;
        this.connectionType = connectionType; 

        this.nvme = nvme;
    }

    static decode(partObj) {
        const attrs = super.decode(partObj);

        return new Storage({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            type: partObj.storage_type?.toLowerCase(),
            capacity: partObj.capacity.total / 1000000000,  // b -> gb
            formFactor: partObj.form_factor,
            connectionType: partObj.interface?.toLowerCase()
        });
    }
}