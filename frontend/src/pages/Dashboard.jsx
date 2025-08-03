import React, { useState } from "react";
import { useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Grid
import JournalCard from "../components/JournalCard.jsx";
import StatCard from "../components/StatCard.jsx";
import Header from "../components/Header.jsx";3X3,
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
  const navigate = import AddEntryButton from "../components/AddEntryButton.jsx";

useNavigate();
  const { loading, user } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [likedEntries, setLikedEntries] = useState(new Set([1, 3]));

  // Mock data for journal entries
  const [journalEntr
  const [countries, setCountries] = useState([]);
ies] = useState([
    {
      id: 1,
      title: "Sunset at Golden Gate Bridge",
      
lo  on: "San Francisco, CA",
      date: "2024-07-15",
      aiCaption:
        "A breathtaking golden hour moment where the iconic bridge meets the endless Pacific horizon.",
      image:
        "https://images.unsplash.com/pho

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
      );to-1449824913935-59a10b8d200response.data.formattedJournals || []: "Peaceful",
      weather: "Clear",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      title: "Tokyo Street Food Adventure",
      location: "Shibuya, Tokyo",
      date: "2024-07-12",
      aiCaption:
        "Neon lights dance on wet pavement as the city's culinary heartbeat ulses througstatsin rkets.",
      image:
        "https://images.unsplash.com/photo-countries.length,42051841857-5f90071e7989?w=400&h=300&fit=crop",
      coordinates: "35.6762° N,    thisMonth: countries.length,    ;od: "Excited",
      weather: "Rainy",
      likes: 42,
      comments: 12,
    },
    {
      id: 3,
      title: "Mountain Peak Meditation",
      location: "Alps, Switzerland",
      date: "2024-07-08",
      aiCaption:
      
  "Where clouds kiss mountain peaks and

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }
 sence speaks louder than words in nature's cathedral.",
      image:
        "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=300&fit=crop",
      coordinates: "46.5197° N, 7.6323° E",
      mood: "Inspired",
      weather: "Partly Cloudy",
      likes: 38,
      comments: 8,
    },
    {
      id: 4,
      title: "Cozy Café Corner",
      location: "Paris, France",
      date: "2024-07-05",
      aiCaption:
        "Sam rises from morning coffee while cobblestone streets whisper tales of timeless romance.",
      image:
        "https://images.unsplash.com/photo-1551218808-94e22assName="flex items-center justify-between">
          <div className="flex i v      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleNavigateProfile={handleNavigateProfile}
      />alue={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent?"
                />
              </div>
            </div>

            {/* Profile Menu */}
            <div className="fle        <AddEntryButton />x items-center space-x-4 ">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                <Globe className="w-6 h-6" />
              </button>
              <div
                className="flex items-center p-2 space-x-3 cursor-pointer hover:bg-gray-100 hover:rounded-xl transition-all duration-300"
                onClick={handleNavigateProfile}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to ? stats.totalLikes : 0-purple-500 rounded-full flex items-center justify-center">
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

      <div claTotal Entries"
            value={stats.tota
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
          <diems-center space-x-4">
            <buon
              onClick={() => navigate("/add-entry")}              className="bg-blue-60  0 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
    New Entry</span>
              <Zap cssName="w-4 h-4" />
            </button>
          </v>

          <div className="fle  x items-center space-x-4">
            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-ed-xl focus:ring-2 focus:ring-blu500 focus:border-transparent"
            >
             option value="all">All Entr  ies</option>
              <option value="recent">Recent</option>
              <op
        t     ion value="pop
  u           lar">Popular<
              likedEntries={likedEntries}
              handleLike={handleLike}
           /option>
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
