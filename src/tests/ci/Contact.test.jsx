import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "../../pages/Contact/Contact";

describe("Contact (Static)", () => {
  it("renders the main heading", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
  });

  it("renders the intro text", () => {
    render(<Contact />);
    expect(screen.getByText(/get in touch with our development team/i)).toBeInTheDocument();
  });

  it("renders the Developer Contact subheading", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: /developer contact/i })).toBeInTheDocument();
  });

  it("renders the email address", () => {
    render(<Contact />);
    expect(screen.getByText(/placeholder@example\.com/i)).toBeInTheDocument();
  });

  it("renders the phone number", () => {
    render(<Contact />);
    expect(screen.getByText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
  });

  it("renders the address", () => {
    render(<Contact />);
    expect(screen.getByText(/123 Some Lane, Some City, CA 00000/i)).toBeInTheDocument();
  });
});