import { it, describe } from "vitest"
import { findParts } from "../domain/partsApi"

import { PowerSupply } from "../domain/PowerSupply";
import { GPU } from "../domain/GPU";
import { Motherboard } from "../domain/Motherboard";
import { Memory } from "../domain/Memory";
import { Case } from "../domain/Case";
import { CPUCooler } from "../domain/CPUCooler";
import { CPU } from "../domain/CPU";
import { Storage } from "../domain/Storage";

describe("Test compatibility between parts", () => {
    it('Find Cases compatible w/ currently selected parts', async ({ expect }) => {
        const cases = await findParts({
            partType: 'case',
            selectedParts,
            limit: 10
        });

        cases.forEach(_case => {
            // Selected Motherboard & Power Supply match form factors w/ Case
            expect.assert(_case.formFactors?.includes(selectedParts['motherboard'].formFactor));
            expect.assert(_case.formFactors?.includes(selectedParts['power-supply'].formFactor));

            // Selected GPU length is less than Case max length
            expect.assert(_case.maxGPULength >= selectedParts['video-card'].length);
        });
    });

    it('Find CPUs compatible w/ currently selected parts', async ({ expect }) => {
        const cpus = await findParts({
            partType: 'cpu',
            selectedParts,
            limit: 10
        });

        cpus.forEach(cpu => {
            // Selected CPU Cooler & Motherboard match sockets w/ CPU
            expect.assert(selectedParts['cpu-cooler'].sockets?.includes(cpu.sockets));
            expect.assert(selectedParts['motherboard'].socket === cpu.sockets);
        });
    });

    it("Find CPU Coolers compatible w/ currently selected parts", async ({ expect }) => {
        const cpuCoolers = await findParts({
            partType: 'cpu-cooler',
            selectedParts,
            limit: 10
        });

        cpuCoolers.forEach(cooler => {
            // Selected CPU & Motherboard match sockets w/ CPU Cooler
            expect.assert(cooler.sockets?.includes(selectedParts['cpu'].sockets))
            expect.assert(cooler.sockets?.includes(selectedParts['motherboard'].socket))
        });
    });

    it("Find GPU compatible w/ currently selected parts", async ({ expect }) => {
        const gpus = await findParts({
            partType: 'video-card',
            selectedParts,
            limit: 10
        });

        gpus.forEach(gpu => {
            // Selected Case has greater max length than GPU length
            expect.assert(gpu.length < selectedParts['case'].maxGPULength);

            // Selected Motherboard has at least one pcie X16 slot if GPU interface is pcie x16
            if (gpu._interface == 'pciex16') {
                expect.assert(selectedParts['motherboard'].pcieX16Slots > 0);
            }

            // Selected Power Supply has greater wattage than GPU, also must have available pin slots
            expect.assert(gpu.tdp <= selectedParts['power-supply'].wattage);
            const pins = gpu.externalPower.split('+');

            pins.forEach(pin => {
                const count = +(pin.substring(0, pin?.indexOf(" ")));
                if (pin?.indexOf("pcie 8") > 0) {
                    expect.assert(selectedParts['power-supply'].connectors.pcie8 > count)
                } 
                else if (pin?.indexOf("eps 8") > 0) {
                    expect.assert(selectedParts['power-supply'].connectors.eps8 > count)
                }
                else if (pin?.indexOf("16-pin") > 0) {
                    expect.assert(selectedParts['power-supply'].connectors.pcie16 > count)
                } 
                else if (pin?.indexOf("6-pin") > 0) {
                    expect.assert(selectedParts['power-supply'].connectors.pcie6_2 > count)
                } 
                else if (pin?.indexOf("12-pin") > 0) {
                    expect.assert(selectedParts['power-supply'].connectors.pcie12 > count)
                } else {
                    console.log('invalid/untracked pin type:', pin);
                }
            });
        });
    });

    it("Find Memory compatible w/ currently selected parts", async ({ expect }) => {
        const memoryCards = await findParts({
            partType: 'memory',
            selectedParts,
            limit: 10
        });

        memoryCards.forEach(memory => {
            // Selected Motherboard:
            // - matches memory type
            // - max ram capacity >= GPU capacity
            expect.assert(memory.memoryType == selectedParts['motherboard'].memoryTypes);
            expect.assert(memory.capacityGB <= selectedParts['motherboard'].maxRam);
        });
    });

    it("Find Motherboards compatible w/ currently selected parts", async ({ expect }) => {
        const motherboards = await findParts({
            partType: 'motherboard',
            selectedParts,
            limit: 10
        });

        motherboards.forEach(mobo => {
            // Selected Case form factors lists motherboard form factor
            expect.assert(selectedParts['case'].formFactors?.includes(mobo.formFactor));

            // Selected CPU matches Motherboard socket
            expect.assert(mobo.socket == selectedParts['cpu'].sockets);

            // Selected CPU Cooler sockets lists motherboard socket
            expect.assert(selectedParts['cpu-cooler'].sockets?.includes(mobo.socket));

            // Selected Memory 
            // - matches Motherboard memory type
            // - ram size <= Motherboard max ram size
            expect.assert(mobo.memoryTypes == selectedParts['memory'].memoryType);

            // Selected Storage has valid ports
            if (mobo.m2Slots == 0) {
                expect.assert(selectedParts['internal-hard-drive'].connectionType?.indexOf('m.2'))
            }
            else if (mobo.sataPorts == 0) {
                expect.assert(selectedParts['internal-hard-drive'].connectionType?.indexOf('msata'))
            }
        });
    });

    it("Find Power Supply compatible w/ currently selected parts", async ({ expect }) => {
        const powerSupplies = await findParts({
            partType: 'power-supply',
            selectedParts,
            limit: 10
        });

        powerSupplies.forEach(pow => {
            // Selected Case form factors lists Power Supply form factor
            expect.assert(selectedParts['case'].formFactors?.includes(pow.formFactor))

            // Selected GPU matches correct wattage & connector count
            expect.assert(pow.wattage >= selectedParts['video-card'].tdp);
            
            if (pow.connectors.pcie8 == 0) {
                expect.assert(!selectedParts['video-card'].externalPower?.includes(pow.connectors.pcie8))
            }   
            if (pow.connectors.eps8 == 0) {
                expect.assert(!selectedParts['video-card'].externalPower?.includes(pow.connectors.eps8))
            } 
            if (pow.connectors.pcie6_2 == 0) {
                expect.assert(!selectedParts['video-card'].externalPower?.includes(pow.connectors.pcie6_2))
            }
            if (pow.connectors.pcie16 ==  0) {
                expect.assert(!selectedParts['video-card'].externalPower?.includes(pow.connectors.pcie16))
            }
            if (pow.connectors.pcie12 ==  0) {
                expect.assert(!selectedParts['video-card'].externalPower?.includes(pow.connectors.pcie12))
            }
        });
    });

    it("Find Storage compatible w/ currently selected parts", async ({ expect }) => {
        const storages = await findParts({
            partType: 'internal-hard-drive',
            selectedParts,
            limit: 10
        });

        storages.forEach(storage => {
            // Selected Motherboard matches valid ports
            if (storage.connectionType?.indexOf('m.2') > 0) {
                expect.assert(selectedParts['motherboard'].m2Slots > 0);
            }
            else if (storage.connectionType?.indexOf('msata') > 0) {
                expect.assert(selectedParts['motherboard'].m2Slots > 0);
            }
        });
    });
});

const selectedParts = {
    "motherboard": Motherboard.fromRow({
        "$": null,
        "brand": "asus",
        "model": "asus rog strix b650-a gaming wifi",
        "price": 229.99,
        "img": "https://m.media-amazon.com/images/I/51W9XJLDRlL.jpg",
        "link": "https://pcpartpicker.com/product/Gjt9TW/asus-rog-strix-b650-a-gaming-wifi-atx-am5-motherboard-rog-strix-b650-a-gaming-wifi",
        "socket": "am5",
        "form_factor": "atx",
        "ram_slots": 4,
        "max_ram": 192,
        "memory_types": "ddr5",
        "chipsets": "amd b650",
        "m2_slots": 3,
        "sata_ports": 4,
        "u2_ports": 0,
        "pcie_x16_slots": 2,
        "supports_ecc": false,
        "max_memory_speed": 6400
    }),
    "cpu": CPU.fromRow({
        "$": null,
        "brand": "amd",
        "model": "amd ryzen 5 7600x",
        "price": 159,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/fd6305088c9d16d59017b380fb9c408a.256p.jpg",
        "link": "https://pcpartpicker.com/product/66C48d/amd-ryzen-5-7600x-47-ghz-6-core-processor-100-100000593wof",
        "cores": 6,
        "tdp": 105,
        "integrated_graphics": "radeon",
        "multithreading": true,
        "sockets": "am5",
        "memory_type": "128 gb"
    }),
    "cpu-cooler": CPUCooler.fromRow({
        "$": null,
        "brand": "thermalright",
        "model": "thermalright silver soul 110",
        "price": 28.9,
        "img": "https://m.media-amazon.com/images/I/41bAbeoiG9L.jpg",
        "link": "https://pcpartpicker.com/product/Gs4Ycf/thermalright-silver-soul-110-54-cfm-cpu-cooler-ss110-white",
        "fan_speed": {
            "min": 2500,
            "max": 2500
        },
        "noise_level": {
            "min": 23,
            "max": 23
        },
        "radiator_size": 0,
        "sockets": [
            "am4",
            "am5",
            "lga1150",
            "lga1151",
            "lga1155",
            "lga1156",
            "lga1200",
            "lga1700",
            "lga1851",
            "lga2011",
            "lga2011-3",
            "lga2066"
        ],
        "height": 110
    }),
    "memory": Memory.fromRow({
        "$": null,
        "brand": "\ncorsair\n",
        "model": "corsair vengeance rgb 128 gb",
        "price": 459.99,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/97f4efea4a46c0f35748c429fca636cc.256p.jpg",
        "link": "https://pcpartpicker.com/product/PNsV3C/corsair-vengeance-rgb-128-gb-4-x-32-gb-ddr5-5600-cl40-memory-cmh128gx5m4b5600c40",
        "memory_type": "ddr5",
        "capacity_gb": 128,
        "error_correction": "non-ecc / unbuffered",
        "form_factor": "288-pin dimm (ddr5)"
    }),
    "internal-hard-drive": Storage.fromRow({
        "$": null,
        "brand": "\nsamsung\n",
        "model": "samsung 980 pro",
        "price": 89.99,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/81d258654f0eb603dc240de6cbca9754.256p.jpg",
        "link": "https://pcpartpicker.com/product/w96qqs/samsung-980-pro-500-gb-m2-2280-nvme-solid-state-drive-mz-v8p500bam",
        "type": "ssd",
        "capacity": 500,
        "form_factor": "m.2-2280",
        "connection_type": "m.2 pcie 4.0 x4",
        "nvme": false
    }),
    "video-card": GPU.fromRow({
        "$": null,
        "brand": "gigabyte",
        "model": "gigabyte gaming oc",
        "price": 329.99,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/b537a4618dfe7ddd95ae47d707977a18.256p.jpg",
        "link": "https://pcpartpicker.com/product/sqyH99/gigabyte-gaming-oc-radeon-rx-7600-xt-16-gb-video-card-gv-r76xtgaming-oc-16gd",
        "chipset": "radeon rx 7600 xt",
        "vram": 16,
        "core_clock": 1720,
        "boost_clock": 0,
        "length": 281,
        "interface": "pciex16",
        "slot_width": 3,
        "external_power": "2 pcie 8-pin",
        "tdp": 190
    }),
    "case": Case.fromRow({
        "$": null,
        "brand": "nzxt",
        "model": "nzxt h5 elite",
        "price": 104.95,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/1b51391b69260eb2c1d9d53aa2eeb555.256p.jpg",
        "link": "https://pcpartpicker.com/product/FbWzK8/nzxt-h5-elite-atx-mid-tower-case-cc-h51eb-01",
        "type": "atx mid tower",
        "internal_bays": 17,
        "form_factors": [
            "atx",
            "eatx",
            "micro atx",
            "mini itx"
        ],
        "max_gpu_length": 365
    }),
    "power-supply": PowerSupply.fromRow({
        "$": null,
        "brand": "asus",
        "model": "asus tuf gaming 1200g",
        "price": 205.73,
        "img": "//cdna.pcpartpicker.com/static/forever/images/product/012e8a866cc57671dae08a861fb07c1c.256p.jpg",
        "link": "https://pcpartpicker.com/product/skrqqs/asus-tuf-gaming-1200g-1200-w-80-gold-certified-fully-modular-atx-power-supply-tuf-gaming-1200g",
        "form_factor": "atx",
        "efficiency_rating": "80+ gold",
        "wattage": 1200,
        "length": 150,
        "eps8": 2,
        "pcie8": 4,
        "pcie6_2": 0,
        "pcie16": 2,
        "pcie12": 0
    })
};
