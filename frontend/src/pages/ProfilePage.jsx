import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Globe,
  Award,
  BookOpen,
  Camera,
  Plane,
  Star,
} from "lucide-react";

const ProfilePage = () => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const recentEntries = [
    {
      id: 1,
      location: "Santorini, Greece",
      date: "July 15, 2025",
      preview:
        "Watching the sunset from Oia was absolutely breathtaking. The way the light painted the white buildings in golden hues...",
      tags: ["sunset", "photography", "greece", "islands"],
      image: "🌅",
    },
    {
      id: 2,
      location: "Barcelona, Spain",
      date: "July 10, 2025",
      preview:
        "Gaudí's architecture continues to amaze me. Spent hours at Park Güell sketching the intricate mosaics and organic forms...",
      tags: ["architecture", "art", "spain", "sketching"],
      image: "🏛️",
    },
    {
      id: 3,
      location: "Reykjavik, Iceland",
      date: "July 5, 2025",
      preview:
        "The Northern Lights finally appeared! After three cloudy nights, the sky erupted in dancing green curtains...",
      tags: ["northern-lights", "iceland", "nature", "photography"],
      image: "🌌",
    },
  ];

  const achievements = [
    {
      icon: Globe,
      title: "Continent Collector",
      desc: "Visited 5 continents",
      color: "bg-blue-500",
    },
    {
      icon: Plane,
      title: "Frequent Flyer",
      desc: "100+ flights logged",
      color: "bg-green-500",
    },
    {
      icon: BookOpen,
      title: "Prolific Writer",
      desc: "150+ journal entries",
      color: "bg-purple-500",
    },
    {
      icon: Camera,
      title: "Photo Master",
      desc: "1000+ photos taken",
      color: "bg-pink-500",
    },
    {
      icon: Star,
      title: "Local Expert",
      desc: "Featured in 5 travel guides",
      color: "bg-yellow-500",
    },
    {
      icon: Award,
      title: "Adventure Seeker",
      desc: "Climbed 10+ mountains",
      color: "bg-red-500",
    },
  ];

  const stats = [
    { number: "23", label: "Countries" },
    { number: "156", label: "Entries" },
    { number: "47.2K", label: "Miles" },
    { number: "892", label: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div
        className={`max-w-6xl mx-auto transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                    AJ
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center md:text-left text-white flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Alex Journey
                  </h1>
                  <div className="space-y-2 mb-6">
                    <p className="flex items-center justify-center md:justify-start gap-2 text-lg">
                      <Globe className="w-5 h-5" />
                      Global Explorer & Digital Nomad
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      Currently in: Barcelona, Spain
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <Plane className="w-4 h-4" />
                      Next destination: Tokyo, Japan
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl md:text-3xl font-bold">
                          {stat.number}
                        </div>
                        <div className="text-sm opacity-80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Entries */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Entries
                </h2>
              </div>

              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedEntry === entry.id
                        ? "ring-2 ring-blue-500 scale-[1.02]"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedEntry(
                        selectedEntry === entry.id ? null : entry.id
                      )
                    }
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: isLoaded
                        ? "slideUp 0.6s ease-out forwards"
                        : "none",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{entry.image}</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {entry.location}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {entry.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {entry.preview}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {selectedEntry === entry.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                        <p className="text-gray-600 text-sm">
                          Click to read full entry and view all photos from this
                          location.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Travel Map */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Travel Map</h2>
              </div>

              <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl h-48 flex items-center justify-center text-white text-center p-6">
                <div>
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="font-medium">Interactive World Map</p>
                  <p className="text-sm opacity-90 mt-1">
                    Click pins to view entries
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Achievements
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                      style={{
                        animationDelay: `${(index + 3) * 100}ms`,
                        animation: isLoaded
                          ? "slideUp 0.6s ease-out forwards"
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {achievement.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {achievement.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
