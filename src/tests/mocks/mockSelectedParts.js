import { PowerSupply } from "../../domain/PowerSupply";
import { GPU } from "../../domain/GPU";
import { Motherboard } from "../../domain/Motherboard";
import { Memory } from "../../domain/Memory";
import { Case } from "../../domain/Case";
import { CPUCooler } from "../../domain/CPUCooler";
import { CPU } from "../../domain/CPU";
import { Storage } from "../../domain/Storage";

export const mockSelectedParts = {
    "gpu": {
        "part": new GPU({
            attrs: {
                "id": 103,
                "brand": "msi",
                "model": "msi ventus 2x xs oc",
                "price": 199.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/cd30fd761012460241548ac2a5a9f8a4.256p.jpg",
                "link": "https://pcpartpicker.com/product/3Xn9TW/msi-ventus-2x-xs-oc-geforce-rtx-3050-8gb-8-gb-video-card-rtx-3050-ventus-2x-xs-8g-oc",
            },
            "chipset": "geforce rtx 3050 8gb",
            "vram": 8,
            "coreClock": 1550,
            "boostClock": 1807,
            "length": 205,
            "_interface": "pcie x16",
            "slotWidth": 3,
            "externalPower": "1 pcie 6-pin",
            "tdp": 115
        }),
        "compatible": true,
        "issues": []
    },
    "cpu": {
        "part": new CPU({
            attrs: {
                "id": 6,
                "brand": "intel",
                "model": "intel core i7-14700k",
                "price": 389.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/c3e5d01cec2fa20b6f47fe8a400c08d6.256p.jpg",
                "link": "https://pcpartpicker.com/product/BmWJ7P/intel-core-i7-14700k-34-ghz-20-core-processor-bx8071514700k",
            },
            "cores": 20,
            "tdp": 125,
            "integratedGraphics": "intel uhd graphics 770",
            "multithreading": false,
            "sockets": "lga1700",
            "memoryType": "192 gb"
        }),
        "compatible": true,
        "issues": []
    },
    "mobo": {
        "part": new Motherboard({
            attrs: {
                "id": 68,
                "brand": "asus",
                "model": "asus rog maximus z790 formula",
                "price": 739.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/6bcf5b97a60640346360d29a75dbe3b6.256p.jpg",
                "link": "https://pcpartpicker.com/product/V6mNnQ/asus-rog-maximus-z790-formula-atx-lga1700-motherboard-rog-maximus-z790-formula",
            },
            "socket": "lga1700",
            "formFactor": "atx",
            "ramSlots": 4,
            "maxRam": 192,
            "memoryTypes": "ddr5",
            "chipsets": "intel z790",
            "m2Slots": 5,
            "sataPorts": 4,
            "u2Ports": 0,
            "pcieX16Slots": 2,
            "supportsECC": false,
            "maxMemorySpeed": 8000
        }),
        "compatible": true,
        "issues": []
    },
    "memory": {
        "part": new Memory({
            attrs: {
                "id": 74,
                "brand": "corsair",
                "model": "corsair vengeance rgb 192 gb",
                "price": 649.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/fad60fde2b96ce5d811577195e0fe5d3.256p.jpg",
                "link": "https://pcpartpicker.com/product/xrV2FT/corsair-vengeance-rgb-192-gb-4-x-48-gb-ddr5-5200-cl38-memory-cmh192gx5m4b5200c38",
            },
            "memoryType": "ddr5",
            "capacityGB": 192,
            "errorCorrection": "non-ecc / unbuffered",
            "formFactor": "288-pin dimm (ddr5)"
        }),
        "compatible": true,
        "issues": []
    },
    "storage": {
        "part": new Storage({
            attrs: {
                "id": 15,
                "brand": "kingston",
                "model": "kingston nv2",
                "price": 42.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/b95d0c7234714c4d7bb0f246c23cd3b9.256p.jpg",
                "link": "https://pcpartpicker.com/product/QvpzK8/kingston-nv2-500-gb-m2-2280-pcie-40-x4-nvme-solid-state-drive-snv2s500g",
            },
            "type": "ssd",
            "capacity": 500,
            "formFactor": "m.2-2280",
            "connectionType": "m.2 pcie 4.0 x4",
            "nvme": false
        }),
        "compatible": true,
        "issues": []
    },
    "case": {
        "part": new Case({
            attrs: {
                "id": 119,
                "brand": "fractal design",
                "model": "fractal design define r5",
                "price": 124.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/3803ebb09f64ddc954a86cb7b45a8ebd.256p.jpg",
                "link": "https://pcpartpicker.com/product/sjX2FT/fractal-design-case-fdcadefr5bk",
            },
            "type": "atx mid tower",
            "internalBays": 57,
            "formFactors": ["atx", "micro atx", "mini itx"],
            "maxGPULength": 310
        }),
        "compatible": true,
        "issues": []
    },
    "psu": {
        "part": new PowerSupply({
            attrs: {
                "id": 283,
                "brand": "adata",
                "model": "adata xpg core reactor 750",
                "price": 89.99,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/4209ee183a6b7cc2adae27739e2ade8c.256p.jpg",
                "link": "https://pcpartpicker.com/product/DkWBD3/adata-xpg-core-reactor-750-750-w-80-gold-certified-fully-modular-atx-power-supply-corereactor750g-bkcus",
            },
            "formFactor": "atx",
            "efficiencyRating": "80+ gold",
            "wattage": 750,
            "length": 140,
            "connectors": {
                "eps8": 2,
                "pcie8": 0,
                "pcie6_2": 6,
                "pcie16": 0,
                "pcie12": 0
            }
        }),
        "compatible": true,
        "issues": []
    },
    "cooler": {
        "part": new CPUCooler({
            attrs: {
                "id": 152,
                "brand": "be quiet!",
                "model": "be quiet! pure rock 2 fx",
                "price": 49.9,
                "img": "//cdna.pcpartpicker.com/static/forever/images/product/6c8d81d6a381f89132093a4b0707e1f8.256p.jpg",
                "link": "https://pcpartpicker.com/product/2L3gXL/be-quiet-pure-rock-2-fx-cpu-cooler-bk033",
            },
            "fanSpeed": { "min": 0, "max": 0 },
            "noiseLevel": { "min": 7.9, "max": 24.4 },
            "radiatorSize": 0,
            "sockets": ["am4", "am5", "lga1150", "lga1151", "lga1155", "lga1156", "lga1200", "lga1700", "lga1851", "lga2011", "lga2011-3", "lga2066"],
            "height": 155
        }),
        "compatible": true,
        "issues": []
    }
};
