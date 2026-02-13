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

    constructor({brand, model, price, img="", link="", chipset, vram, coreClock, boostClock, length, _interface=null, slotWidth=0, externalPower=null, tdp=null}) {
        super(brand, model, price, img, link);
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

    static decode(partObj) {
        const attrs = super.decode(partObj);

        return new GPU({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            chipset: partObj.chipset?.toLowerCase(),
            vram: (partObj.vram?.total || 0) / 1000000000,                  // b -> Gb
            coreClock: (partObj.core_clock?.cycles || 0) / 1000000000,      // hz -> ghz
            boostClock: (partObj?.boost_clock?.cycles || 0) / 1000000000,   // hz -> ghz
            length: partObj.length
        });
    }
}