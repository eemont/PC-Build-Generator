import { PCPart } from "./PCPart.js";

export class GPU extends PCPart {
    chipset = null;
    vram = 0;               // GB
    coreClock = 0.09;       // ghz
    boostClock = 0.00;      // ghz
    length = 0.0;           // millimeters

    _interface = null;      // since interface is reserved keyword
    slotWidth = 0;
    externalPower = null;
    tdp = null;             // watts

    constructor({ attrs, chipset, vram, coreClock, boostClock, length, _interface = null, slotWidth = 0, externalPower = null, tdp = null }) {
        super(attrs);
        this.chipset = chipset;
        this.vram = vram;
        this.coreClock = coreClock;
        this.boostClock = boostClock;
        this.length = length;

        this._interface = _interface;
        this.slotWidth = slotWidth;
        this.externalPower = externalPower;
        this.tdp = tdp;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);
        return new GPU({
            attrs,
            chipset: row.chipset?.toLowerCase?.() ?? row.chipset ?? null,
            vram: row.vram ?? 0,
            coreClock: row.core_clock ?? 0,
            boostClock: row.boost_clock ?? 0,
            length: row.length ?? 0,
            _interface: row.interface?.toLowerCase?.() ?? row.interface ?? null,
            slotWidth: row.slot_width ?? 0,
            externalPower: row.external_power?.toLowerCase?.() ?? row.external_power ?? null,
            tdp: row.tdp ?? null
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.name) {
            case 'Case':
                constraints.push(this.makeConstraint({ 
                    dbField: 'max_gpu_length', 
                    domainField: 'maxGPULength',
                    op: 'gte', 
                    val: this.length,
                    isMissing: this.length === 0
                }));
                break;

            // may need to rethink GPU tables:
            // - store interface counts instead of string to make matching easier
            case 'Motherboard':
                if (this._interface == 'pcie x16') {
                    constraints.push(this.makeConstraint({ 
                        dbField: "pcie_x16_slots", 
                        domainField: 'pcieX16Slots',
                        op: 'gte', 
                        val: 1,
                        isMissing: false
                    }));
                } else {
                    constraints.push(this.makeConstraint({
                        dbField: 'pcie_x16_slots',
                        domainField: 'pcieX16Slots',
                        op: 'gte',
                        val: 1,
                        isMissing: this._interface == null
                    }));
                }
                break;
            case 'PowerSupply': {
                constraints.push(this.makeConstraint({ 
                    dbField: 'wattage', 
                    domainField: 'wattage',
                    op: 'gte', 
                    val: this.tdp,
                    isMissing: this.tdp == null
                }));

                const pins = this.externalPower?.split('+');
                let isMissing = this.externalPower == null;

                pins?.forEach(pin => {
                    const count = +(pin.substring(0, pin.indexOf(" ")));
                    if (pin.indexOf("pcie 8") > 0) {
                        constraints.push(this.makeConstraint({ 
                            dbField: 'pcie8', 
                            domainField: 'connectors.pcie8',
                            op: 'gte', 
                            val: count,
                            isMissing
                        }));
                    } 
                    else if (pin.indexOf("eps 8") > 0) {
                        constraints.push(this.makeConstraint({ 
                            dbField: 'eps8', 
                            domainField: 'connectors.eps8',
                            op: 'gte', 
                            val: count,
                            isMissing
                        }));
                    }
                    else if (pin.indexOf("16-pin") > 0) {
                        constraints.push(this.makeConstraint({ 
                            dbField: 'pcie16', 
                            domainField: 'connectors.pcie16',
                            op: 'gte', 
                            val: count,
                            isMissing
                        }));
                    } 
                    else if (pin.indexOf("6-pin") > 0) {
                        constraints.push(this.makeConstraint({ 
                            dbField: 'pcie6_2', 
                            domainField: 'connectors.pcie6_2',
                            op: 'gte', 
                            val: count,
                            isMissing
                        }));
                    } 
                    else if (pin.indexOf("12-pin") > 0) {
                        constraints.push(this.makeConstraint({ 
                            dbField: 'pcie12', 
                            domainField: 'connectors.pcie12',
                            op: 'gte', 
                            val: count,
                            isMissing
                        }));
                    } else {
                        console.error('invalid/untracked pin type:', pin);
                    }
                });
                break;
            }
            default:
                return [];
        }

        return constraints;
    }
}