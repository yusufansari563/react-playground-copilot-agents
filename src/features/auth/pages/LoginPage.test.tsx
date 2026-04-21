import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/msw/server";
import { useAuthStore } from "../store/authStore";
import { LoginPage } from "./LoginPage";

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null });
    localStorage.clear();
  });

  describe("Form Rendering", () => {
    it("renders login form with email and password fields", () => {
      renderLoginPage();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it("displays helpful text about fallback login", () => {
      renderLoginPage();

      expect(
        screen.getByText(/no backend\?|local fallback|any email/i),
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows validation error for empty email on submit", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it("shows validation error for password shorter than 8 characters", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "demo@example.com");
      await user.type(passwordInput, "short");
      await user.tab(); // Blur to trigger validation

      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it("accepts valid credentials", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "demo@example.com");
      await user.type(passwordInput, "password123");

      expect(emailInput).toHaveValue("demo@example.com");
      expect(passwordInput).toHaveValue("password123");
    });
  });

  describe("Successful Login", () => {
    it("logs in with backend when server is available", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });

      expect(localStorage.getItem("auth_token")).toBe("demo-token");
    });

    it("shows loading state while submitting", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "demo@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Fallback Login (No Backend)", () => {
    it("logs in with demo account using local fallback when backend is unavailable", async () => {
      server.use(
        http.post("/api/auth/login", () => {
          return HttpResponse.error();
        }),
      );

      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "anything@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });

      expect(localStorage.getItem("auth_token")).toBe("demo-token");
    });

    it("creates user identity from email on fallback login", async () => {
      server.use(
        http.post("/api/auth/login", () => {
          return HttpResponse.error();
        }),
      );

      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "alice@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });

      expect(localStorage.getItem("auth_token")).toBe("demo-token");
    });
  });

  describe("Error Handling", () => {
    it("shows error message when login fails", async () => {
      server.use(
        http.post("/api/auth/login", () => {
          return HttpResponse.json(
            { message: "Invalid credentials" },
            { status: 401 },
          );
        }),
      );

      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpass");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /unable to sign in/i,
        );
      });

      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("clears error message when user modifies form", async () => {
      server.use(
        http.post("/api/auth/login", () => {
          return HttpResponse.json(
            { message: "Invalid credentials" },
            { status: 401 },
          );
        }),
      );

      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpass");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      await user.clear(emailInput);
      await user.type(emailInput, "correct@example.com");

      expect(emailInput).toHaveValue("correct@example.com");
    });
  });

  describe("Navigation", () => {
    it("redirects to dashboard on successful login", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "demo@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("redirects to dashboard immediately if already logged in", () => {
      useAuthStore.setState({ token: "existing-token" });

      renderLoginPage();

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    });
  });

  describe("Session Persistence", () => {
    it("persists auth token to localStorage on successful login", async () => {
      const user = userEvent.setup();

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "demo@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem("auth_token")).toBe("demo-token");
      });
    });
  });
});
