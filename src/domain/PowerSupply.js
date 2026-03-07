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
    };

    constructor({ brand, model, price, img = "", link = "", formFactor, efficiencyRating, wattage, length = 0, connectors = null }) {
        super(brand, model, price, img, link);
        this.formFactor = formFactor;
        this.efficiencyRating = efficiencyRating;
        this.wattage = wattage;

        this.length = length;
        this.connectors = connectors ?? {
            eps8: 0,
            pcie8: 0,
            pcie6_2: 0,
            pcie16: 0
        };
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

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new PowerSupply({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null,
            efficiencyRating: row.efficiency_rating?.toLowerCase?.() ?? row.efficiency_rating ?? null,
            wattage: row.wattage ?? 0,
            length: row.length ?? 0,
            connectors: {
                eps8: row.eps8 ?? 0,
                pcie8: row.pcie8 ?? 0,
                pcie6_2: row.pcie6_2 ?? 0,
                pcie16: row.pcie16 ?? 0
            }
        });
    }
}