import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchStuff } from "../service/api.js";
import JournalCard from "../comps/JournalCard.jsx";
import StatCard from "../comps/StatCard.jsx";
import Header from "../comps/Header.jsx";
import AddEntryButton from "../comps/AddEntryButton.jsx";
import ViewJournal from "../comps/ViewJournal.jsx";
import ButtonAnimatedGradient from "../../components/uilayouts/ButtonAnimatedGradient.jsx";
import {
  Search,
  Mail,
  Bell,
  MoreHorizontal,
  Play,
  Heart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  LogOut,
  LayoutDashboard,
  Inbox,
  BookOpen,
  CheckSquare,
  Users,
  Camera,
  Globe,
  TrendingUp,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import ButtonHoverRight from "../../components/uilayouts/ButtonHoverRight.jsx";
import QuickStatsSection from "../comps/QuickStatsSection.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, user, getUser } = useAuth();

  // UI States - for view mode, search, filters
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [likedEntries, setLikedEntries] = useState(new Set([1, 3]));

  // Data States - for backend data
  const [countries, setCountries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  // Modal State - for viewing journal entries
  const [viewJournal, setViewJournal] = useState({
    mode: false,
    entry_id: "",
  });

  // Auth effect - get user data on mount
  useEffect(() => {
    getUser();
  }, []);

  // Fetch journal entries and countries from backend
  const handleFetchJournalEntries = async () => {
    try {
      const response = await fetchStuff.get("/journals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Fetching the countries visited by the user
      const userCountries = await fetchStuff.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCountries(userCountries.data.user.countriesVisited || []);
      setJournalEntries(response.data.formattedJournals || []);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleFetchJournalEntries();
  }, []);

  // Navigation handler - navigate to user profile
  const handleNavigateProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  // Calculate statistics from journal entries
  const stats = {
    totalEntries: journalEntries.length,
    countriesVisited: countries.length,
    totalLikes: journalEntries.reduce((sum, entry) => sum + entry.likes, 0),
    thisMonth: user?.recentEntries || 0,
  };

  // Handle like functionality
  const handleLike = (entryId) => {
    setLikedEntries((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(entryId)) {
        newLiked.delete(entryId);
      } else {
        newLiked.add(entryId);
      }
      return newLiked;
    });
  };

  // Show loader while loading
  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  // Filter entries based on search term and selected filter
  const filteredEntries = journalEntries.filter((entry) => {
    const title = entry?.title || "";
    const location = entry?.location || "";
    const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "recent" &&
            new Date(entry.date) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (selectedFilter === "popular" && entry.likes > 30);
    return matchesSearch && matchesFilter;
  });

  return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Modal for viewing journal entries */}
        {viewJournal.mode && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setViewJournal({ mode: false, entry_id: "" })}
            >
              <div
                  className="relative w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg bg-gray-800 p-6"
                  onClick={(e) => e.stopPropagation()}
              >
                <ViewJournal entryId={viewJournal.entry_id} />
              </div>
            </div>
        )}

        <Sidebar handleNavigateProfile={handleNavigateProfile} />
        <MainContent
            user={user}
            stats={stats}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filteredEntries={filteredEntries}
            setViewJournal={setViewJournal}
        />
      </div>
  );
}

// Sidebar Component - Left navigation panel
function Sidebar({ handleNavigateProfile }) {
    const navigate = useNavigate();
  return (
      <div className="w-64 bg-gray-800 p-6 shadow-lg border-r border-[#c0c6fc]/20">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#656fe2] flex items-center justify-center">
            <Camera className="text-white" size={16} />
          </div>
          <span className="text-xl font-semibold text-white">Journal</span>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">Overview</h3>
          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={BookOpen} label="Entries" />
            <SidebarItem icon={Globe} label="Countries" />
            <SidebarItem icon={Heart} label="Favorites" />
            <SidebarItem icon={TrendingUp} label="Analytics" />
          </nav>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">Quick Actions</h3>
          <div className="space-y-3" onClick = {() => navigate("/add-entry")}>
            <ButtonAnimatedGradient message = "Add New Entry" />
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-auto">
          <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-4">Settings</h3>
          <nav className="space-y-2">
            <SidebarItem icon={Settings} label="Settings" />
            <div onClick={handleNavigateProfile}>
              <SidebarItem icon={Users} label="Profile" />
            </div>
              <div onClick ={() => {
                  localStorage.removeItem("token");
                  navigate('/')
              }}>
                <SidebarItem icon={LogOut} label="Logout" />
              </div>
          </nav>
        </div>
      </div>
  );
}

// Individual sidebar navigation item
function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
      <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              active ? 'bg-[#656fe2] text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
          onClick={onClick}
      >
        <Icon size={20} />
        <span className="text-sm">{label}</span>
      </div>
  );
}

// Main content area component
function MainContent({
                       user,
                       stats,
                       searchTerm,
                       setSearchTerm,
                       selectedFilter,
                       setSelectedFilter,
                       viewMode,
                       setViewMode,
                       filteredEntries,
                       setViewJournal
                     }) {
  return (
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <DashboardHeader
              user={user}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
          />
          <WelcomeBanner user={user} />
          <StatsGrid stats={stats} />
          <FilterSection
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
          />
          <JournalEntriesSection
              viewMode={viewMode}
              filteredEntries={filteredEntries}
              setViewJournal={setViewJournal}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
          />
        </div>
        <RightSidebar stats={stats} />
      </div>
  );
}

// Top header with search and user info
function DashboardHeader({ user, searchTerm, setSearchTerm }) {
    const navigate = useNavigate();
  return (
      <div className="flex items-center justify-between mb-8">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
              type="text"
              placeholder="Search your journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-[#c0c6fc]/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#656fe2] focus:border-transparent"
          />
        </div>

        {/* Right side icons and user */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Mail size={20} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-3 ml-4" onClick = {() => navigate(`/profile/${user.id}`)}>
            <div className="w-10 h-10 bg-[#656fe2] rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'S'}
            </span>
            </div>
            <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span>
          </div>
        </div>
      </div>
  );
}

// Welcome banner section
function WelcomeBanner({ user }) {
    const navigate = useNavigate();
  return (
      <div className="bg-gradient-to-r from-[#656fe2] to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl border border-[#c0c6fc]/30">
        <div className="max-w-2xl">
          <div className="text-sm text-purple-200 mb-2 uppercase tracking-wide">Travel Journal</div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome back, {user?.firstName}!<br />
            Ready to capture your next adventure?
          </h1>
          <div className="flex gap-4" onClick = {() => navigate('/view-others')}>
            <ButtonHoverRight message = "Look where others are travelling!" />
          </div>
        </div>
      </div>
  );
}

// Statistics grid component
function StatsGrid({ stats }) {
  const statCards = [
    { icon: Camera, label: 'Total Entries', value: stats.totalEntries, color: 'bg-blue-500' },
    { icon: Globe, label: 'Countries Visited', value: stats.countriesVisited, color: 'bg-green-500' },
    { icon: Heart, label: 'Total Likes', value: stats.totalLikes, color: 'bg-red-500' },
    { icon: TrendingUp, label: 'This Month', value: stats.thisMonth, color: 'bg-purple-500' }
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
            <StatCardDark key={index} {...stat} />
        ))}
      </div>
  );
}

// Individual stat card component for dark theme
function StatCardDark({ icon: Icon, label, value, color }) {
  return (
      <div className="bg-gray-800 rounded-xl p-6 border border-[#c0c6fc]/20 hover:border-[#c0c6fc]/40 transition-colors shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
  );
}

// Filter and view mode section
function FilterSection({ selectedFilter, setSelectedFilter, viewMode, setViewMode }) {
  return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          {/* Filter Dropdown */}
          <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-[#c0c6fc]/30 rounded-xl text-white focus:ring-2 focus:ring-[#656fe2] focus:border-transparent"
          >
            <option value="all">All Entries</option>
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-800 border border-[#c0c6fc]/30 rounded-xl p-1">
            <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                        ? "bg-[#656fe2] text-white shadow-sm"
                        : "text-gray-400"
                }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                        ? "bg-[#656fe2] text-white shadow-sm"
                        : "text-gray-400"
                }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
  );
}

// Journal entries section
function JournalEntriesSection({
                                 viewMode,
                                 filteredEntries,
                                 setViewJournal,
                                 searchTerm,
                                 setSearchTerm,
                                 selectedFilter,
                                 setSelectedFilter
                               }) {
  return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Your Journal Entries</h2>

        {/* Journal Entries Grid/List */}
        <div
            className={`grid gap-6 ${
                viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
            }`}
        >
          {filteredEntries.map((entry) => (
              <div
                  key={entry.id}
                  onClick={() => setViewJournal({
                    mode: true,
                    entry_id: entry.id,
                  })}
                  className="cursor-pointer"
              >
                <JournalCard entry={entry} />
              </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No entries found
              </h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFilter("all");
                  }}
                  className="text-[#656fe2] hover:text-[#656fe2]/80 font-medium"
              >
                Clear filters
              </button>
            </div>
        )}
      </div>
  );
}

// Right sidebar with quick stats and recent activity
function RightSidebar({ stats }) {
  return (
      <div className="w-80 p-6 bg-gray-800 border-l border-[#c0c6fc]/20">
        <QuickStatsSection stats={stats} />
        <RecentActivitySection />
      </div>
  );
}

// Quick statistics section


// Recent activity section
function RecentActivitySection() {
  const activities = [
    { action: 'New entry added', time: '2 hours ago', type: 'entry' },
    { action: 'Photo uploaded', time: '5 hours ago', type: 'photo' },
    { action: 'Country visited', time: '1 day ago', type: 'country' }
  ];

  return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <button className="text-gray-400 hover:text-white">
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
          ))}
        </div>
        <button className="w-full text-[#656fe2] hover:text-[#656fe2]/80 text-sm font-medium mt-4">
          View All Activity
        </button>
      </div>
  );
}

// Individual activity item component
function ActivityItem({ action, time, type }) {
  const getIcon = () => {
    switch (type) {
      case 'entry': return BookOpen;
      case 'photo': return Camera;
      case 'country': return Globe;
      default: return BookOpen;
    }
  };

  const Icon = getIcon();

  return (
      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-[#c0c6fc]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#656fe2] rounded-full flex items-center justify-center">
            <Icon className="text-white" size={16} />
          </div>
          <div>
            <div className="text-white text-sm font-medium">{action}</div>
            <div className="text-gray-400 text-xs">{time}</div>
          </div>
        </div>
      </div>
  );
}