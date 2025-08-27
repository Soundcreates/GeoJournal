// src/components/uilayouts/SkeletonPlaceholder.jsx

import React from "react";

export default function SkeletonPlaceholder({ className }) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded-md ${className}`}></div>
  );
}
