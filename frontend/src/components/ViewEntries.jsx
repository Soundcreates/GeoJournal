// frontend/src/components/ViewEntries.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { fetchStuff } from '../service/api';

function ViewEntries({ setOpenTravelMap }) {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultCenter = [51.5074, -0.1278] // london coords as fallback

  const handleFetchUserJournals = async () => {
    if (!user || !user.id) {
      console.log("User not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchStuff.get('/journals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });


      if (response.status === 200) {
        console.log("Fetched journals successfully:", response.data.formattedJournals);

        const journalData = response.data.formattedJournals || [];
        setJournals(journalData);


        const validPositions = journalData
          .filter(journal => {

            return journal.coordinates &&
              Array.isArray(journal.coordinates) &&
              journal.coordinates.length === 2 &&
              !isNaN(journal.coordinates[0]) &&
              !isNaN(journal.coordinates[1]);
          })
          .map(journal => journal.coordinates);

        console.log("Valid positions found:", validPositions);
        setPositions(validPositions);
        setError(null);
      } else {
        console.log("Unexpected response status:", response.status);
        setError("Failed to fetch journals");
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
      setError("Error fetching journals: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchUserJournals();
  }, [user]);


  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading your travel map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading map</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={handleFetchUserJournals}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Calculate map center from user's journals or use default
  const mapCenter = positions.length > 0 ? positions[0] : defaultCenter;

  return (
    <div className="w-full h-full">

      <button
        onClick={() => setOpenTravelMap(false)}
        className="absolute fixed top-10 right-10 z-1 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-gray-600 hover:text-black shadow"
      >
        ✖
      </button>

      <MapContainer
        center={mapCenter} // ✅ Fix: Add required center prop
        zoom={positions.length > 0 ? 10 : 13}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Enhanced markers with popups */}
        {positions.map((position, index) => {
          const journal = journals[index];
          return (
            <Marker key={index} position={position}>
              <Popup>
                <div className="min-w-48">
                  {journal ? (
                    <>
                      <h3 className="font-bold text-lg mb-1">{journal.title || 'Travel Entry'}</h3>
                      <p className="text-sm text-gray-600 mb-2">{journal.location || 'Unknown Location'}</p>
                      {journal.imageUrl && (
                        <img
                          src={journal.imageUrl}
                          alt="Journal entry"
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p>Travel location #{index + 1}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ✅ Show message when no positions */}
        {positions.length === 0 && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
            <p className="text-gray-600 text-sm">No journal entries with valid coordinates found.</p>
            <p className="text-gray-500 text-xs mt-1">Add some journal entries to see them on the map!</p>
          </div>
        )}
      </MapContainer>
    </div>
  );
}

export default ViewEntries;