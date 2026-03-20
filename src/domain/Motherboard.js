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

    constructor({ attrs, socket, formFactor, ramSlots, maxRam, memoryTypes = null, chipsets = null, m2Slots = null, sataPorts = null, u2Ports = null, pcieX16Slots = null, supportsECC = false, maxMemorySpeed = null }) {
        super(attrs);
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
            attrs,
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
                constraints.push(this.makeConstraint({ 
                    dbField: 'form_factors', 
                    domainField: 'formFactors',
                    op: "contains", 
                    val: [this.formFactor],
                    isMissing: this.formFactor == null
                }));
                break;
            case 'CPU':
                constraints.push(this.makeConstraint({
                    dbField: 'sockets',
                    domainField: 'sockets',
                    op: 'eq',
                    val: this.socket,
                    isMissing: this.socket == null
                }));
                break;
            case 'CPUCooler':
                constraints.push(this.makeConstraint({
                    dbField: 'sockets',
                    domainField: 'sockets',
                    op: 'contains',
                    val: [this.socket],
                    isMissing: this.socket == null
                }));
                break;
            case 'Memory':
                constraints.push(this.makeConstraint({
                    dbField: 'memory_type',
                    domainField: 'memoryType',
                    op: 'eq',
                    val: this.memoryTypes,
                    isMissing: this.memoryTypes == null
                }));
                constraints.push(this.makeConstraint({
                    dbField: 'capacity_gb',
                    domainField: 'capacityGB',
                    op: 'lte',
                    val: this.maxRam,
                    isMissing: this.maxRam === 0
                }));
                break;

            // need to refactor to fit these
            case 'Storage':
                if (this.m2Slots === 0) {
                    constraints.push(this.makeConstraint({
                        dbField: 'connection_type',
                        domainField: 'connectionType',
                        op: 'notLike',
                        val: 'm.2',
                        isMissing: true
                    }));
                }
                if (this.sataPorts === 0) {
                    constraints.push(this.makeConstraint({
                        dbField: 'connection_type',
                        domainField: 'connectionType',
                        op: 'notLike',
                        val: 'sata',
                        isMissing: true
                    }));
                }
                break;
            default:
                return [];
        }

        return constraints;
    }
}