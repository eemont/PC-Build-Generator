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
        pcie16: 0,
        pcie12: 0
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
            pcie16: 0,
            pcie12: 0
        };
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
                pcie16: row.pcie16 ?? 0,
                pcie12: row.pcie12 ?? 0
            }
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.name) {
            case 'Case':
                if (this.formFactor != null) constraints.push({ field: "form_factors", op: 'contains', val: [this.formFactor] });
                break;
            case 'GPU':
                if (this.wattage != null) constraints.push({ field: 'tdp', op: 'lte', val: this.wattage });

                // not best schema, will need to add columns pcie8, pcie6_2, pcie16 to GPU
                if (this.connectors.pcie8 == 0) {
                    constraints.push({ field: 'external_power', op: 'notContains', val: "pcie 8" });
                }   
                if (this.connectors.eps8 == 0) {
                    constraints.push({ field: 'external_power', op: 'notContains', val: "eps 8" });
                } 
                if (this.connectors.pcie6_2 == 0) {
                    constraints.push({ field: 'external_power', op: 'notContains', val: "pcie 6" });
                }
                if (this.connectors.pcie16 ==  0) {
                    constraints.push({ field: 'external_power', op: 'notContains', val: "16-pin" });
                }
                if (this.connectors.pcie12 ==  0) {
                    constraints.push({ field: 'external_power', op: 'notContains', val: "12-pin" });
                }
                break;
            default:
                return [];
        }

        return constraints;
    }
}