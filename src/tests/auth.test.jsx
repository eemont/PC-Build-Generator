import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "../Auth";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

import { supabase } from "../lib/supabaseClient";

describe("Auth (Supabase)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login UI (basic sanity)", () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits login and calls supabase.auth.signInWithPassword", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows an error message if login fails", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(
      await screen.findByText(/invalid login credentials/i)
    ).toBeInTheDocument();
  });
});