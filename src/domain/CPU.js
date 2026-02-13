import { PCPart } from "./PCPart.js";

export class CPU extends PCPart {
    cores = 0;
    tdp = 0;                        // watts
    integratedGraphics = null
    multithreading = false;

    sockets = null;
    memoryType = null;

    constructor({brand, model, price, img="", link="", cores, tdp, integratedGraphics, multithreading, sockets=null, memoryType=null}) {
        super(brand, model, price, img, link);
        this.cores = cores;
        this.tdp = tdp;
        this.integratedGraphics = integratedGraphics;
        this.multithreading = multithreading;
        this.sockets = sockets;
        this.memoryType = memoryType;
    }

    static decode(partObj) {
        const attrs = super.decode(partObj);

        return new CPU({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            cores: partObj?.cores,
            tdp: partObj?.tdp,
            integratedGraphics: partObj?.integrated_graphics?.toLowerCase(),
            multithreading: partObj?.multithreading
        })
    }
}