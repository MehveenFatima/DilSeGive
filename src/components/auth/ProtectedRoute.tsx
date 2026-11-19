import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Role required to view the route; any logged-in user if omitted */
  role?: string;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch {
    // Corrupted session data: clear it and send the user home
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return <Navigate to="/" replace />;
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};
