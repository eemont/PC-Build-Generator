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

        // Handle fan speed - can be object with min/max or direct values
        let fanSpeed = { min: 0, max: 0 };
        if (row.fan_rpm && typeof row.fan_rpm === 'object') {
            fanSpeed = {
                min: row.fan_rpm.min ?? 0,
                max: row.fan_rpm.max ?? 0
            };
        } else {
            fanSpeed = {
                min: row.fan_speed_min ?? 0,
                max: row.fan_speed_max ?? 0
            };
        }

        // Handle noise level - can be object with min/max or direct values
        let noiseLevel = { min: 0, max: 0 };
        if (row.decibels && typeof row.decibels === 'object') {
            noiseLevel = {
                min: row.decibels.min ?? 0,
                max: row.decibels.max ?? 0
            };
        } else {
            noiseLevel = {
                min: row.noise_level_min ?? 0,
                max: row.noise_level_max ?? 0
            };
        }

        return new CPUCooler({
            attrs,
            fanSpeed,
            noiseLevel,
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