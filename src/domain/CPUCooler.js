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

    constructor({ brand, model, price, img = "", link = "", fanSpeed, noiseLevel, radiatorSize, sockets = [], height = 0 }) {
        super(brand, model, price, img, link);
        this.fanSpeed = fanSpeed;
        this.noiseLevel = noiseLevel;
        this.radiatorSize = radiatorSize;
        this.sockets = sockets;
        this.height = height;
    }

    static decode(partObj) {
        const attrs = super.decode(partObj);
        
        const fanSpeed = {
            min: partObj?.fan_rpm?.min,
            max: partObj?.fan_rpm?.max
        };

        const noiseLevel = {
            min: partObj?.decibels?.min,
            max: partObj?.decibels?.max
        };

        return new CPUCooler({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            fanSpeed,
            noiseLevel,
            radiatorSize: partObj.radiator_size
        });
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new CPUCooler({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
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
}