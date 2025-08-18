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
  MoreHorizontal,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
  TrendingUp,
  Users,
  Mail,
  Bell,
  ArrowLeft,
  Edit
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { fetchStuff } from "../service/api";
import useGetLocation from "../hooks/useGetLocation";
import Loader from "./Loader";
import ViewEntries from "../comps/ViewEntries";
import Logout from "../comps/Logout";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, getUser } = useAuth();
  const { userId } = useParams();

  // UI States
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openTravelMap, setOpenTravelMap] = useState(false);

  // Data States
  const [recentEntries, setRecentEntries] = useState([]);
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
    return { city: "Unknown City", country: "Unknown Country" };
  });

  // Get user data on mount
  useEffect(() => {
    getUser();
  }, []);

  const { loading: locationLoading } = useGetLocation();

  // Fetch recent journal entries
  const handleFetchRecentEntries = async () => {
    try {
      const response = await fetchStuff(`/journals/recentJournals/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setRecentEntries(response.data.recentJournals);
        console.log("Recent entries fetched successfully: ", response.data.recentJournals);
      }
    } catch (err) {
      console.error("Error fetching recent entries: ", err);
      setRecentEntries([]);
    } finally {
      setIsLoaded(true);
    }
  };

  // Fetch entries when user data is available
  useEffect(() => {
    if (user && user.id && !userLoading) {
      handleFetchRecentEntries();
    }
    console.log("User current location is: ", currentLocation.city, currentLocation.country);
  }, [user, userLoading]);

  // Show loader while loading
  if (userLoading || locationLoading) {
    return <Loader message="Loading profile page..." />;
  }

  if (!user) {
    return <Loader message="User not found. Redirecting..." />;
  }

  // Achievement data - hardcoded as in original
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

  // User statistics from backend data
  const stats = [
    { number: (user?.countriesVisited ? user?.countriesVisited : 0), label: "Countries" },
    { number: (user?.journalEntries || 0), label: "Entries" },
    { number: (user?.milesTraveled || 0), label: "Miles" },
    { number: (user?.photosTaken || 0), label: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Travel Map Modal */}
      {openTravelMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-5xl h-[80%] bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-[#c0c6fc]/20">
            <ViewEntries setOpenTravelMap={setOpenTravelMap} />
          </div>
        </div>
      )}

      <ProfileSidebar navigate={navigate} />
      <MainProfileContent
        user={user}
        currentLocation={currentLocation}
        stats={stats}
        recentEntries={recentEntries}
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
        setOpenTravelMap={setOpenTravelMap}
        achievements={achievements}
        isLoaded={isLoaded}
      />
    </div>
  );
};

// Sidebar Component for Profile Page
function ProfileSidebar({ navigate }) {
  return (
    <div className="w-64 bg-gray-800 p-6 shadow-lg border-r border-[#c0c6fc]/20">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 mb-8 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      {/* Logo/Brand Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#656fe2] flex items-center justify-center">
          <Users className="text-white" size={16} />
        </div>
        <span className="text-xl font-semibold text-white">Profile</span>
      </div>

      {/* Navigation Section */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">Navigation</h3>
        <nav className="space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <SidebarItem icon={Users} label="Profile" active />
          <SidebarItem icon={BookOpen} label="My Entries" />
          <SidebarItem icon={Globe} label="Travel Map" />
          <SidebarItem icon={Award} label="Achievements" />
        </nav>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">Quick Actions</h3>
        <nav className="space-y-2">
          <SidebarItem icon={Edit} label="Edit Profile" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* Logout Section */}
      <div className="mt-auto">
        <Logout />
      </div>
    </div>
  );
}

// Individual sidebar navigation item
function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-[#656fe2] text-white' : 'text-gray-300 hover:bg-gray-700'
        }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// Main content area for profile
function MainProfileContent({
  user,
  currentLocation,
  stats,
  recentEntries,
  selectedEntry,
  setSelectedEntry,
  setOpenTravelMap,
  achievements,
  isLoaded
}) {
  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6">
        <ProfileHeader user={user} />
        <ProfileHero
          user={user}
          currentLocation={currentLocation}
          stats={stats}
        />
        <RecentEntriesSection
          recentEntries={recentEntries}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          isLoaded={isLoaded}
        />
      </div>
      <ProfileRightSidebar
        setOpenTravelMap={setOpenTravelMap}
        achievements={achievements}
        isLoaded={isLoaded}
      />
    </div>
  );
}

// Profile header with user info
function ProfileHeader({ user }) {
  const { userId } = useParams();
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {user?.firstName} {user?.lastName}'s Profile
        </h1>
        {userId === user.id && (
          <p className="text-gray-400">Manage your travel journal and achievements</p>

        )

        }
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Mail size={20} className="text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-400" />
        </button>
        <button className="bg-[#656fe2] hover:bg-[#656fe2]/80 px-4 py-2 rounded-lg transition-colors">
          <Edit size={16} className="inline mr-2" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// Profile hero section with user details and stats
function ProfileHero({ user, currentLocation, stats }) {
  const { otherUser } = useParams();
  return (
    <div className="bg-gradient-to-r from-[#656fe2] to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl border border-[#c0c6fc]/30">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
            <img
              src={
                user.avatar ||
                "https://imgs.search.brave.com/4Zao298wcGdVAOGg3B3_yMa79bBtjbkb6njql8OQKjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjY2/NTQ1MDYyL3ZlY3Rv/ci9kZWZhdWx0LXBs/YWNlaG9sZGVyLXBy/b2ZpbGUtaWNvbi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/UDMyQm1LaTRCc0I0/Smhob0NhaFRYaHdC/QTBCNkhnSjNBcm9X/SHl1TThOOD0"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center md:text-left text-white flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {user.username}
          </h2>

          <div className="space-y-2 mb-6">
            <p className="flex items-center justify-center md:justify-start gap-2 text-lg">
              <Globe className="w-5 h-5" />
              Global Explorer & Digital Nomad
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Currently in: {currentLocation.city}, {currentLocation.country}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Plane className="w-4 h-4" />
              Next destination: Tokyo, Japan
            </p>
          </div>

          {/* Statistics Grid */}
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
  );
}

// Recent entries section
function RecentEntriesSection({ recentEntries, selectedEntry, setSelectedEntry, isLoaded }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#656fe2] rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Recent Entries</h2>
      </div>

      <div className="grid gap-6">
        {recentEntries.map((entry, index) => (
          <RecentEntryCard
            key={entry._id}
            entry={entry}
            selectedEntry={selectedEntry}
            setSelectedEntry={setSelectedEntry}
            index={index}
            isLoaded={isLoaded}
          />
        ))}
      </div>

      {/* Empty State */}
      {recentEntries.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No recent entries
          </h3>
          <p className="text-gray-400 mb-4">
            Start your travel journal by creating your first entry
          </p>
        </div>
      )}
    </div>
  );
}

// Individual recent entry card
function RecentEntryCard({ entry, selectedEntry, setSelectedEntry, index, isLoaded }) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-6 shadow-lg border border-[#c0c6fc]/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#c0c6fc]/40 ${selectedEntry === entry._id ? "ring-2 ring-[#656fe2] scale-[1.02]" : ""
        }`}
      onClick={() =>
        setSelectedEntry(selectedEntry === entry._id ? null : entry._id)
      }
      style={{
        animationDelay: `${index * 150}ms`,
        animation: isLoaded ? "slideUp 0.6s ease-out forwards" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#656fe2] rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{entry.location}</h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {entry.createdAt}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-gray-300 mb-4 leading-relaxed">{entry.title}</p>

      {selectedEntry === entry._id && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-[#c0c6fc]/20">
          <p className="text-gray-300 text-sm">
            Click to read full entry and view all photos from this location.
          </p>
        </div>
      )}
    </div>
  );
}

// Right sidebar with travel map and achievements
function ProfileRightSidebar({ setOpenTravelMap, achievements, isLoaded }) {
  return (
    <div className="w-80 p-6 bg-gray-800 border-l border-[#c0c6fc]/20">
      <TravelMapSection setOpenTravelMap={setOpenTravelMap} />
      <AchievementsSection achievements={achievements} isLoaded={isLoaded} />
    </div>
  );
}

// Travel map section
function TravelMapSection({ setOpenTravelMap }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Travel Map</h3>
      </div>

      <div
        onClick={() => setOpenTravelMap(prev => !prev)}
        className="bg-gradient-to-br from-[#656fe2] to-purple-600 rounded-xl h-48 flex items-center justify-center text-white text-center p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border border-[#c0c6fc]/30"
      >
        <div>
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-medium">Interactive World Map</p>
          <p className="text-sm opacity-90 mt-1">Click pins to view entries</p>
        </div>
      </div>
    </div>
  );
}

// Achievements section
function AchievementsSection({ achievements, isLoaded }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Achievements</h3>
      </div>

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={index}
            achievement={achievement}
            index={index}
            isLoaded={isLoaded}
          />
        ))}
      </div>
    </div>
  );
}

// Individual achievement card
function AchievementCard({ achievement, index, isLoaded }) {
  const Icon = achievement.icon;

  return (
    <div
      className="bg-gray-700 rounded-lg p-4 shadow-md border border-[#c0c6fc]/20 hover:shadow-lg hover:border-[#c0c6fc]/40 transition-all duration-300 hover:scale-105 group"
      style={{
        animationDelay: `${(index + 3) * 100}ms`,
        animation: isLoaded ? "slideUp 0.6s ease-out forwards" : "none",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-white">{achievement.title}</div>
          <div className="text-sm text-gray-400">{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;