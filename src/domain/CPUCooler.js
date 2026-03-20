import { PCPart } from "./PCPart.js";

export class CPUCooler extends PCPart {
    
    // RPM
    fanSpeed = {
        min: 0,
        max: 0,
    };

    // decibels
    noiseLevel = {
        min: 0,
        max: 0
    };
    radiatorSize = 0;

    sockets = [];
    height = 0;      // millimeters

    constructor({ attrs, fanSpeed, noiseLevel, radiatorSize, sockets = [], height = 0 }) {
        super(attrs);
        this.fanSpeed = fanSpeed;
        this.noiseLevel = noiseLevel;
        this.radiatorSize = radiatorSize;
        this.sockets = sockets;
        this.height = height;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new CPUCooler({
            attrs,
            fanSpeed: {
                min: row.fan_speed_min ?? 0,
                max: row.fan_speed_max ?? 0
            },
            noiseLevel: {
                min: row.noise_level_min ?? 0,
                max: row.noise_level_max ?? 0
            },
            radiatorSize: row.radiator_size ?? 0,
            sockets: row.sockets ?? [],
            height: row.height ?? 0
        });
    }

    getCompatibilityFields(targetPartClass) {
        const constraints = [];

        switch(targetPartClass.name) {
            case 'CPU':
                constraints.push(this.makeConstraint({ 
                    dbField: "sockets", 
                    domainField: 'sockets',
                    op: "in", 
                    val: this.sockets,
                    isMissing: this.sockets?.length == 0
                }));
                break;

            // needed but currently not supported, case table does not store height
            // case Case:
            //     if (this.height > 0) constraints.push({ field: 'height', op: 'gte', val: this.height });
            //     break;

            case 'Motherboard':
                constraints.push(this.makeConstraint({ 
                    dbField: "socket", 
                    domainField: 'socket',
                    op: "in", 
                    val: this.sockets,
                    isMissing: this.sockets?.length === 0
                }));
                break;
            default:
                return [];
        }

        return constraints;
    }
}