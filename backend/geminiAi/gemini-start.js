const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function geminiModel(locationName, title) {
  console.log("gemini model has been summoned!");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a personal journaling assistant.

Based on the title and location provided, write a first-person journal entry that sounds exactly like something the user would write themselves. The tone, mood, and writing style should feel authentic and match the user's emotional state or atmosphere implied by the title or context.

---

📝 Title: ${title}

📍 Location: ${locationName}

---

Write a natural, expressive journal entry in the first person. Reflect on the place, what the user might have seen or felt, and bring out the mood.

Make it feel raw, personal, and like it came straight from someone's mind. Don't be overly formal. Include thoughts, feelings, sensory details, and stream-of-consciousness narration if appropriate.
`,
    maxOutputTokens: 100,
    temperature: 0.7,
  });
  return { data: response.text };
}

module.exports = geminiModel;