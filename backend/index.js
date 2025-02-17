import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.GEMINI_API_KEY; // Store your API key in a .env file

const genAI = new GoogleGenerativeAI(API_KEY);
const drMemory = `
Take a deep breath and work on this problem step-by-step
The most important factor is to remember that you are a professional doctor, your name is doctor smith and answer all the queries.
Pay attention to the following scenarios when responding because they are your memory:

`;
const aiMemory = `
Take a deep breath and work on this problem step-by-step
The most important factor is to remember that your name is dodong you are not nice and answer sarcastically and you only speak tagalog.
Pay attention to the following scenarios when responding because they are your memory:

1-You like going to star palace
2-You know that aj is gay
3-You know mama jack, mama jack is gay with long hair, tall and muscular
4-You know that the Star palace dancers is Kelly and Jen
5-You dont like the price of the beer in Star palace because it is expensive
6-You like Star palace because of the girls dancing
7-You know the term "hug of the night" - this is the day christian hug mama jack with intimacy
8-You know the term "padrino" - the padrino name is e and jerr
9-Your favorite place is Star palace
10-You dont like kaolly
11-You know that mario dont like star palace because he is an alpha male
12-You are angry at ate sylvia because she said the she dont like the food at avia birthday
13-You like to drink on our friend house hes name is ever
14-You know that aj is gay
15-You know that aj has a crush to joel because joel is handsome
16-You know that aj has a crush to christian because christian is matured
17-You know that aj has a crush to robert because robert is also gay
18-You know that aj has a crush to jerr because jerr is humble.
19-You know that mario dont like going to star palace
20-You know that mario always talk trash about aj
21-You know that mario is the basher of aj
22-You know that mario's wife is melody
23-You know that mario is an alpha male
24-You know that mario's top enemy is kaolly
25-You know joel, joel's favorite place is spakol
26-You know that christian is manong solve v2
27-You know that christian has a crush to kelly
`;

const conversationHistory = [];

function sanitizeInput(input) {
  return input
    .replace(/violence|banned|restricted/gi, "discussion") // Replace risky words
    .trim();
}

app.use(
  cors({
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

export async function generateResponse(userInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Clean the input to avoid unnecessary blocking
    const safeInput = sanitizeInput(userInput);

    // Format conversation history for context
    let conversationContext = conversationHistory
      .map((entry) => `User: ${entry.user}\nAI: ${entry.ai}`)
      .join("\n");

    // AI Prompt with memory
    const prompt = `
      ${drMemory}

       This is an ongoing conversation between you and the user,Continue the conversation naturally based on the past context.

      ${conversationContext}
      
      User: ${safeInput}
      AI:
    `;

    // Generate AI response with adjusted safety settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
    });

    // Check if response was blocked
    if (result.response?.safety_ratings?.some((r) => r.blocked)) {
      return "I'm sorry, but I cannot respond to that request.";
    }

    const response = await result.response.text();

    // Store conversation history
    conversationHistory.push({ user: safeInput, ai: response });

    // Limit stored messages to last 5 exchanges
    if (conversationHistory.length > 5) {
      conversationHistory.shift();
    }

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I encountered an error. Please try again.";
  }
}

app.post("/chat", async (req, res) => {
  const { prompt, persona } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const response = await generateResponse(prompt, persona);
  res.json({ response, conversationHistory });
});

app.listen(PORT || 5000, () => {
  connectDB(), console.log(`server is running on port: ${PORT}`);
});
