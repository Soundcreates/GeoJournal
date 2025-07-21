import React from "react";
import { MapPin, Globe, Compass } from "lucide-react";

const Loader = ({ message = "Loading your journey..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative">
        {/* Main spinning globe */}
        <div className="relative w-24 h-24 mb-8">
          <Globe
            className="w-24 h-24 text-blue-600 animate-spin"
            style={{ animationDuration: "3s" }}
          />

          {/* Orbiting compass */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          >
            <Compass className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-indigo-500" />
          </div>

          {/* Orbiting map pins */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <MapPin className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <MapPin className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Pulsing circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 border-2 border-blue-300 rounded-full animate-ping opacity-20"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-indigo-300 rounded-full animate-ping opacity-10"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message}</h2>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loader;
