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
  UserPlus,
  MessageCircle,
  Share2,
  Flag,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { fetchStuff } from "../service/api";
import { useMessage } from "../context/messageContext";

const OtherUserProfile = () => {
  //  user ID from URL params
  const { userId } = useParams();

  // UI States
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { user: currentUser, loading } = useAuth(); //  current user (the logged-in user viewing the profile) with loading state from authContext
  const [isLoaded, setIsLoaded] = useState(!loading);
  const [openTravelMap, setOpenTravelMap] = useState(false);
  const [specificUser, setSpecificUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { setOpenMessageModal } = useMessage();

  //function to fetch follow status
  const fetchFollowStatus = async () => {
    try {
      const response = await fetchStuff.get(
        `/users/fetchFollowStatus/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setIsFollowing(response.data.status);
        console.log(
          "Fetched follow status: ",
          response.data.status ? "Following" : "Not following"
        );
      }
    } catch (err) {
      console.error("Error fetching follow status: ", err.message);
    }
  };

  useEffect(() => {
    fetchFollowStatus();
  });
  //fetching the specific user on every mount/render

  //function
  const fetchSpecificUser = async () => {
    try {
      const response = await fetchStuff.get(
        `/users/getSpecificUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response status: ", response.status);
      if (response.status === 200) {
        setSpecificUser(response.data.user);
        console.log("Fetched the specific user data: ", response.data.user);
      }
    } catch (err) {
      console.log(
        "Error has occured at otheruserprofilepage at fechspecificUser function"
      );
      console.error(err.message);
    }
  };
  //useffecting it
  useEffect(() => {
    fetchSpecificUser();
  }, [userId]);

  // Recent entries state
  const [recentEntries, setRecentEntries] = useState([]);
  const [userError, setUserError] = useState(null);

  // Fetch recent entries for the specific user
  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (!userId) return;
      try {
        const response = await fetchStuff.get(
          `/journals/recentJournals/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200 && response.data.recentJournals) {
          setRecentEntries(response.data.recentJournals);
          if (response.data.recentJournals.length === 0) {
            console.log("0 entries are logged by the user");
            setRecentEntries([]);
          }
        } else {
          setRecentEntries([]);
        }
      } catch (err) {
        setRecentEntries([]);
        // Optionally log error
        console.log(err.message);
      }
    };
    fetchRecentEntries();
  }, [userId]);

  // Simulate loading effect
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //     setIsLoaded(true);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Mock follow/unfollow handler
  const handleFollowToggle = async () => {
    try {
      const response = await fetchStuff.post(
        `/users/followUnfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setIsFollowing(response.data.status);
        console.log(
          "Follow status updated: ",
          response.data.status ? "Following" : "Not following"
        );
      }
    } catch (err) {
      console.error(
        "Error at otheruserprofile page in handlefollowtoggle function : ",
        err.message
      );
    }

    fetchSpecificUser();
  };

  // Mock message user handler
  const handleMessageUser = () => {
    setOpenMessageModal(true);
    console.log("Opening chat with user:", specificUser.username);
  };

  // Mock navigation
  const navigate = useNavigate();

  // Show loader while loading or if specificUser is not loaded
  if (loading || !specificUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Show error if user not found
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-bold text-xl mb-2">User not found</p>
          <p className="text-gray-400">{userError}</p>
        </div>
      </div>
    );
  }

  // Achievement data (with unlock logic)
  const achievements = [
    {
      icon: Globe,
      title: "Continent Collector",
      desc: "Visited 3 continents",
      color: "bg-blue-500",
      unlocked: (specificUser?.countriesVisited?.length || 0) >= 15,
    },
    {
      icon: Plane,
      title: "Frequent Flyer",
      desc: "50+ flights logged",
      color: "bg-green-500",
      unlocked: (specificUser?.milesTraveled || 0) >= 50000,
    },
    {
      icon: BookOpen,
      title: "Prolific Writer",
      desc: "100+ journal entries",
      color: "bg-purple-500",
      unlocked: (specificUser?.journalEntries || 0) >= 100,
    },
    {
      icon: Camera,
      title: "Photo Master",
      desc: "500+ photos taken",
      color: "bg-pink-500",
      unlocked: (specificUser?.photosTaken || 0) >= 500,
    },
    {
      icon: Star,
      title: "Local Expert",
      desc: "Featured in travel guides",
      color: "bg-yellow-500",
      unlocked: !!specificUser?.isFeatured,
    },
    {
      icon: Award,
      title: "Adventure Seeker",
      desc: "Climbed 5+ mountains",
      color: "bg-red-500",
      unlocked: (specificUser?.mountainsClimbed || 0) >= 5,
    },
  ];

  // User statistics
  const stats = [
    {
      number: (specificUser?.countriesVisited || []).length,
      label: "Countries",
    },
    { number: specificUser?.journalEntries || 0, label: "Entries" },
    {
      number: (specificUser?.milesTraveled || 0).toLocaleString(),
      label: "Miles",
    },
    { number: specificUser?.photosTaken || 0, label: "Photos" },
  ];

  const currentLocation = {
    city: specificUser?.currentLocation?.city || "-",
    country: specificUser?.currentLocation?.country || "-",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Travel Map Modal */}
      {openTravelMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-5xl h-[80%] bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-[#c0c6fc]/20">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Travel Map</h2>
              <p className="text-gray-400 mb-8">
                Interactive travel map would appear here
              </p>
              <button
                onClick={() => setOpenTravelMap(false)}
                className="bg-[#656fe2] hover:bg-[#656fe2]/80 px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <OtherProfileSidebar
        navigate={navigate}
        specificUser={specificUser}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />
      <MainOtherProfileContent
        specificUser={specificUser}
        currentUser={currentUser}
        currentLocation={currentLocation}
        stats={stats}
        recentEntries={recentEntries || []}
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
        setOpenTravelMap={setOpenTravelMap}
        achievements={achievements}
        isLoaded={isLoaded}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onMessageUser={handleMessageUser}
      />
    </div>
  );
};

// Sidebar Component for Other User Profile
function OtherProfileSidebar({
  navigate,
  specificUser,
  isFollowing,
  onFollowToggle,
}) {
  return (
    <div className="w-64 bg-gray-800 p-6 shadow-lg border-r border-[#c0c6fc]/20">
      {/* Back Button */}
      <button
        onClick={() => navigate("/view-others")}
        className="flex items-center gap-3 mb-8 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* User Info Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#656fe2] flex items-center justify-center">
          <Users className="text-white" size={16} />
        </div>
        <span className="text-xl font-semibold text-white">Profile</span>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button
            onClick={onFollowToggle}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isFollowing
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-[#656fe2] text-white hover:bg-[#656fe2]/80"
            }`}
          >
            <UserPlus size={16} />
            <span className="text-sm">
              {isFollowing ? "Unfollow" : "Follow"}
            </span>
          </button>

          {/* <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <MessageCircle size={16} />
            <span className="text-sm">Message</span>
          </button> */}

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <Share2 size={16} />
            <span className="text-sm">Share Profile</span>
          </button>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">
          Navigation
        </h3>
        <nav className="space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <SidebarItem icon={Users} label="Profile" active />
          <SidebarItem icon={BookOpen} label="Entries" />
          <SidebarItem icon={Globe} label="Travel Map" />
        </nav>
      </div>

      {/* Report Section */}
      <div className="mt-auto">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
          <Flag size={16} />
          <span className="text-sm">Report User</span>
        </button>
      </div>
    </div>
  );
}

// Individual sidebar navigation item
function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-[#656fe2] text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// Main content area for other user profile
function MainOtherProfileContent({
  specificUser,
  currentUser,
  currentLocation,
  stats,
  recentEntries,
  selectedEntry,
  setSelectedEntry,
  setOpenTravelMap,
  achievements,
  isLoaded,
  isFollowing,
  onFollowToggle,
  onMessageUser,
}) {
  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6">
        <OtherProfileHeader
          specificUser={specificUser}
          isFollowing={isFollowing}
          onFollowToggle={onFollowToggle}
          onMessageUser={onMessageUser}
        />
        <OtherProfileHero
          specificUser={specificUser}
          currentLocation={currentLocation}
          stats={stats}
        />
        <RecentEntriesSection
          recentEntries={recentEntries || []}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          isLoaded={isLoaded}
          isOtherUser={true}
        />
      </div>
      <OtherProfileRightSidebar
        setOpenTravelMap={setOpenTravelMap}
        achievements={achievements}
        isLoaded={isLoaded}
        specificUser={specificUser}
      />
    </div>
  );
}

// Profile header for other user
function OtherProfileHeader({
  specificUser,
  isFollowing,
  onFollowToggle,
  onMessageUser,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {specificUser.firstName} {specificUser.lastName}
        </h1>
        <p className="text-gray-400">Travel enthusiast and digital nomad</p>
        {specificUser.bio && (
          <p className="text-gray-300 mt-2 max-w-2xl">{specificUser.bio}</p>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onFollowToggle}
          className={`px-6 py-2 rounded-lg transition-colors font-medium ${
            isFollowing
              ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
              : "bg-[#656fe2] text-white hover:bg-[#656fe2]/80"
          }`}
        >
          <UserPlus size={16} className="inline mr-2" />
          {isFollowing ? "Following" : "Follow"}
        </button>

        {/* <button
          onClick={onMessageUser}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
        >
          <MessageCircle size={16} className="inline mr-2" />
          Message
        </button> */}

        {/* <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <MoreHorizontal size={20} className="text-gray-400" />
        </button> */}
      </div>
    </div>
  );
}

// Profile hero section for other user
function OtherProfileHero({ specificUser, currentLocation, stats }) {
  const joinDate = specificUser?.createdAt
    ? new Date(specificUser.createdAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="bg-gradient-to-r from-[#656fe2] to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl border border-[#c0c6fc]/30">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
            <img
              src={specificUser?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>
          {/* Online/Offline Status */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center md:text-left text-white flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {specificUser?.username || "Unknown User"}
          </h2>

          <div className="space-y-2 mb-6">
            <p className="flex items-center justify-center md:justify-start gap-2 text-lg">
              <Globe className="w-5 h-5" />
              {specificUser?.title || "No Title"}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Currently in: {currentLocation.city || "-"},{" "}
              {currentLocation.country || "-"}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4" />
              Joined: {joinDate}
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.number !== undefined && stat.number !== null
                    ? stat.number
                    : 0}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Follower Stats */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-sm opacity-90">
            <span>
              {(specificUser?.followers.length || 0).toLocaleString()}{" "}
              {specificUser?.followers.length > 1 ? "Followers" : "Follower"}{" "}
            </span>
            <span>
              {(specificUser?.following.length || 0).toLocaleString()} Following
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent entries section
function RecentEntriesSection({
  recentEntries,
  selectedEntry,
  setSelectedEntry,
  isLoaded,
  isOtherUser = false,
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#656fe2] rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isOtherUser ? "Recent Entries" : "Your Recent Entries"}
        </h2>
      </div>

      {!recentEntries || recentEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No recent entries
          </h3>
          <p className="text-gray-400 mb-4">
            {isOtherUser
              ? "This user hasn't shared any recent entries"
              : "Start your travel journal by creating your first entry"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {recentEntries.map((entry, index) => (
            <RecentEntryCard
              key={entry._id}
              entry={entry}
              selectedEntry={selectedEntry}
              setSelectedEntry={setSelectedEntry}
              index={index}
              isLoaded={isLoaded}
              isOtherUser={isOtherUser}
            />
          ))}
        </div>
      )}

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
            {isOtherUser
              ? "This user hasn't shared any recent entries"
              : "Start your travel journal by creating your first entry"}
          </p>
        </div>
      )}
    </div>
  );
}

// Individual recent entry card
function RecentEntryCard({
  entry,
  selectedEntry,
  setSelectedEntry,
  index,
  isLoaded,
}) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-6 shadow-lg border border-[#c0c6fc]/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#c0c6fc]/40 ${
        selectedEntry === entry._id ? "ring-2 ring-[#656fe2] scale-[1.02]" : ""
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
          <p className="text-gray-300 text-sm mb-3">{entry.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {entry.likes} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {entry.comments} comments
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Right sidebar for other user profile
function OtherProfileRightSidebar({
  setOpenTravelMap,
  achievements,
  isLoaded,
  specificUser,
}) {
  return (
    <div className="w-80 p-6 bg-gray-800 border-l border-[#c0c6fc]/20">
      <TravelMapSection setOpenTravelMap={setOpenTravelMap} />
      <OtherUserAchievementsSection
        achievements={achievements}
        isLoaded={isLoaded}
      />
      <UserStatsSection specificUser={specificUser} />
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
        onClick={() => setOpenTravelMap((prev) => !prev)}
        className="bg-gradient-to-br from-[#656fe2] to-purple-600 rounded-xl h-48 flex items-center justify-center text-white text-center p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border border-[#c0c6fc]/30"
      >
        <div>
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-medium">View Travel Map</p>
          <p className="text-sm opacity-90 mt-1">Explore visited locations</p>
        </div>
      </div>
    </div>
  );
}

// Achievements section for other user
function OtherUserAchievementsSection({ achievements, isLoaded }) {
  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  );

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Achievements</h3>
        <span className="text-sm text-gray-400">
          ({unlockedAchievements.length}/{achievements.length})
        </span>
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

// Additional user stats section
function UserStatsSection({ specificUser }) {
  const memberSince = specificUser?.createdAt
    ? new Date(specificUser.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">User Stats</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700 rounded-lg p-4 border border-[#c0c6fc]/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {memberSince}
            </div>
            <div className="text-sm text-gray-400">Member Since</div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 border border-[#c0c6fc]/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {(specificUser?.totalLikes || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Likes Received</div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 border border-[#c0c6fc]/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {specificUser?.averageRating !== undefined &&
              specificUser?.averageRating !== null
                ? specificUser.averageRating
                : "N/A"}
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Achievement card
function AchievementCard({ achievement, index, isLoaded }) {
  const Icon = achievement.icon;

  return (
    <div
      className={`rounded-lg p-4 shadow-md border border-[#c0c6fc]/20 transition-all duration-300 ${
        achievement.unlocked
          ? "bg-gray-700 hover:shadow-lg hover:border-[#c0c6fc]/40 hover:scale-105"
          : "bg-gray-800 opacity-60"
      } group`}
      style={{
        animationDelay: `${(index + 3) * 100}ms`,
        animation: isLoaded ? "slideUp 0.6s ease-out forwards" : "none",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${
            achievement.unlocked ? achievement.color : "bg-gray-600"
          } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div
            className={`font-semibold ${
              achievement.unlocked ? "text-white" : "text-gray-500"
            }`}
          >
            {achievement.title}
            {achievement.unlocked && (
              <span className="ml-2 text-xs text-green-400">✓</span>
            )}
          </div>
          <div className="text-sm text-gray-400">{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
}

export default OtherUserProfile;
