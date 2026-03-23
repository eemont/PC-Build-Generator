import { PCPart } from "./PCPart.js";

export class Motherboard extends PCPart {
    socket = "";
    formFactor = "";
    ramSlots = 0;
    maxRam = 0;         // GB

    memoryTypes = null;
    chipsets = null;
    m2Slots = 0;
    sataPorts = 0;
    u2Ports = 0;
    pcieX16Slots = 0;
    supportsECC = false;
    maxMemorySpeed = 0;

    constructor({ brand, model, price, img = "", link = "", socket, formFactor, ramSlots, maxRam, memoryTypes = null, chipsets = null, m2Slots = null, sataPorts = null, u2Ports = null, pcieX16Slots = null, supportsECC = false, maxMemorySpeed = null }) {
        super(brand, model, price, img, link);
        this.socket = socket;
        this.formFactor = formFactor;
        this.ramSlots = ramSlots;
        this.maxRam = maxRam;

        this.memoryTypes = memoryTypes;
        this.chipsets = chipsets;
        this.m2Slots = m2Slots;
        this.sataPorts = sataPorts;
        this.u2Ports = u2Ports;
        this.pcieX16Slots = pcieX16Slots;
        this.supportsECC = supportsECC;
        this.maxMemorySpeed = maxMemorySpeed;
    }

    static fromRow(row) {
        const attrs = super.fromRow(row);

        // Handle max RAM conversion from bytes to GB
        let maxRam = 0;
        if (row.max_ram && typeof row.max_ram === 'object' && row.max_ram.total) {
            maxRam = Math.round(row.max_ram.total / (1024 * 1024 * 1024)); // Convert bytes to GB
        } else if (typeof row.max_ram === 'number') {
            maxRam = row.max_ram;
        }

        return new Motherboard({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            socket: row.socket?.toLowerCase?.() ?? row.socket ?? "",
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? "",
            ramSlots: row.ram_slots ?? 0,
            maxRam: maxRam,
            memoryTypes: row.memory_types ?? null,
            chipsets: row.chipsets ?? null,
            m2Slots: row.m2_slots ?? 0,
            sataPorts: row.sata_ports ?? 0,
            u2Ports: row.u2_ports ?? 0,
            pcieX16Slots: row.pcie_x16_slots ?? 0,
            supportsECC: row.supports_ecc ?? false,
            maxMemorySpeed: row.max_memory_speed ?? 0
        });
    }

    static decode(row) {
        return this.fromRow(row);
    }
}