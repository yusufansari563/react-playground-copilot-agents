import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name is too short")
    .max(40, "Display name is too long"),
  bio: z
    .string()
    .trim()
    .max(160, "Bio must be 160 characters or less")
    .optional(),
  avatarUrl: z.url("Avatar URL must be valid").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
