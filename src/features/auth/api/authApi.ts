import axios from "axios";
import { http } from "../../../shared/api/http";
import type {
  ApiError,
  LoginPayload,
  LoginResponse,
  User,
} from "../../../shared/types/user";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "password123";
const DEMO_TOKEN = "demo-token";

const DEMO_USER: User = {
  id: "u_demo_1",
  email: DEMO_EMAIL,
  displayName: "Demo User",
  role: "user",
  bio: "Learning React deeply.",
  avatarUrl: "https://example.com/avatar.png",
};

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      "Request failed";

    return {
      message,
      code: error.code,
    };
  }

  return {
    message: "Unexpected error",
  };
}

function canUseLocalFallback(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return (
    !error.response ||
    error.code === "ECONNABORTED" ||
    error.code === "ERR_NETWORK" ||
    error.response.status >= 500
  );
}

function localLogin(payload: LoginPayload): LoginResponse {
  if (payload.email === DEMO_EMAIL && payload.password === DEMO_PASSWORD) {
    return {
      accessToken: DEMO_TOKEN,
      user: DEMO_USER,
    };
  }

  return {
    accessToken: DEMO_TOKEN,
    user: {
      ...DEMO_USER,
      email: payload.email,
      displayName: payload.email.split("@")[0] || DEMO_USER.displayName,
    },
  };
}

export async function login(payload: LoginPayload) {
  try {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  } catch (error) {
    if (canUseLocalFallback(error)) {
      return localLogin(payload);
    }

    throw toApiError(error);
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await http.get<User>("/me");
    return data;
  } catch (error) {
    if (localStorage.getItem("auth_token") === DEMO_TOKEN) {
      return DEMO_USER;
    }

    throw toApiError(error);
  }
}
