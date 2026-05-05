import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../../features/auth/store/authStore";
import { ProtectedRoute } from "./ProtectedRoute";

function TestApp() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, isAuthenticationRequired: false });
  });

  it("renders protected content by default when authentication is not required", () => {
    render(<TestApp />);
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redirects to login when authentication is required and token is missing", () => {
    useAuthStore.setState({ isAuthenticationRequired: true });
    render(<TestApp />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Page")).not.toBeInTheDocument();
  });

  it("renders protected content when authentication is required and token exists", () => {
    useAuthStore.setState({
      token: "demo-token",
      isAuthenticationRequired: true,
    });
    render(<TestApp />);
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
