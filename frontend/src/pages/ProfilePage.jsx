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
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { fetchStuff } from "../service/api";
import useGetLocation from "../hooks/useGetLocation";
import Loader from "./Loader";
import ViewEntries from "../components/ViewEntries";
import Logout from "../components/Logout";

const ProfilePage = () => {
  const { user, loading: userLoading } = useAuth();
  const { userId } = useParams();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [openTravelMap, setOpenTravelMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const storedLocation = localStorage.getItem("userLocation");
      if (storedLocation) {
        const parsed = JSON.parse(storedLocation);
        return {
          city: parsed.city || "Unknown City",
          country: parsed.country || "Unknown Country"
        };
      }
    } catch (error) {
      console.error("Error parsing stored location:", error);
    }
  });

  const { loading: locationLoading } = useGetLocation();
  const handleFetchRecentEntries = async () => {
    try {
      const response = await fetchStuff(`/journals/recentJournals/${user.id}`, { //use 'user.id' everywhere
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setRecentEntries(response.data.recentJournals);
        console.log(
          "Recent entries fetched successfully: ",
          response.data.recentJournals
        );
      }
    } catch (err) {
      console.error("Error fetching recent entries: ", err);
      setRecentEntries([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (user && user.id && !userLoading) {
      handleFetchRecentEntries();
    }
    console.log("User current location is: ", currentLocation.city, currentLocation.country);
  }, [user, userLoading]); //will render based on both of these dependencies

  if (userLoading) {
    return <Loader message="Loading user data..." />;
  }

  if (!user) {
    return <Loader message="User not found. Redirecting..." />;
  }



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

  if (locationLoading) {
    return <Loader message="Loading profile page.." />;
  } else {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        {openTravelMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[90%] max-w-5xl h-[80%] bg-white rounded-3xl shadow-2xl overflow-hidden ">
              <ViewEntries setOpenTravelMap={setOpenTravelMap} />

            </div>
          </div>
        )}
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
                      <img
                        src={
                          user.avatar
                            ? user.avatar
                            : "https://imgs.search.brave.com/4Zao298wcGdVAOGg3B3_yMa79bBtjbkb6njql8OQKjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjY2/NTQ1MDYyL3ZlY3Rv/ci9kZWZhdWx0LXBs/YWNlaG9sZGVyLXBy/b2ZpbGUtaWNvbi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/UDMyQm1LaTRCc0I0/Smhob0NhaFRYaHdC/QTBCNkhnSjNBcm9X/SHl1TThOOD0"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>


                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Logout />
                  </div>

                  <div className="text-center md:text-left text-white flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      {user.username}
                    </h1>
                    <div className="space-y-2 mb-6">
                      <p className="flex items-center justify-center md:justify-start gap-2 text-lg">
                        <Globe className="w-5 h-5" />
                        Global Explorer & Digital Nomad
                      </p>
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <MapPin className="w-4 h-4" />
                        Currently in: {currentLocation.city},{" "}
                        {currentLocation.country}
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
                      key={entry._id}
                      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selectedEntry === entry.id
                        ? "ring-2 ring-blue-500 scale-[1.02]"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedEntry(
                          selectedEntry === entry._id ? null : entry._id
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


                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {entry.location}
                            </h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {entry.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {entry.title}
                      </p>

                      {selectedEntry === entry.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                          <p className="text-gray-600 text-sm">
                            Click to read full entry and view all photos from
                            this location.
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
                  <h2 className="text-xl font-bold text-gray-800">
                    Travel Map
                  </h2>
                </div>

                <div onClick={() => {
                  console.log("OpenTravelMap is: ", openTravelMap);
                  setOpenTravelMap(prev => !prev);
                }}
                  className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl h-48 flex items-center justify-center text-white text-center p-6">
                  <div className="cursor-pointer">
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
  }
};

export default ProfilePage;
