export const queryKeys = {
  authMe: ["auth", "me"] as const,
  profileMe: ["profile", "me"] as const,
  hookTopic: (hookName: string) => ["hooks", hookName] as const,
};
