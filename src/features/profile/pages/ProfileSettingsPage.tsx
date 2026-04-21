import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProfile, updateProfile } from "../api/profileApi";
import { queryKeys } from "../../../shared/api/queryKeys";
import { TextInput } from "../../../shared/components/TextInput";
import {
  profileSchema,
  type ProfileFormValues,
} from "../../../shared/validation/profileSchemas";

export function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  const profileQuery = useQuery({
    queryKey: queryKeys.profileMe,
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      queryClient.setQueryData(queryKeys.profileMe, data);
      queryClient.setQueryData(queryKeys.authMe, data);
      await queryClient.invalidateQueries({ queryKey: queryKeys.profileMe });
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        displayName: profileQuery.data.displayName,
        bio: profileQuery.data.bio ?? "",
        avatarUrl: profileQuery.data.avatarUrl ?? "",
      });
    }
  }, [profileQuery.data, form]);

  return (
    <section className="page narrow">
      <h1>Profile settings</h1>
      <p className="subtle">RHF + Zod + React Query mutation example.</p>
      <form
        className="panel form"
        onSubmit={form.handleSubmit((values) =>
          updateMutation.mutate({
            ...values,
            avatarUrl: values.avatarUrl || undefined,
            bio: values.bio || undefined,
          }),
        )}
      >
        <TextInput
          label="Display name"
          {...form.register("displayName")}
          error={form.formState.errors.displayName?.message}
        />
        <TextInput
          label="Bio"
          {...form.register("bio")}
          error={form.formState.errors.bio?.message}
        />
        <TextInput
          label="Avatar URL"
          {...form.register("avatarUrl")}
          error={form.formState.errors.avatarUrl?.message}
        />
        <button disabled={updateMutation.isPending} type="submit">
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </button>
        {updateMutation.isSuccess ? (
          <p className="ok-text">Profile updated.</p>
        ) : null}
      </form>
      {profileQuery.isLoading ? <p>Loading profile...</p> : null}
      {profileQuery.isError ? (
        <p role="alert" className="error-text">
          Unable to load profile data.
        </p>
      ) : null}
    </section>
  );
}
