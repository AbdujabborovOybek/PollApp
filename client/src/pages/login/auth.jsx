import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function Auth() {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (user) return <Outlet />;

  return <Navigate to="/login" state={{ from: location }} replace />;
}
