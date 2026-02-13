import { PCPart } from "./PCPart.js";

export class CPUCooler extends PCPart {
    
    // RPM
    fanSpeed = {
        min: 0,
        max: 0,
    }

    // decibels
    noiseLevel = {
        min: 0,
        max: 0
    }
    radiatorSize = 0;

    sockets = [];
    height = 0;      // millimeters

    constructor({brand, model, price, img="", link="", fanSpeed, noiseLevel, radiatorSize, sockets=[], height=0}) {
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
        }

        const noiseLevel = {
            min: partObj?.decibels?.min,
            max: partObj?.decibels?.max
        }

        return new CPUCooler({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            fanSpeed,
            noiseLevel,
            radiatorSize: partObj.radiator_size
        });
    }
}