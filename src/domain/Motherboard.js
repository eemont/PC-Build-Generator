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

        return new Motherboard({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            img: attrs.img,
            link: attrs.link,
            socket: row.socket?.toLowerCase?.() ?? row.socket ?? null,
            formFactor: row.form_factor?.toLowerCase?.() ?? row.form_factor ?? null,
            ramSlots: row.ram_slots ?? 0,
            maxRam: row.max_ram ?? 0,
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

    getCompatibilityFields(targetPartClass) {
        const constraints = []; 

        switch(targetPartClass.name) {
            case 'Case':
                if (this.formFactor != null) constraints.push({ field: "form_factors", op: "contains", val: [this.formFactor]});
                break;
            case 'CPU':
                if (this.socket != null) constraints.push({ field: "sockets", op: 'eq', val: this.socket });
                break;
            case 'CPUCooler':
                if (this.socket != null) constraints.push({ field: "sockets", op: 'contains', val: [this.socket] });
                break;
            case 'Memory':
                if (this.memoryTypes != null) constraints.push({ field: "memory_type", op: "eq", val: this.memoryTypes });
                if (this.maxRam > 0) constraints.push({ field: "capacity_gb", op: "lte", val: this.maxRam});
                break;
            case 'Storage':
                if (this.m2Slots == 0) {
                    constraints.push({ field: 'connection_type', op: 'notContains', val: 'm.2' });
                }
                else if (this.sataPorts == 0) {
                    constraints.push({ field: 'connection_type', op: 'notContains', val: 'msata' });
                }
                break;
            default:
                return [];
        }

        return constraints;
    }
}