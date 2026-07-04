import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  let ai: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  };

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const aiClient = getAiClient();
      
      const chat = aiClient.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are an intelligent AI assistant for HRSync, a Human Resource Management System. You help employees and HR admins with their queries regarding HR policies, payroll, attendance, leave management, and navigating the HRSync platform. Be helpful, concise, and professional.",
        },
      });

      // Simple implementation: send the current message.
      // For proper chat, you'd want to populate the history when creating the chat or concatenate context.
      const prompt = history && history.length > 0 
        ? `Previous conversation context:\n${history.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\nUser query: ${message}`
        : message;

      const response = await chat.sendMessage({ message: prompt });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
