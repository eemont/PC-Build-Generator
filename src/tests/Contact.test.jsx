import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "../pages/Contact/Contact";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "../lib/supabaseClient";

describe("Contact (Supabase)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the contact form UI (basic sanity)", () => {
    render(<Contact />);

    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit report/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty fields", async () => {
    render(<Contact />);

    const submitBtn = screen.getByRole("button", { name: /submit report/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please fill out all fields/i)).toBeInTheDocument();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("submits the form and calls supabase.from('contact_messages').insert()", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: mockInsert });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: "Bug Report" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "The page is broken." },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit report/i }));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("contact_messages");
      expect(mockInsert).toHaveBeenCalledWith([
        {
          name: "Test User",
          email: "test@example.com",
          subject: "Bug Report",
          message: "The page is broken.",
        },
      ]);
    });

    expect(await screen.findByText(/thank you!/i)).toBeInTheDocument();
  });

  it("shows an error message if Supabase insert fails", async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { message: "Network Error" },
    });
    supabase.from.mockReturnValue({ insert: mockInsert });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "t@t.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test" } });

    fireEvent.click(screen.getByRole("button", { name: /submit report/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("resets the form when clicking 'Send Another Message'", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: mockInsert });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Bob" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "b@b.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hi" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hi" } });
    
    fireEvent.click(screen.getByRole("button", { name: /submit report/i }));

    const resetBtn = await screen.findByRole("button", { name: /send another message/i });
    fireEvent.click(resetBtn);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe("");
  });
});