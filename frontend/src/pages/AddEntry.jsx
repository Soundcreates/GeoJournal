import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import { Upload, Sparkles, MapPin, FileText, Image } from "lucide-react";

function AddMarkerOnClick({
  markerLocation,
  setMarkerLocation,
  setLocationName,
  setIsLoading,
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setIsLoading(true);
      setMarkerLocation(e.latlng);

      try {
        //making the api call
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        setLocationName(data.display_name || "Location name not found");
      } catch (error) {
        console.error("Error fetching location name:", error);
        setLocationName("Location name not found");
      } finally {
        setIsLoading(false);
      }
    },
  });
  return <>{markerLocation && <Marker position={markerLocation} />}</>;
}

function AddEntry() {
  const position = [19.2183, 72.9781]; //example coordinates for thane india
  const [markerLocation, setMarkerLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              file,
              preview: e.target.result,
              id: Date.now() + Math.random(),
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleGeminiClick = () => {
    // This would trigger the Gemini API call
    console.log("Generating context with Gemini...", { title, locationName });
  };

  return (
    <div className="w-full h-screen flex flex-1 p-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="h-full  pr-4">
        <div className="h-full bg-white rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create Entry</h2>
                <p className="text-blue-100 text-sm">
                  Share your location experience
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 h-[calc(100%-120px)] overflow-y-auto">
            {/* Location Display */}
            {locationName && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Selected Location
                    </p>
                    <p className="text-sm text-green-700">{locationName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Description Input with Gemini Button */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your experience..."
                  rows={4}
                  className="w-full px-4 py-3 pr-14 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                />
                <button
                  onClick={handleGeminiClick}
                  className="absolute right-3 top-3 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  title="Generate with Gemini AI"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Image className="w-4 h-4" />
                Photos
              </label>

              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Drop photos here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
              Create Entry
            </button>
          </div>
        </div>
      </div>

      <div className=" w-full h-full rounded-md">
        <MapContainer
          center={position}
          zoom={13}
          className="w-full h-full rounded-2xl shadow-2xl border border-white/20"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarkerOnClick
            markerLocation={markerLocation}
            setMarkerLocation={setMarkerLocation}
            setLocationName={setLocationName}
            setIsLoading={setIsLoading}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default AddEntry;
