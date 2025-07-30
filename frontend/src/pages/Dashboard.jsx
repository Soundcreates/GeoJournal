import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchStuff } from "../service/api.js";

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
    navigate(`/profile/${user._id}`);
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

  const StatCard = ({ icon: IconComponent, label, value, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const JournalCard = ({ entry }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={entry.imageUrl}
          alt={entry.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => handleLike(entry.id)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center transition-all ${
              likedEntries.has(entry.id)
                ? "bg-red-500 text-white"
                : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                likedEntries.has(entry.id) ? "fill-current" : ""
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
            className={`px-2 py-1 text-xs rounded-full ${
              entry.mood === "Peaceful"
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
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">GeoJournal</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your adventures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center space-x-4 ">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                <Globe className="w-6 h-6" />
              </button>
              <div
                className="flex items-center p-2 space-x-3 cursor-pointer hover:bg-gray-100 hover:rounded-xl transition-all duration-300"
                onClick={handleNavigateProfile}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome , {user.firstName}! 🌍
          </h2>
          <p className="text-gray-600">Ready to capture your next adventure?</p>
        </div>

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
            value={stats.totalLikes}
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
            <button
              onClick={() => navigate("/add-entry")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Entry</span>
              <Zap className="w-4 h-4" />
            </button>
          </div>

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
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
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
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredEntries.map((entry) => (
            <JournalCard key={entry.id} entry={entry} />
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
