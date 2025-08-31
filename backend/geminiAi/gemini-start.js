const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config();

// Only initialize AI if API key is present
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
} else {
  console.warn("GEMINI_API_KEY not found. AI features will not be available.");
}

async function geminiModel(locationName, title) {
  if (!ai) {
    // Return a fallback response when AI is not available
    return { 
      data: `I had an amazing time in ${locationName}. ${title} really captures how I feel about this experience. It's been quite a journey exploring this place and creating new memories.` 
    };
  }

  console.log("gemini model has been summoned!");
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `You are a personal journaling assistant.

Based on the title and location provided, write a first-person journal entry that sounds exactly like something the user would write themselves. The tone, mood, and writing style should feel authentic and match the user's emotional state or atmosphere implied by the title or context.

---

📝 Title: ${title}

📍 Location: ${locationName}

---

Write a natural, expressive journal entry in the first person. Reflect on the place, what the user might have seen or felt, and bring out the mood.

Make it feel raw, personal, and like it came straight from someone's mind. Don't be overly formal. Include thoughts, feelings, sensory details, and stream-of-consciousness narration if appropriate.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { data: response.text() };
  } catch (error) {
    console.error("Error generating AI content:", error);
    // Return fallback content on error
    return { 
      data: `I had an amazing time in ${locationName}. ${title} really captures how I feel about this experience. It's been quite a journey exploring this place and creating new memories.` 
    };
  }
}

module.exports = geminiModel;