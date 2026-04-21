import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../auth/api/authApi";
import { queryKeys } from "../../../shared/api/queryKeys";
import { StatusCard } from "../../../shared/components/StatusCard";

export function DashboardPage() {
  const meQuery = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: getCurrentUser,
  });

  return (
    <section className="page">
      <h1>Dashboard</h1>
      <p className="subtle">This page is backed by React Query server state.</p>
      <div className="grid">
        <StatusCard
          title="Learning Track"
          body="Routing, server state, forms, tests, and stories are wired into one workflow."
          tone="success"
        />
        <StatusCard
          title="Current User"
          body={
            meQuery.isSuccess
              ? `Signed in as ${meQuery.data.displayName} (${meQuery.data.role})`
              : "User data will appear here after successful auth."
          }
          tone={meQuery.isSuccess ? "neutral" : "warning"}
        />
      </div>
      {meQuery.isLoading ? <p>Loading user data...</p> : null}
      {meQuery.isError ? (
        <p role="alert" className="error-text">
          Could not load /me endpoint. Check API or MSW handlers.
        </p>
      ) : null}
    </section>
  );
}
