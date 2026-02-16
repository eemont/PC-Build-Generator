import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// IMPORTANT: this must be imported BEFORE importing components that use supabase
import "./mocks/mockSupabaseModule";
import { supabaseMock } from "./mocks/mockSupabaseModule";

// Adjust import to your Auth component path:
import Auth from "../Auth.jsx";

describe("Auth (Supabase)", () => {
  beforeEach(() => {
    supabaseMock.auth.signInWithPassword.mockReset();
    supabaseMock.auth.signUp.mockReset();
  });

it("renders login UI (basic sanity)", () => {
  render(<Auth />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
});


  it("submits login and calls supabase.auth.signInWithPassword", async () => {
    const user = userEvent.setup();

    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { session: { user: { id: "user_1" } } },
      error: null,
    });

    render(<Auth />);

    // Adjust selectors to match your form fields:
    await user.type(screen.getByLabelText(/email/i), "test.user01.pcbuild@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "PcBuild@2026!");
    await user.click(screen.getByRole("button", { name: /sign in|login/i }));

    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test.user01.pcbuild@gmail.com",
      password: "PcBuild@2026!",
    });
  });

  it("shows an error message if login fails", async () => {
    const user = userEvent.setup();

    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    render(<Auth />);

    await user.type(screen.getByLabelText(/email/i), "test.user01.pcbuild@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "WrongPassword123!");
    await user.click(screen.getByRole("button", { name: /sign in|login/i }));

    // Adjust to match how you display errors:
    expect(await screen.findByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
