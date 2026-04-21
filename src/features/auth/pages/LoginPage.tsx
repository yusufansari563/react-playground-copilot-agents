import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { queryKeys } from "../../../shared/api/queryKeys";
import { TextInput } from "../../../shared/components/TextInput";
import type { ApiError } from "../../../shared/types/user";
import {
  loginSchema,
  type LoginFormValues,
} from "../../../shared/validation/authSchemas";

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(queryKeys.authMe, data.user);
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
      navigate("/dashboard");
    },
    onError: (error: ApiError) => {
      if (error.fieldErrors?.email) {
        setError("email", { message: error.fieldErrors.email });
      }
      if (error.fieldErrors?.password) {
        setError("password", { message: error.fieldErrors.password });
      }
    },
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="page narrow">
      <h1>Sign in</h1>
      <p className="subtle">
        No backend? You can still log in with local fallback using any email and
        a password with at least 8 characters.
      </p>
      <form
        className="panel form"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="********"
          {...register("password")}
          error={errors.password?.message}
        />
        <button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </button>
        {mutation.isError ? (
          <p role="alert" className="error-text">
            Unable to sign in. Check credentials and try again.
          </p>
        ) : null}
      </form>
    </section>
  );
}
