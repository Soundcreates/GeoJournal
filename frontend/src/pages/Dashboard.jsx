import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchStuff } from "../service/api.js";
import JournalCard from "../components/JournalCard.jsx";
import StatCard from "../components/StatCard.jsx";
import Header from "../components/Header.jsx";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  User,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
  Globe,
} from "lucide-react";
import AddEntryButton from "../components/AddEntryButton.jsx";


export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [likedEntries, setLikedEntries] = useState(new Set([1, 3]));
  const [countries, setCountries] = useState([]);

  //state for journal entries
  const [journalEntries, setJournalEntries] = useState([]);

  const handleFetchJournalEntries = async () => {
    try {
      const response = await fetchStuff.get("/journals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      //fetching the countries visited by the user
      const userCountries = await fetchStuff.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCountries(userCountries.data.user.countriesVisited || []);
      console.log(
        "Fetched countries:",
        userCountries.data.user.countriesVisited
      );

      setJournalEntries(response.data.formattedJournals || []);
      console.log("Fetched journal entries:", response.data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  useEffect(() => {
    handleFetchJournalEntries();
  }, []);

  const handleNavigateProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  const stats = {
    totalEntries: journalEntries.length,
    countriesVisited: countries.length,
    totalLikes: journalEntries.reduce((sum, entry) => sum + entry.likes, 0),
    thisMonth: countries.length,
  };

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

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

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

  const handleNavigateViewJournal = (entry) => () => {
    navigate(`/view-journal/${entry.id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleNavigateProfile={handleNavigateProfile}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Welcome, {user?.firstName}
          </h2>
          <p className="text-gray-600">Ready to capture your next adventure?</p>
        </div>
        <AddEntryButton />
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Camera}
            label="Total Entries"
            value={stats.totalEntries}
            color="bg-blue-500"
          />
          <StatCard
            icon={Globe}
            label="Countries Visited"
            value={stats.countriesVisited}
            color="bg-green-500"
          />
          <StatCard
            icon={Heart}
            label="Total Likes"
            value={stats.totalLikes ? stats.totalLikes : 0}
            color="bg-red-500"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={stats.thisMonth}
            color="bg-purple-500"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Entries</option>
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
                  }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        <div
          className={`grid gap-6 ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {filteredEntries.map((entry) => (
            <div onClick={handleNavigateViewJournal(entry)}>
              <JournalCard
                key={entry.id}
                entry={entry}
                likedEntries={likedEntries}
                handleLike={handleLike}
              />
            </div>

          ))}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No entries found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
