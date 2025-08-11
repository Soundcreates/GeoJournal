import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MapPin, User, Globe, Search } from "lucide-react";

function Header({ searchTerm, setSearchTerm, handleNavigateProfile }) {
  const { user } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;

      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`bg-white border-b border-gray-100 rounded-[0px] sticky top-0 z-40 transition-all duration-300  ${scrolled &&
        "bg-white/30 rounded-full top-4  p-2  shadow-lg backdrop-blur-md transition-all duration-300"
        }`}
    >
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
                {user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
