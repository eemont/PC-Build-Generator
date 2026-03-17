import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

vi.mock("../lib/supabaseClient", () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
      },
    },
  };
});

import { supabase } from "../lib/supabaseClient";

describe("Session handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
  });

  it("redirects to login when visiting a protected route without a session", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    render(
      <MemoryRouter initialEntries={["/saved"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /sign in/i })
      ).toBeInTheDocument();
    });
  });

  it("shows protected content when a session exists", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { email: "user@example.com" },
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/saved"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/saved builds/i)).toBeInTheDocument();
    });
  });
});