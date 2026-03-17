import { PCPart } from "./PCPart.js";

export class CPU extends PCPart {
    cores = 0;
    tdp = 0;                        // watts
    integratedGraphics = null;
    multithreading = false;

    sockets = null;
    memoryType = null;

    constructor({ brand, model, price, img = "", link = "", cores, tdp, integratedGraphics, multithreading, sockets = null, memoryType = null }) {
        super(brand, model, price, img, link);
        this.cores = cores;
        this.tdp = tdp;
        this.integratedGraphics = integratedGraphics;
        this.multithreading = multithreading;
        this.sockets = sockets;
        this.memoryType = memoryType;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new CPU({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            cores: row.cores,
            tdp: row.tdp,
            integratedGraphics: row.integrated_graphics?.toLowerCase?.() ?? row.integrated_graphics ?? null,
            multithreading: row.multithreading,
            sockets: row.sockets ?? null,
            memoryType: row.memory_type?.toLowerCase?.() ?? row.memory_type ?? null
        });
    }
}