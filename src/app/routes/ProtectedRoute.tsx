import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticationRequired = useAuthStore(
    (state) => state.isAuthenticationRequired
  );

  if (isAuthenticationRequired && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
