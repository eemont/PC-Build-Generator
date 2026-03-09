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

    constructor({ brand, model, price, img = "", link = "", chipset, vram, coreClock, boostClock, length, _interface = null, slotWidth = 0, externalPower = null, tdp = null }) {
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

    static fromRow(row) {
        const attrs = super.fromRow(row);

        return new GPU({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            chipset: row.chipset?.toLowerCase?.() ?? row.chipset ?? null,
            vram: row.vram ?? 0,
            coreClock: row.core_clock ?? 0,
            boostClock: row.boost_clock ?? 0,
            length: row.length ?? 0,
            _interface: row.interface?.toLowerCase?.() ?? row.interface ?? null,
            slotWidth: row.slot_width ?? 0,
            externalPower: row.external_power?.toLowerCase?.() ?? row.external_power ?? null,
            tdp: row.tdp ?? null
        });
    }
}