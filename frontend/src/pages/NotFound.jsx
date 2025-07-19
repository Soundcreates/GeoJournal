import React from "react";
import { useNavigate, Link } from "react-router";
import { MapPin, Home, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-8">
          <MapPin className="w-8 h-8 text-white" />
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl font-bold text-gray-200 select-none">
              404
            </div>

            {/* Floating compass icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
                <Compass
                  className="w-12 h-12 text-blue-600 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! You're off the map
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have wandered off the beaten
            path.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best explorers get lost sometimes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Action - Home */}
          <Link
            to="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Return to Base Camp
          </Link>

          {/* Secondary Actions */}
          <div className="flex justify-center ">
            <button
              onClick={handleGoBack}
              className="cursor-pointer flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium "
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick Links */}

        {/* Fun Error Code */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100">
          <p className="text-xs text-gray-400 font-mono">
            Error Code: LOST_IN_THE_WILDERNESS_404
          </p>
          <p className="text-xs text-gray-400 mt-1">
            GPS Coordinates: Unknown • Last Seen: Just now
          </p>
        </div>
      </div>
    </div>
  );
}
