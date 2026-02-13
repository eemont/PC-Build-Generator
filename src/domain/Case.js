import { PCPart } from "./PCPart.js";

export class Case extends PCPart {
    type = null;
    internalBays = 0;

    formFactors = [];
    maxGPULength = 0;   // millimeters

    constructor({brand, model, price, img="", link="", type, internalBays, formFactors=null, maxGPULength=null}) {
        super(brand, model, price, img, link);
        this.type = type;
        this.internalBays = internalBays;
        
        this.formFactors = formFactors;
        this.maxGPULength = maxGPULength;
    }

    static decode(partObj) {
        const attrs = super.decode(partObj);

        return new Case({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            type: partObj.form_factor?.toLowerCase(),    // api has type incorrectly marked as form_factor
            internalBays: partObj.internal_bays
        }); 
    }
}