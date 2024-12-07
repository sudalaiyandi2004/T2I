import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: ["https://t2-i-frontend.vercel.app/"],
  })
);

app.use(bodyParser.json());

// Hugging Face API details
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

app.post("/api/generate-image", async (req, res) => {
  const { inputs } = req.body;

  if (!inputs) {
    return res.status(400).send("Prompt is required.");
  }

  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image from Hugging Face API.");
    }

    const imageBlob = await response.buffer();
    res.set("Content-Type", "image/jpeg");
    res.send(imageBlob);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred while generating the image.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
