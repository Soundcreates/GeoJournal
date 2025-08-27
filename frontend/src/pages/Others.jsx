import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { fetchStuff } from "../service/api.js";
import OtherUserCard from "../comps/OtherUserCard.jsx";

export function Others() {
  const position = [19.2183, 72.9781]; // Thane, India
  const [otherUsers, setOtherUsers] = useState([]);
  const [userCoords, setUserCoords] = useState({}); // use object keyed by userId

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchStuff.get("/users/getOtherUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setOtherUsers(response.data.users);
          console.log("Fetched other users:", response.data.users);

          // fetch coordinates for each user in parallel
          const coordsPromises = response.data.users.map(async (user) => {
            const coords = await fetchCords(user.currentLocation.city);
            return { userId: user.id, ...coords };
          });

          const results = await Promise.all(coordsPromises);

          // build map { userId: { lat, lon } }
          const coordsMap = {};
          results.forEach((r) => {
            if (r) coordsMap[r.userId] = r;
          });

          setUserCoords(coordsMap);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUsers();
  }, []);

  const fetchCords = async (place) => {
    try {
      const response = await fetchStuff.get(`/users/geocode/${place}`);
      if (response.status === 200) {
        const data = response.data;
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        };
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  return (
    <div className="w-screen h-screen bg-[#0F1727] flex">
      {/* Left Side */}
      <div className="w-[50%] h-full flex flex-col p-10">
        <h1 className="text-4xl text-white">
          Here are many people travelling the world!
        </h1>
        <div className="grid grid-cols-2 gap-10 p-10">
          {otherUsers.map((user) => (
            <OtherUserCard user={user} key={user.id} />
          ))}
        </div>
      </div>

      {/* Map Side */}
      <div className="w-[50%] h-full">
        <MapContainer center={position} zoom={13} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {otherUsers.map((user) => {
            const coords = userCoords[user.id];
            if (!coords) return null;

            return (
              <Marker
                key={user.id}
                position={[coords.latitude, coords.longitude]}
              >
                <Popup>
                  <div>
                    <h2>{user.firstName}</h2>
                    <h2>{user.username}</h2>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
