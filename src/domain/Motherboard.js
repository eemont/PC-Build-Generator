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

    static decode(partObj) {
        const attrs = super.decode(partObj);
        const maxRamGB = typeof partObj?.max_ram == "object"
            ? partObj.max_ram.total / 1000000000
            : partObj.max_ram / 1000000000;

        return new Motherboard({
            brand: attrs.brand,
            model: attrs.model,
            price: attrs.price,
            socket: partObj?.socket?.toLowerCase(),
            formFactor: partObj?.form_factor?.toLowerCase(),
            ramSlots: partObj?.ram_slots,
            maxRamGB
        });
    }

    constructor({brand, model, price, img="", link="", socket, formFactor, ramSlots, maxRam, memoryTypes=null, chipsets=null, m2Slots=null, sataPorts=null, u2Ports=null, pcieX16Slots=null, supportsECC=false, maxMemorySpeed=null}) {
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
}