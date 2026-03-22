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
    waterCooled = false;

    constructor({ attrs, fanSpeed, noiseLevel, radiatorSize, sockets = [], height = 0, waterCooled = false }) {
        super(attrs);
        this.fanSpeed = fanSpeed;
        this.noiseLevel = noiseLevel;
        this.radiatorSize = radiatorSize;
        this.sockets = sockets;
        this.height = height;
        this.waterCooled = waterCooled;
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
            height: row.height ?? 0,
            waterCooled: row.water_cooled ?? false
        });
    }

    getCompatibilityFields(targetPart) {
        const constraints = [];
        const partClass = targetPart.constructor.name;

        switch(partClass) {
            case 'CPU':
                constraints.push(this.makeConstraint({ 
                    dbField: "sockets", 
                    domainField: 'sockets',
                    op: "in", 
                    val: this.sockets,
                    isMissing: this.sockets?.length == 0
                }));
                break;

            case 'Case':
                if (this.waterCooled) {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'max_supported_radiator_length', 
                        domainField: 'maxSupportedRadiatorLength',
                        op: 'gte', 
                        val: this.radiatorSize,
                        isMissing: this.radiatorSize == 0 || this.radiatorSize == null
                    }));
                } else {
                    constraints.push(this.makeConstraint({ 
                        dbField: 'max_cpu_cooler_height', 
                        domainField: 'maxCPUCoolerHeight',
                        op: 'gte', 
                        val: this.height,
                        isMissing: this.height == 0 || this.height == null
                    }));
                }
                break;

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