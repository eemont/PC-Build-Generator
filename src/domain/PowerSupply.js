import { PCPart } from "./PCPart.js";

export class PowerSupply extends PCPart {

    formFactor = null;
    efficiencyRating = null;
    wattage = 0;

    length = 0;         // millimeters
    connectors = {
        eps8: 0,
        pcie8: 0,
        pcie6_2: 0,
        pcie16: 0
    }

    constructor({brand, model, price, img="", link="", formfactor, efficiencyRating, wattage, length=0, connectors=null}) {
        super(brand, model, price, img, link);
        this.formFactor = formfactor;
        this.efficiencyRating = efficiencyRating;
        this.wattage = wattage;

        this.length = length;
        this.connectors = connectors;
    }

    static decode(partObj) {
        const attrs = super.decode(partObj);

        return new PowerSupply({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            formFactor: partObj.form_factor?.toLowerCase(),
            efficiencyRating: partObj.efficiency_rating?.toLowerCase(),
            wattage: partObj.wattage
        });
    }
}