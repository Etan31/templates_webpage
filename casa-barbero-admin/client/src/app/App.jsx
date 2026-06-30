import { useEffect, useState } from "react";
import { usePathname } from "../hooks/usePathname.js";
import { api } from "../services/api.js";
import { navigate } from "../services/navigation.js";
import { sessionStorage } from "../services/sessionStorage.js";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AdminApp from "./AdminApp.jsx";

export default function App() {
  const path = usePathname();
  const [session, setSession] = useState(sessionStorage.get());

  useEffect(() => {
    if (!path.startsWith("/admin")) navigate("/admin/login");
    if (!session && !["/admin/login", "/admin/forgot-password"].includes(path)) navigate("/admin/login");
    if (session && ["/admin", "/admin/login"].includes(path)) navigate("/admin/dashboard");
  }, [path, session]);

  if (path === "/admin/forgot-password") return <ForgotPasswordPage />;
  if (!session || path === "/admin/login") return <LoginPage onLogin={(nextSession, remember) => {
    sessionStorage.set(nextSession, remember);
    setSession(nextSession);
    navigate("/admin/dashboard");
  }} />;

  return (
    <AdminApp
      path={path}
      onLogout={async () => {
        try {
          await api("/api/admin/auth/logout", { method: "POST" });
        } catch {
          // Logging out should still clear the local credentials.
        }
        sessionStorage.clear();
        setSession(null);
        navigate("/admin/login");
      }}
    />
  );
}
