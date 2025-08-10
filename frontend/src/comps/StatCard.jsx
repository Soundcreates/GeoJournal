import React from "react";
import { Heart, Share2 } from "lucide-react";
import Earth from "../../components/uilayouts/globe";

const StatCard = ({ status, icon: IconComponent, label, value, color }) => (
  <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>

      {/* Show icon only if IconComponent exists AND status is false */}
      {!status && IconComponent && (
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
        >
          <IconComponent size={24} className="text-white" />
        </div>
      )}
    </div>

    {/* Earth only if status is true */}
    {status && (
      <div className="absolute bottom-[-30px] right-[-30px] w-40 h-40 opacity-70">
        <Earth />
      </div>
    )}
  </div>
);

export default StatCard;
