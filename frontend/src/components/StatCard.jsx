import React from "react";
import { Heart, Share2 } from "lucide-react";

const StatCard = ({ icon: IconComponent, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
