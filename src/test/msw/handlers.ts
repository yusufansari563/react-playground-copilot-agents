import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/login", async () => {
    return HttpResponse.json({
      accessToken: "demo-token",
      user: {
        id: "u_1",
        email: "demo@example.com",
        displayName: "Demo User",
        role: "user",
      },
    });
  }),
  http.get("/api/me", async () => {
    return HttpResponse.json({
      id: "u_1",
      email: "demo@example.com",
      displayName: "Demo User",
      role: "user",
      bio: "Learning React deeply.",
      avatarUrl: "https://example.com/avatar.png",
    });
  }),
  http.patch("/api/me/profile", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    return HttpResponse.json({
      id: "u_1",
      email: "demo@example.com",
      role: "user",
      displayName: body.displayName,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
    });
  }),
];
