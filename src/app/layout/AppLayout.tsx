import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/hooks/useState", label: "Hooks" },
  { to: "/settings/profile", label: "Profile" },
];

export function AppLayout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>React Playground</h2>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="ghost" onClick={clearSession} type="button">
          Clear Session
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
