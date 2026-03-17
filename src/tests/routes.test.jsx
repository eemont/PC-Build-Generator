import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

function AuthPage() {
  return <h1>Auth Page</h1>;
}
function SavedPage() {
  return <h1>Saved Builds</h1>;
}

describe("Route protection", () => {
  it("redirects to /auth if not logged in", async () => {
    render(
      <MemoryRouter initialEntries={["/saved"]}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute session={null}>
                <SavedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Auth Page")).toBeInTheDocument();
  });

  it("shows /saved if logged in", async () => {
    render(
      <MemoryRouter initialEntries={["/saved"]}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute session={{ user: { id: "u1" } }}>
                <SavedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Saved Builds")).toBeInTheDocument();
  });
});
