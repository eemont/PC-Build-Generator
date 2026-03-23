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

        // Handle vram conversion from bytes to GB
        let vram = 0;
        if (row.vram && typeof row.vram === 'object' && row.vram.total) {
            vram = Math.round(row.vram.total / (1024 * 1024 * 1024)); // Convert bytes to GB
        } else if (typeof row.vram === 'number') {
            vram = row.vram;
        }

        // Handle clock conversions from Hz to GHz
        let coreClock = 0;
        if (row.core_clock && typeof row.core_clock === 'object' && row.core_clock.cycles) {
            coreClock = row.core_clock.cycles / 1000000000; // Convert Hz to GHz
        } else if (typeof row.core_clock === 'number') {
            coreClock = row.core_clock;
        }

        let boostClock = 0;
        if (row.boost_clock && typeof row.boost_clock === 'object' && row.boost_clock.cycles) {
            boostClock = row.boost_clock.cycles / 1000000000; // Convert Hz to GHz
        } else if (typeof row.boost_clock === 'number') {
            boostClock = row.boost_clock;
        }

        return new GPU({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            chipset: row.chipset?.toLowerCase?.() ?? row.chipset ?? null,
            vram: vram,
            coreClock: coreClock,
            boostClock: boostClock,
            length: row.length ?? 0,
            _interface: row.interface?.toLowerCase?.() ?? row.interface ?? null,
            slotWidth: row.slot_width ?? 0,
            externalPower: row.external_power?.toLowerCase?.() ?? row.external_power ?? null,
            tdp: row.tdp ?? null
        });
    }

    static decode(row) {
        return this.fromRow(row);
    }
}