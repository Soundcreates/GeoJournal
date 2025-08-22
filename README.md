

[![wakatime](https://wakatime.com/badge/user/8e9eed09-5e3e-487a-80d6-aa372159ea08/project/2f15f2e2-3c6d-4345-9cef-fc9066dbb71b.svg)](https://wakatime.com/badge/user/8e9eed09-5e3e-487a-80d6-aa372159ea08/project/2f15f2e2-3c6d-4345-9cef-fc9066dbb71b)

# 🌍 AI-Powered GeoJournal  

An interactive journaling web application that lets users **pin journal entries to locations on a map**, enriched with **AI-generated captions/summaries**. Built with the **MERN stack**, **react-leaflet**, and **OpenAI API**.

---

## 🚀 Features  
- 🗺️ **Interactive Map** – Pin journal entries to real-world locations using `react-leaflet`.  
- 🤖 **AI-Powered Captions** – Automatically generate summaries, moods, or creative captions for entries.  
- 📍 **Geo-Tagged Data** – Store entries with latitude/longitude in MongoDB using **geospatial queries**.  
- 🔍 **Search Nearby** – Find past entries near your current location.  
- 🔐 **Authentication** – Secure login & signup with JWT.  
- 📱 **Responsive UI** – Mobile-first design for journaling on the go.  
- 💬 **(Future)** Real-time chat between users for shared locations/events.  

---

## 🏗️ Tech Stack  

### Frontend  
- ⚛️ React + Vite  
- 🗺️ [react-leaflet](https://react-leaflet.js.org/) – Maps & location markers  
- 🎨 Tailwind CSS – Styling  
- 📡 Axios – API requests  


### Backend  
- 🟢 Node.js + Express  
- 🍃 MongoDB with Mongoose (geospatial queries for location-based search)  
- 🔑 JSON Web Tokens (JWT) for authentication  
- 🤖 Gemini API for AI-generated text  

---

---

## ⚙️ Installation  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/yourusername/geojournal.git
cd geojournal
```
### Setup backend
```bash
cd backend
npm install

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000

npm start

```

###Setup frontend

```bash
cd frontend
npm install
npm run dev



