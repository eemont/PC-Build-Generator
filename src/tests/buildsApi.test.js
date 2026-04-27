import { describe, it, beforeEach, vi, expect } from "vitest";
import { supabase } from "../lib/supabaseClient";
import { getUserBuilds, saveBuild, deleteBuild } from "../lib/buildsApi";

// Mock the supabase client
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the domain classes
vi.mock("../domain/CPU", () => ({
  CPU: {
    fromRow: (row) => ({ ...row, __class: "CPU" }),
  },
}));

vi.mock("../domain/CPUCooler", () => ({
  CPUCooler: {
    fromRow: (row) => ({ ...row, __class: "CPUCooler" }),
  },
}));

vi.mock("../domain/Motherboard", () => ({
  Motherboard: {
    fromRow: (row) => ({ ...row, __class: "Motherboard" }),
  },
}));

vi.mock("../domain/Memory", () => ({
  Memory: {
    fromRow: (row) => ({ ...row, __class: "Memory" }),
  },
}));

vi.mock("../domain/Storage", () => ({
  Storage: {
    fromRow: (row) => ({ ...row, __class: "Storage" }),
  },
}));

vi.mock("../domain/GPU", () => ({
  GPU: {
    fromRow: (row) => ({ ...row, __class: "GPU" }),
  },
}));

vi.mock("../domain/Case", () => ({
  Case: {
    fromRow: (row) => ({ ...row, __class: "Case" }),
  },
}));

vi.mock("../domain/PowerSupply", () => ({
  PowerSupply: {
    fromRow: (row) => ({ ...row, __class: "PowerSupply" }),
  },
}));

describe("buildsApi", () => {
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserBuilds", () => {
    it("should fetch all builds for a user", async () => {
      const mockBuilds = [
        {
          id: "build-1",
          name: "Gaming PC",
          notes: "High-end gaming",
          total_price: "1500.00",
          generated_budget: null,
          date_saved: "2025-01-15T10:00:00Z",
          cpu_part: { id: 1, brand: "intel", model: "i7" },
          cooler_part: null,
          mobo_part: null,
          memory_part: null,
          storage_part: null,
          gpu_part: { id: 2, brand: "nvidia", model: "4090" },
          case_part: null,
          psu_part: null,
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockBuilds, error: null }),
      };

      supabase.from.mockReturnValue(mockQuery);

      const result = await getUserBuilds(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("builds");
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", mockUserId);
      expect(mockQuery.order).toHaveBeenCalledWith("date_saved", {
        ascending: false,
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Gaming PC");
      expect(result[0].totalPrice).toBe(1500);
    });

    it("should handle database errors", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: "DB Error" } }),
      };

      supabase.from.mockReturnValue(mockQuery);

      await expect(getUserBuilds(mockUserId)).rejects.toThrow();
    });

    it("should return empty array when user has no builds", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      supabase.from.mockReturnValue(mockQuery);

      const result = await getUserBuilds(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe("saveBuild", () => {
    const mockSelectedParts = {
      cpu: { part: { id: 1, brand: "intel", model: "i7", price: 350 } },
      gpu: { part: { id: 2, brand: "nvidia", model: "4090", price: 1200 } },
    };

    it("should create a new build", async () => {
      const mockNewBuild = {
        id: "build-new",
        name: "New Gaming PC",
        notes: "Budget build",
        total_price: "1550.00",
        generated_budget: null,
        date_saved: "2025-01-20T10:00:00Z",
        cpu_part: { id: 1, brand: "intel", model: "i7" },
        gpu_part: { id: 2, brand: "nvidia", model: "4090" },
        cooler_part: null,
        mobo_part: null,
        memory_part: null,
        storage_part: null,
        case_part: null,
        psu_part: null,
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: mockNewBuild, error: null }),
      };

      supabase.from.mockReturnValue(mockQuery);

      const result = await saveBuild({
        buildId: null,
        userId: mockUserId,
        name: "New Gaming PC",
        notes: "Budget build",
        totalPrice: 1550,
        generatedBudget: null,
        selectedParts: mockSelectedParts,
      });

      expect(supabase.from).toHaveBeenCalledWith("builds");
      expect(mockQuery.insert).toHaveBeenCalled();
      expect(result.name).toBe("New Gaming PC");
      expect(result.id).toBe("build-new");
    });

    it("should update an existing build", async () => {
      const buildId = "build-123";
      const mockUpdatedBuild = {
        id: buildId,
        name: "Updated Gaming PC",
        notes: "Updated notes",
        total_price: "1600.00",
        generated_budget: null,
        date_saved: "2025-01-20T10:00:00Z",
        cpu_part: { id: 1, brand: "intel", model: "i7" },
        gpu_part: { id: 2, brand: "nvidia", model: "4090" },
        cooler_part: null,
        mobo_part: null,
        memory_part: null,
        storage_part: null,
        case_part: null,
        psu_part: null,
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: mockUpdatedBuild, error: null }),
      };

      supabase.from.mockReturnValue(mockQuery);

      const result = await saveBuild({
        buildId,
        userId: mockUserId,
        name: "Updated Gaming PC",
        notes: "Updated notes",
        totalPrice: 1600,
        generatedBudget: null,
        selectedParts: mockSelectedParts,
      });

      expect(supabase.from).toHaveBeenCalledWith("builds");
      expect(mockQuery.update).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("id", buildId);
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", mockUserId);
      expect(result.name).toBe("Updated Gaming PC");
    });

    it("should handle save errors", async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: "Insert failed" } }),
      };

      supabase.from.mockReturnValue(mockQuery);

      await expect(
        saveBuild({
          buildId: null,
          userId: mockUserId,
          name: "Test",
          notes: "",
          totalPrice: 100,
          generatedBudget: null,
          selectedParts: {},
        })
      ).rejects.toThrow();
    });

    it("should include generated_budget when provided", async () => {
      const mockNewBuild = {
        id: "build-new",
        name: "Budget PC",
        notes: "",
        total_price: "1000.00",
        generated_budget: "1500.00",
        date_saved: "2025-01-20T10:00:00Z",
        cpu_part: null,
        gpu_part: null,
        cooler_part: null,
        mobo_part: null,
        memory_part: null,
        storage_part: null,
        case_part: null,
        psu_part: null,
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: mockNewBuild, error: null }),
      };

      supabase.from.mockReturnValue(mockQuery);

      const result = await saveBuild({
        buildId: null,
        userId: mockUserId,
        name: "Budget PC",
        notes: "",
        totalPrice: 1000,
        generatedBudget: 1500,
        selectedParts: {},
      });

      expect(result.generatedBudget).toBe(1500);
    });
  });

  describe("deleteBuild", () => {
    it("should delete a build by id and user id", async () => {
      const buildId = "build-123";

      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      // Chain the eq calls properly
      mockQuery.eq.mockImplementation(function (col) {
        if (col === "id") return this;
        if (col === "user_id") {
          return Promise.resolve({ error: null });
        }
        return this;
      });

      supabase.from.mockReturnValue(mockQuery);

      await deleteBuild(buildId, mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("builds");
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("id", buildId);
    });

    it("should handle delete errors", async () => {
      const buildId = "build-123";

      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.eq.mockImplementation(function (col) {
        if (col === "id") return this;
        if (col === "user_id") {
          return Promise.reject(new Error("Delete failed"));
        }
        return this;
      });

      supabase.from.mockReturnValue(mockQuery);

      await expect(deleteBuild(buildId, mockUserId)).rejects.toThrow(
        "Delete failed"
      );
    });
  });
});
