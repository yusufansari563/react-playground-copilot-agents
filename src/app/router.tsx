/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { HookDetailPage } from "../features/hooks/pages/HookDetailPage";
import { ProfileSettingsPage } from "../features/profile/pages/ProfileSettingsPage";

function NotFoundPage() {
  return (
    <section className="page">
      <h1>Not Found</h1>
      <p>The page you requested does not exist.</p>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "hooks/:hookName",
            element: <HookDetailPage />,
          },
          {
            path: "settings/profile",
            element: <ProfileSettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
