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
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            fanSpeed: fanSpeed,
            noiseLevel: noiseLevel,
            radiatorSize: row.radiator_size ?? 0,
            sockets: row.sockets ?? [],
            height: row.height ?? 0
        });
    }

    static decode(row) {
        return this.fromRow(row);
    }
}