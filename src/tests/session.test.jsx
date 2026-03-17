import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import "./mocks/mockSupabaseModule";
import { supabaseMock } from "./mocks/mockSupabaseModule";

// Adjust to your App path:
import App from "../App.jsx";

describe("Session handling", () => {
  beforeEach(() => {
    supabaseMock.auth.getSession.mockReset();
  });

  it("shows Auth when there is no session", async () => {
    supabaseMock.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(<App />);

    // Adjust to your Auth UI:
    expect(await screen.findByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows app content when a session exists", async () => {
    supabaseMock.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user_1" } } },
      error: null,
    });

    render(<App />);

    // Adjust to something your app shows when logged in:
    expect(await screen.findByRole("heading", { name: /pc build generator/i })).toBeInTheDocument();
  });
});
