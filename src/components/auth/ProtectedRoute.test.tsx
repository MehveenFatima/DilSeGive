import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

const renderAt = (role?: string) =>
  render(
    <MemoryRouter initialEntries={["/private"]}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route
          path="/private"
          element={
            <ProtectedRoute role={role}>
              <p>Secret dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

const saveUser = (role: string) =>
  localStorage.setItem("user", JSON.stringify({ id: "1", name: "Test", email: "t@test.com", role }));

describe("ProtectedRoute", () => {
  afterEach(() => localStorage.clear());

  it("redirects to home when nobody is logged in", () => {
    renderAt("donor");
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("shows the page when the user has the required role", () => {
    saveUser("donor");
    renderAt("donor");
    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });

  it("matches roles case-insensitively", () => {
    saveUser("NGO");
    renderAt("ngo");
    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });

  it("redirects when the user has a different role", () => {
    saveUser("donor");
    renderAt("admin");
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("allows any logged-in user when no role is required", () => {
    saveUser("ngo");
    renderAt();
    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });

  it("clears corrupted session data and redirects", () => {
    localStorage.setItem("user", "{not valid json");
    localStorage.setItem("role", "donor");
    renderAt("donor");
    expect(screen.getByText("Home page")).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
  });
});
