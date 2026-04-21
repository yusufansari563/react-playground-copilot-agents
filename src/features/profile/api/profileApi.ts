import { http } from "../../../shared/api/http";
import type { ProfileUpdatePayload, User } from "../../../shared/types/user";

export async function getProfile() {
  const { data } = await http.get<User>("/me");
  return data;
}

export async function updateProfile(payload: ProfileUpdatePayload) {
  const { data } = await http.patch<User>("/me/profile", payload);
  return data;
}
