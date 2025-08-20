import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { Loader } from "lucide-react";
import { Navigate } from "react-router";
import { Outlet } from "react-router";
function ProtectedRoutes() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!user && !localStorage.getItem("token")) {
      navigate("/");
    }
  }, [user, navigate]);

  if (isLoading) {
    return <Loader message="Taking you back to a safe place..." />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
