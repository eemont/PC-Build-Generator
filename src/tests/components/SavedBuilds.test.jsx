import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SavedBuilds from "../../pages/SavedBuilds/SavedBuilds";
import { AuthContext } from "../../context/AuthContext";

vi.mock("../../lib/buildsApi", () => ({
  getUserBuilds: vi.fn(),
  deleteBuild: vi.fn(),
}));

import { getUserBuilds, deleteBuild } from "../../lib/buildsApi";

const mockSession = {
  user: { id: "user-123", email: "test@example.com" },
};

const mockBuild = {
  id: "build-1",
  name: "Gaming PC",
  notes: "High-end gaming setup",
  totalPrice: 1500,
  dateSaved: "1/15/2025",
  parts: {
    cpu: {
      part: { id: 1, brand: "Intel", model: "i7-13700K", price: 350 },
      issues: [],
      compatible: true,
    },
    gpu: {
      part: { id: 2, brand: "NVIDIA", model: "RTX 4090", price: 1200 },
      issues: [],
      compatible: true,
    },
  },
};

function renderWithAuth(component, session = mockSession) {
  return render(
    <AuthContext.Provider value={{ session, loading: false }}>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
}

describe("SavedBuilds Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state while fetching builds", async () => {
    getUserBuilds.mockImplementation(() => new Promise(() => {}));

    renderWithAuth(<SavedBuilds />);

    expect(screen.getByText("Loading your builds...")).toBeInTheDocument();
  });

  it("should display empty state when no builds exist", async () => {
    getUserBuilds.mockResolvedValue([]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("You haven't saved any builds yet.")).toBeInTheDocument();
    });
  });

  it("should display builds when they exist", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
      expect(screen.getByText("$1500.00")).toBeInTheDocument();
    });
  });

  it("should load builds for the current user", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(getUserBuilds).toHaveBeenCalledWith("user-123");
    });
  });

  it("should show empty state when not logged in", async () => {
    renderWithAuth(<SavedBuilds />, { user: null });

    await waitFor(() => {
      expect(screen.getByText("You haven't saved any builds yet.")).toBeInTheDocument();
    });
  });

  it("should display build details in the view modal", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("View"));

    // Notes only render inside the modal
    expect(screen.getByText("High-end gaming setup")).toBeInTheDocument();
    // Parts appear in both card and modal; use getAllByText to handle duplicates
    expect(screen.getAllByText(/Intel.*i7-13700K/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/RTX 4090/).length).toBeGreaterThan(0);
  });

  it("should delete a build when confirmed", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);
    deleteBuild.mockResolvedValue(undefined);
    window.confirm = vi.fn(() => true);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(deleteBuild).toHaveBeenCalledWith("build-1", "user-123");
    });

    expect(screen.queryByText("Gaming PC")).not.toBeInTheDocument();
  });

  it("should not delete a build when not confirmed", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);
    window.confirm = vi.fn(() => false);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    expect(deleteBuild).not.toHaveBeenCalled();
    expect(screen.getByText("Gaming PC")).toBeInTheDocument();
  });

  it("should handle delete errors gracefully", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);
    deleteBuild.mockRejectedValue(new Error("Delete failed"));
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to delete build. Please try again."
      );
    });

    expect(screen.getByText("Gaming PC")).toBeInTheDocument();
  });

  it("should close view modal on Escape key", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText("Gaming PC")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("View"));
    expect(screen.getByText("High-end gaming setup")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("High-end gaming setup")).not.toBeInTheDocument();
    });
  });

  it("should display parts list in the build card", async () => {
    getUserBuilds.mockResolvedValue([mockBuild]);

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(screen.getByText(/Intel.*i7-13700K/)).toBeInTheDocument();
    });
  });

  it("should reload builds when session changes", async () => {
    getUserBuilds.mockResolvedValue([]);

    const { rerender } = renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(getUserBuilds).toHaveBeenCalledTimes(1);
    });

    getUserBuilds.mockClear();

    const newSession = { user: { id: "user-456", email: "newuser@example.com" } };

    rerender(
      <AuthContext.Provider value={{ session: newSession, loading: false }}>
        <BrowserRouter>
          <SavedBuilds />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getUserBuilds).toHaveBeenCalledWith("user-456");
    });
  });

  it("should handle API errors when fetching builds", async () => {
    getUserBuilds.mockRejectedValue(new Error("API Error"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithAuth(<SavedBuilds />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    expect(screen.getByText("You haven't saved any builds yet.")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
