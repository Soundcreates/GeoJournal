import React from "react";
import { Plus, Zap } from "lucide-react";
import { useNavigate } from "react-router";

function AddEntryButton() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-4 py-5 ">
      <button
        onClick={() => navigate("/add-entry")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Plus className="w-5 h-5 ml-2" />
        <span className= "text-3xl">Add New Entry</span>
        <Zap className="w-4 h-4 mr-2" />
      </button>
    </div>
  );
}

export default AddEntryButton;
