import { it, describe } from "vitest"
import { findParts } from "../domain/partsApi"

import { mockSelectedParts } from "./mocks/mockSelectedParts.js";


describe("Test compatibility between parts", () => {
    it('Find Cases compatible w/ currently selected parts', async ({ expect }) => {
        const cases = await findParts({
            partType: 'case',
            mockSelectedParts,
            limit: 10
        });

        cases.forEach(_case => {
            expect.assert(_case.compatible === true);

            // Selected Motherboard & Power Supply match form factors w/ Case
            // expect.assert(_case.formFactors?.includes(mockSelectedParts['motherboard'].formFactor));
            // expect.assert(_case.formFactors?.includes(mockSelectedParts['power-supply'].formFactor));

            // // Selected GPU length is less than Case max length
            // expect.assert(_case.maxGPULength >= mockSelectedParts['video-card'].length);
        });
    });

    it('Find CPUs compatible w/ currently selected parts', async ({ expect }) => {
        const cpus = await findParts({
            partType: 'cpu',
            mockSelectedParts,
            limit: 10
        });

        cpus.forEach(cpu => {
            expect.assert(cpu.compatible === true);

            // Selected CPU Cooler & Motherboard match sockets w/ CPU
            // expect.assert(mockSelectedParts['cpu-cooler'].sockets?.includes(cpu.sockets));
            // expect.assert(mockSelectedParts['motherboard'].socket === cpu.sockets);
        });
    });

    it("Find CPU Coolers compatible w/ currently selected parts", async ({ expect }) => {
        const cpuCoolers = await findParts({
            partType: 'cpu-cooler',
            mockSelectedParts,
            limit: 10
        });

        cpuCoolers.forEach(cooler => {
            expect.assert(cooler.compatible === true);

            // Selected CPU & Motherboard match sockets w/ CPU Cooler
            // expect.assert(cooler.sockets?.includes(mockSelectedParts['cpu'].sockets))
            // expect.assert(cooler.sockets?.includes(mockSelectedParts['motherboard'].socket))
        });
    });

    it("Find GPU compatible w/ currently selected parts", async ({ expect }) => {
        const gpus = await findParts({
            partType: 'video-card',
            mockSelectedParts,
            limit: 10
        });

        gpus.forEach(gpu => {
            expect.assert(gpu.compatible === true);

            // Selected Case has greater max length than GPU length
            // expect.assert(gpu.length < mockSelectedParts['case'].maxGPULength);

            // Selected Motherboard has at least one pcie X16 slot if GPU interface is pcie x16
            // if (gpu._interface == 'pciex16') {
            //     expect.assert(mockSelectedParts['motherboard'].pcieX16Slots > 0);
            // }

            // Selected Power Supply has greater wattage than GPU, also must have available pin slots
            // expect.assert(gpu.tdp <= mockSelectedParts['power-supply'].wattage);
            // const pins = gpu.externalPower.split('+');

            // pins.forEach(pin => {
            //     const count = +(pin.substring(0, pin?.indexOf(" ")));
            //     if (pin?.indexOf("pcie 8") > 0) {
            //         expect.assert(mockSelectedParts['power-supply'].connectors.pcie8 > count)
            //     } 
            //     else if (pin?.indexOf("eps 8") > 0) {
            //         expect.assert(mockSelectedParts['power-supply'].connectors.eps8 > count)
            //     }
            //     else if (pin?.indexOf("16-pin") > 0) {
            //         expect.assert(mockSelectedParts['power-supply'].connectors.pcie16 > count)
            //     } 
            //     else if (pin?.indexOf("6-pin") > 0) {
            //         expect.assert(mockSelectedParts['power-supply'].connectors.pcie6_2 > count)
            //     } 
            //     else if (pin?.indexOf("12-pin") > 0) {
            //         expect.assert(mockSelectedParts['power-supply'].connectors.pcie12 > count)
            //     } else {
            //         console.log('invalid/untracked pin type:', pin);
            //     }
            // });
        });
    });

    it("Find Memory compatible w/ currently selected parts", async ({ expect }) => {
        const memoryCards = await findParts({
            partType: 'memory',
            mockSelectedParts,
            limit: 10
        });

        memoryCards.forEach(memory => {
            expect.assert(memory.compatible === true);

            // Selected Motherboard:
            // - matches memory type
            // - max ram capacity >= GPU capacity
            // expect.assert(memory.memoryType == mockSelectedParts['motherboard'].memoryTypes);
            // expect.assert(memory.capacityGB <= mockSelectedParts['motherboard'].maxRam);
        });
    });

    it("Find Motherboards compatible w/ currently selected parts", async ({ expect }) => {
        const motherboards = await findParts({
            partType: 'motherboard',
            mockSelectedParts,
            limit: 10
        });

        motherboards.forEach(mobo => {
            expect.assert(mobo.compatible === true);

            // Selected Case form factors lists motherboard form factor
            // expect.assert(mockSelectedParts['case'].formFactors?.includes(mobo.formFactor));

            // Selected CPU matches Motherboard socket
            // expect.assert(mobo.socket == mockSelectedParts['cpu'].sockets);

            // Selected CPU Cooler sockets lists motherboard socket
            // expect.assert(mockSelectedParts['cpu-cooler'].sockets?.includes(mobo.socket));

            // Selected Memory 
            // - matches Motherboard memory type
            // - ram size <= Motherboard max ram size
            // expect.assert(mobo.memoryTypes == mockSelectedParts['memory'].memoryType);

            // Selected Storage has valid ports
            // if (mobo.m2Slots == 0) {
            //     expect.assert(mockSelectedParts['internal-hard-drive'].connectionType?.indexOf('m.2'))
            // }
            // else if (mobo.sataPorts == 0) {
            //     expect.assert(mockSelectedParts['internal-hard-drive'].connectionType?.indexOf('msata'))
            // }
        });
    });

    it("Find Power Supply compatible w/ currently selected parts", async ({ expect }) => {
        const powerSupplies = await findParts({
            partType: 'power-supply',
            mockSelectedParts,
            limit: 10
        });

        powerSupplies.forEach(pow => {
            expect.assert(pow.compatible === true);

            // Selected Case form factors lists Power Supply form factor
            // expect.assert(mockSelectedParts['case'].formFactors?.includes(pow.formFactor))

            // Selected GPU matches correct wattage & connector count
            // expect.assert(pow.wattage >= mockSelectedParts['video-card'].tdp);
            
            // if (pow.connectors.pcie8 == 0) {
            //     expect.assert(!mockSelectedParts['video-card'].externalPower?.includes(pow.connectors.pcie8))
            // }   
            // if (pow.connectors.eps8 == 0) {
            //     expect.assert(!mockSelectedParts['video-card'].externalPower?.includes(pow.connectors.eps8))
            // } 
            // if (pow.connectors.pcie6_2 == 0) {
            //     expect.assert(!mockSelectedParts['video-card'].externalPower?.includes(pow.connectors.pcie6_2))
            // }
            // if (pow.connectors.pcie16 ==  0) {
            //     expect.assert(!mockSelectedParts['video-card'].externalPower?.includes(pow.connectors.pcie16))
            // }
            // if (pow.connectors.pcie12 ==  0) {
            //     expect.assert(!mockSelectedParts['video-card'].externalPower?.includes(pow.connectors.pcie12))
            // }
        });
    });

    it("Find Storage compatible w/ currently selected parts", async ({ expect }) => {
        const storages = await findParts({
            partType: 'internal-hard-drive',
            mockSelectedParts,
            limit: 10
        });

        storages.forEach(storage => {
            expect.assert(storage.compatible === true);

            // Selected Motherboard matches valid ports
            // if (storage.connectionType?.indexOf('m.2') > 0) {
            //     expect.assert(mockSelectedParts['motherboard'].m2Slots > 0);
            // }
            // else if (storage.connectionType?.indexOf('msata') > 0) {
            //     expect.assert(mockSelectedParts['motherboard'].m2Slots > 0);
            // }
        });
    });
});


