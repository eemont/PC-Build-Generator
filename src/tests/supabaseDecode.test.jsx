import { describe, it, expect } from "vitest";

import { CPU } from "../domain/CPU";
import { GPU } from "../domain/GPU";
import { Memory } from "../domain/Memory";
import { Storage } from "../domain/Storage";
import { CPUCooler } from "../domain/CPUCooler";
import { Motherboard } from "../domain/Motherboard";

describe("Supabase decode mapping", () => {
  it("B-01: CPU part row from Supabase maps correctly into app model", () => {
    const cpuRow = {
      brand: "AMD",
      model: "Ryzen 7 7700X",
      price: 329.99,
      cores: 8,
      tdp: 105,
      integrated_graphics: "Radeon Graphics",
      multithreading: true,
    };

    const decoded = CPU.decode(cpuRow);

    expect(decoded).toBeInstanceOf(CPU);
    expect(decoded.brand).toBe("amd");
    expect(decoded.model).toBe("ryzen 7 7700x");
    expect(decoded.price).toBe(329.99);
    expect(decoded.cores).toBe(8);
    expect(decoded.tdp).toBe(105);
    expect(decoded.integratedGraphics).toBe("radeon graphics");
    expect(decoded.multithreading).toBe(true);
  });

  it("B-02: GPU part row from Supabase maps correctly into app model", () => {
    const gpuRow = {
      brand: "MSI",
      model: "RTX 4070 SUPER VENTUS 2X",
      price: 599.99,
      chipset: "GeForce RTX 4070 SUPER",
      vram: { total: 12884901888 }, // 12 GB in bytes
      core_clock: { cycles: 1980000000 },
      boost_clock: { cycles: 2475000000 },
      length: 242,
    };

    const decoded = GPU.decode(gpuRow);

    expect(decoded).toBeInstanceOf(GPU);
    expect(decoded.brand).toBe("msi");
    expect(decoded.model).toBe("rtx 4070 super ventus 2x");
    expect(decoded.price).toBe(599.99);
    expect(decoded.chipset).toBe("geforce rtx 4070 super");
    expect(decoded.vram).toBe(12);
    expect(decoded.coreClock).toBe(1.98);
    expect(decoded.boostClock).toBe(2.475);
    expect(decoded.length).toBe(242);
  });

  it("B-03: Memory part row from Supabase maps correctly into app model", () => {
    const memoryRow = {
      brand: "Corsair",
      model: "Vengeance DDR5",
      price: 109.99,
      number_of_modules: 2,
      module_size: { total: 17179869184 }, // 16 GB per module in bytes
      module_type: "DDR5",
      error_correction: "Non-ECC",
    };

    const decoded = Memory.decode(memoryRow);

    expect(decoded).toBeInstanceOf(Memory);
    expect(decoded.brand).toBe("corsair");
    expect(decoded.model).toBe("vengeance ddr5");
    expect(decoded.price).toBe(109.99);
    expect(decoded.memoryType).toBe("ddr5");
    expect(decoded.capacityGB).toBe(32);
    expect(decoded.errorCorrection).toBe("non-ecc");
  });

  it("B-04: Storage part row from Supabase maps correctly into app model", () => {
    const storageRow = {
      brand: "Samsung",
      model: "990 Pro",
      price: 149.99,
      storage_type: "SSD",
      capacity: { total: 2000000000000 },
      form_factor: "M.2-2280",
      interface: "PCIe 4.0 x4",
    };

    const decoded = Storage.decode(storageRow);

    expect(decoded).toBeInstanceOf(Storage);
    expect(decoded.brand).toBe("samsung");
    expect(decoded.model).toBe("990 pro");
    expect(decoded.price).toBe(149.99);
    expect(decoded.type).toBe("ssd");
    expect(decoded.capacity).toBe(2000);
    expect(decoded.formFactor).toBe("M.2-2280");
    expect(decoded.connectionType).toBe("pcie 4.0 x4");
  });

  it("B-05: CPU cooler row supports min/max value decoding", () => {
    const coolerRow = {
      brand: "Cooler Master",
      model: "Hyper 212",
      price: 39.99,
      fan_rpm: { min: 650, max: 1800 },
      decibels: { min: 8, max: 27 },
      radiator_size: 120,
    };

    const decoded = CPUCooler.decode(coolerRow);

    expect(decoded).toBeInstanceOf(CPUCooler);
    expect(decoded.brand).toBe("cooler master");
    expect(decoded.model).toBe("hyper 212");
    expect(decoded.price).toBe(39.99);
    expect(decoded.fanSpeed).toEqual({ min: 650, max: 1800 });
    expect(decoded.noiseLevel).toEqual({ min: 8, max: 27 });
    expect(decoded.radiatorSize).toBe(120);
  });

  it("B-06: Motherboard row with object-based max RAM decodes correctly", () => {
    const motherboardRow = {
      brand: "ASUS",
      model: "ROG STRIX B650-A",
      price: 219.99,
      max_ram: { total: 206158430208 }, // 192 GB in bytes
      socket: "AM5",
      form_factor: "ATX",
      ram_slots: 4,
    };

    const decoded = Motherboard.decode(motherboardRow);

    expect(decoded).toBeInstanceOf(Motherboard);
    expect(decoded.brand).toBe("asus");
    expect(decoded.model).toBe("rog strix b650-a");
    expect(decoded.price).toBe(219.99);
    expect(decoded.socket).toBe("am5");
    expect(decoded.formFactor).toBe("atx");
    expect(decoded.ramSlots).toBe(4);

    // Expected behavior for 192,000,000,000 bytes -> 192 GB
    expect(decoded.maxRam).toBe(192);
  });
});