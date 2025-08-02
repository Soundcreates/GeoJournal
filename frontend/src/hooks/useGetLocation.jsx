// hooks/useGetLocation.js
import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";

const useGetLocation = () => {
  const mapApi = "pk.c974ea1d688cb11464cc03ca87d32fef";

  const [locationName, setLocationName] = useState(() => {
    const cached = localStorage.getItem("locationName");
    return cached ? JSON.parse(cached) : {
      city: "",
      country: "",
      coordinates: [null, null],
    };
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    const cached = localStorage.getItem('userLocation');
    if (cached) {
      const cachedLocation = JSON.parse(cached);
      const cacheTime = localStorage.getItem('userLocationTime');
      const now = Date.now();

      if (cacheTime && (now - parseInt(cacheTime)) << 3600000) {
        setLocationName(cachedLocation);
        setLoading(false);
        return;
      }
    }

    if (!isGeolocationAvailable) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    if (!isGeolocationEnabled) {
      setError("Geolocation is not enabled. Please allow location access.");
      setLoading(false);
      return;
    }

    if (coords) {
      const fetchLocationData = async () => {
        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${mapApi}&lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await response.json();
          const locationData = {
            city: data.address.city || "Unknown City",
            country: data.address.country || "Unknown Country",
            coordinates: [coords.latitude, coords.longitude],
          }

          localStorage.setItem('userLocation', JSON.stringify(locationData));
          localStorage.setItem('userLocationTime', Date.now().toString());

          setLocationName(locationData);
        } catch (err) {
          setError("Failed to fetch location data: ", err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchLocationData();
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return { locationName, error, loading };
};

export default useGetLocation;
