import React, { useState } from "react";
import {
  Heart,
  MoreHorizontal,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
} from "lucide-react";




const JournalCard = ({ entry, handleLike, likedEntries }) => {



  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {entry.imageUrl && (
          <img
            src={entry.imageUrl}
            alt={entry.title}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="absolute top-3 right-3">
          <button
            onClick={() => handleLike(entry.id)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center transition-all ${likedEntries.has(entry.id)
              ? "bg-red-500 text-white"
              : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
              }`}
          >
            <Heart
              className={`w-5 h-5 ${likedEntries.has(entry.id) ? "fill-current" : ""
                }`}
            />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full backdrop-blur-sm">
            {entry.weather}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {entry.title}
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{entry.location}</span>
          <span className="mx-2">•</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span>{entry.createdAt}</span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {entry.aiCaption}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{entry.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{entry.comments}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${entry.mood === "Peaceful"
              ? "bg-blue-100 text-blue-600"
              : entry.mood === "Excited"
                ? "bg-orange-100 text-orange-600"
                : entry.mood === "Inspired"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-green-100 text-green-600"
              }`}
          >
            {entry.mood}
          </span>
        </div>
      </div>
    </div>
  )
};

export default JournalCard;
