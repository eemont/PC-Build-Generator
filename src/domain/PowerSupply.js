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

    constructor({ attrs, formFactor, efficiencyRating, wattage, length = 0, connectors = null }) {
        super(attrs);
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
            attrs,
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

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass.name) {
            case 'Case':
                constraints.push(this.makeConstraint({ 
                    dbField: "form_factors", 
                    domainField: 'formFactors',
                    op: 'contains', 
                    val: [this.formFactor],
                    isMissing: this.formFactor == null
                }));
                break;

            // need to refactor
            case 'GPU':
                if (this.connectors.pcie8 == 0) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'external_power', 
                        domainField: 'externalPower',
                        op: 'notLike', 
                        val: "pcie 8",
                        isMissing: true
                    }));
                }   
                if (this.connectors.eps8 == 0) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'external_power', 
                        domainField: 'externalPower',
                        op: 'notLike', 
                        val: "eps 8",
                        isMissing: true
                    }));
                } 
                if (this.connectors.pcie6_2 == 0) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'external_power', 
                        domainField: 'externalPower',
                        op: 'notLike', 
                        val: "pcie 6",
                        isMissing: true
                    }));
                }
                if (this.connectors.pcie16 == 0) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'external_power', 
                        domainField: 'externalPower', 
                        op: 'notLike', 
                        val: "16-pin",
                        isMissing: true
                    }));
                }
                if (this.connectors.pcie12 == 0) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'external_power', 
                        domainField: 'externalPower',
                        op: 'notLike', 
                        val: "12-pin",
                        isMissing: true
                    }));
                }
                break;
            default:
                return [];
        }

        return constraints;
    }
}