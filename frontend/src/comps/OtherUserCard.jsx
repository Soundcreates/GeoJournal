import React from 'react';
import { User, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';


export default function OtherUserCard({ user, onClick }) {
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    const navigate = useNavigate();

    return (
        <div
            className="cursor-pointer group bg-gray-800 border border-[#c0c6fc]/20 hover:border-[#c0c6fc]/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-w-[260px]"
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-[#656fe2] p-0.5 group-hover:border-[#656fe2]/80 transition-colors">
                        <img
                            src={user && user.avatar ? user.avatar.toString() : defaultProfilePic}
                            alt={user.firstName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate group-hover:text-[#c0c6fc] transition-colors">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">@{user.username}</p>

                    {/* Additional User Info */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="truncate max-w-[100px]">{user.location}</span>
                            </div>
                        )}
                        {user.joinDate && (
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>Joined {user.joinDate}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Indicator */}
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#656fe2] rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <User size={16} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Stats Row (if user has stats) */}
            {(user.journalEntries || user.countriesVisited) && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        {user.journalEntries && (
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{user.journalEntries} entries</span>
                            </div>
                        )}
                        {user.countriesVisited && (
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{user.countriesVisited} countries</span>
                            </div>
                        )}
                    </div>
                    <button className="text-[#656fe2] hover:text-[#656fe2]/80 text-xs font-medium transition-colors" onClick={() => navigate(`/otherProfile/${user._id}`)}>
                        View Profile
                    </button>
                </div>
            )}
        </div>
    );
}

// Alternative Compact Version
export function OtherUserCardCompact({ user, onClick }) {
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    return (
        <div
            className="cursor-pointer group bg-gray-800 border border-[#c0c6fc]/20 hover:border-[#c0c6fc]/40 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-w-[200px]"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-[#656fe2] p-0.5 group-hover:border-[#656fe2]/80 transition-colors">
                        <img
                            src={user && user.avatar ? user.avatar.toString() : defaultProfilePic}
                            alt={user.firstName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-base truncate group-hover:text-[#c0c6fc] transition-colors">
                        {user.firstName}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">@{user.username}</p>
                </div>

                {/* Follow Button */}
                <button className="bg-[#656fe2] hover:bg-[#656fe2]/80 text-white text-xs px-3 py-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    Follow
                </button>
            </div>
        </div>
    );
}

// Alternative List Style Version
export function OtherUserCardList({ user, onClick }) {
    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    return (
        <div
            className="cursor-pointer group bg-gray-800 border border-[#c0c6fc]/20 hover:border-[#c0c6fc]/40 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Profile Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-[#656fe2] p-0.5">
                            <img
                                src={user && user.avatar ? user.avatar.toString() : defaultProfilePic}
                                alt={user.firstName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>

                    {/* User Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-[#c0c6fc] transition-colors">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                        {user.bio && (
                            <p className="text-gray-500 text-xs mt-1 max-w-md truncate">{user.bio}</p>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-2">
                    {(user.journalEntries || user.countriesVisited) && (
                        <div className="text-right text-xs text-gray-400 mr-4">
                            {user.journalEntries && <div>{user.journalEntries} entries</div>}
                            {user.countriesVisited && <div>{user.countriesVisited} countries</div>}
                        </div>
                    )}
                    <button className="bg-[#656fe2] hover:bg-[#656fe2]/80 text-white px-4 py-2 rounded-lg transition-colors">
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
}