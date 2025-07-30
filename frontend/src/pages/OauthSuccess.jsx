// src/pages/OauthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function OauthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userInfoParam = searchParams.get("userInfo");

    if (token && userInfoParam) {
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", userInfoParam);
      setUser(userInfoParam); // or fetch full profile using token
      navigate("/dashboard");
    } else {
      console.log("No token found in URL");
      navigate("/");
    }
  }, []);

  return <p>Redirecting...</p>;
}
