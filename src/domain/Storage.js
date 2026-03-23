import { PCPart } from "./PCPart.js";

export class Storage extends PCPart {
    type = null;
    capacity = 0;
    formFactor = null;
    connectionType = null;

    nvme = null;

    constructor({ attrs, type, capacity, formFactor, connectionType, nvme = null }) {
        super(attrs);
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
            attrs,
            type: row.type?.toLowerCase?.() ?? row.type ?? null,
            capacity,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null,
            connectionType: row.connection_type?.toLowerCase?.() ?? row.connection_type ?? null,
            nvme: row.nvme ?? null
        });
    }

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass.name) {
            case 'Motherboard': {
                const slotTypeArr = this.connectionType
                    ? this.connectionType.includes('m.2') 
                        ? ['m2_slots', 'm2Slots'] 
                        : ['sata_ports', 'sataPorts']
                    : [null, 'port'];

                constraints.push(this.makeConstraint({
                    dbField: slotTypeArr?.[0],
                    domainField: slotTypeArr?.[1],
                    op: 'gte',
                    val: 0,
                    isMissing: slotTypeArr?.[0] == null
                }));
                break;
            }
            default:
                return [];
        }

        return constraints;
    }
}