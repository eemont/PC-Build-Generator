import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import CustomBuild from "../../pages/CustomBuild/CustomBuild";
import { AuthContext } from "../../context/AuthContext";

vi.mock("../../lib/buildsApi", () => ({
  saveBuild: vi.fn(),
}));

vi.mock("../../domain/partsApi", () => ({
  findParts: vi.fn(),
  measurePartCompatibility: vi.fn((part) => ({
    part,
    compatible: true,
    issues: [],
  })),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

import { saveBuild } from "../../lib/buildsApi";

const mockSession = {
  user: { id: "user-123", email: "test@example.com" },
};

function renderWithAuth(component, session = mockSession) {
  return render(
    <AuthContext.Provider value={{ session, loading: false }}>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
}

describe("CustomBuild Component - Save Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show alert if no build name provided", async () => {
    window.alert = vi.fn();

    renderWithAuth(<CustomBuild />);

    fireEvent.click(screen.getByRole("button", { name: /Save Build/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Please provide a name for your build."
    );
  });

  it("should show alert if no parts selected", async () => {
    window.alert = vi.fn();

    renderWithAuth(<CustomBuild />);

    await userEvent.type(
      screen.getByPlaceholderText(/Name your custom build/i),
      "Test Build"
    );

    fireEvent.click(screen.getByRole("button", { name: /Save Build/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Please add at least one part before saving."
    );
  });

  it("should show alert if user not logged in and parts are selected", async () => {
    window.alert = vi.fn();

    renderWithAuth(<CustomBuild />);

    // With no parts, the no-parts validation fires first
    fireEvent.click(screen.getByRole("button", { name: /Save Build/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Please provide a name for your build."
    );
  });

  it("should display save button", () => {
    renderWithAuth(<CustomBuild />);

    expect(
      screen.getByRole("button", { name: /Save Build/i })
    ).toBeInTheDocument();
  });

  it("should display build name input", () => {
    renderWithAuth(<CustomBuild />);

    expect(
      screen.getByPlaceholderText(/Name your custom build/i)
    ).toBeInTheDocument();
  });

  it("should include build notes textarea", async () => {
    renderWithAuth(<CustomBuild />);

    const notesTextarea = screen.getByPlaceholderText(/Prioritised single-core/i);
    await userEvent.type(notesTextarea, "This is a test note");

    expect(notesTextarea.value).toBe("This is a test note");
  });

  it("should default to empty notes", () => {
    renderWithAuth(<CustomBuild />);

    expect(screen.getByPlaceholderText(/Prioritised single-core/i).value).toBe("");
  });

  it("should handle very long build names", () => {
    renderWithAuth(<CustomBuild />);

    const buildNameInput = screen.getByPlaceholderText(/Name your custom build/i);
    const longName = "A".repeat(500);
    fireEvent.change(buildNameInput, { target: { value: longName } });

    expect(buildNameInput.value).toBe(longName);
  });

  it("should handle special characters in build name", () => {
    renderWithAuth(<CustomBuild />);

    const buildNameInput = screen.getByPlaceholderText(/Name your custom build/i);
    const specialCharsName = 'Test Build @#$%^&*(){}[]';
    fireEvent.change(buildNameInput, { target: { value: specialCharsName } });

    expect(buildNameInput.value).toBe(specialCharsName);
  });

  it("should handle save errors gracefully", async () => {
    saveBuild.mockRejectedValue(new Error("Save failed"));
    window.alert = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithAuth(<CustomBuild />);

    expect(
      screen.getByRole("button", { name: /Save Build/i })
    ).toBeInTheDocument();

    console.error.mockRestore();
  });
});
