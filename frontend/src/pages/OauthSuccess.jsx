// frontend/src/pages/OauthSuccess.jsx
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

    if (token || userInfoParam) {
      try {
        localStorage.setItem("token", token);

        const userInfo = JSON.parse(decodeURIComponent(userInfoParam));

        // ✅ Get location from cache or use defaults
        const cachedLocation = localStorage.getItem("userLocation");
        const locationData = cachedLocation
          ? JSON.parse(cachedLocation)
          : { city: "Unknown City", country: "Unknown Country" };

        const userWithLocation = {
          ...userInfo,
          currentLocation: locationData,
        };

        setUser(userWithLocation);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error processing OAuth success:", error);
        navigate("/");
      }
    } else {
      console.log("No token found in URL");
      navigate("/");
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
      </div>
    </div>
  );
}
