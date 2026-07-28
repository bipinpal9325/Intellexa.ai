import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { uploadImageBuffer } from "../configs/cloudinary.js";
import { removeBackgroundRemoveBg } from "../configs/removeBg.js";
import { removeObjectGemini } from "../configs/geminiInpaint.js";
import { removeObjectIOPaint } from "../configs/iopaint.js";

const ai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, length } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const response = await ai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
      reasoning_effort: "low",
    });

    const content = response.choices[0].message.content;

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    res.json({ success: true, prompt, content });

  } catch (error) {
    console.error(error);
    const upstreamStatus = error?.status || error?.response?.status;

    if (upstreamStatus === 429) {
      return res.status(429).json({
        success: false,
        message: "The AI service is rate-limited right now (Groq free-tier quota). Please wait a bit and try again.",
      });
    }

    if (error?.error?.code === "model_decommissioned" || error?.code === "model_decommissioned") {
      return res.status(503).json({
        success: false,
        message: "The configured AI model has been retired by the provider. Please update the model name in aiController.js — check console.groq.com/docs/models for a current one.",
      });
    }

    res.status(upstreamStatus || 500).json({
      success: false,
      message: error.message || "Something went wrong while generating the article.",
    });
  }
};

export const generateBlogTitles = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { keyword, category } = req.body;

    if (!keyword || keyword.trim().length === 0) {
      return res.json({ success: false, message: "Keyword is required" });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const prompt = `Generate 5 catchy, SEO-friendly blog title ideas for the keyword "${keyword}" in the "${category || 'General'}" category. Return only the 5 titles as a numbered list, with no extra commentary before or after.`;

    const response = await ai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
      reasoning_effort: "low",
    });

    const content = response.choices[0].message.content;

    if (!content || content.trim().length === 0) {
      console.error("Groq returned empty content for blog titles. Full response:", JSON.stringify(response, null, 2));
      return res.status(502).json({
        success: false,
        message: "The AI model returned an empty response. Please try again.",
      });
    }

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    res.json({ success: true, keyword, category, content });

  } catch (error) {
    console.error(error);
    const upstreamStatus = error?.status || error?.response?.status;

    if (upstreamStatus === 429) {
      return res.status(429).json({
        success: false,
        message: "The AI service is rate-limited right now (Groq free-tier quota). Please wait a bit and try again.",
      });
    }

    if (error?.error?.code === "model_decommissioned" || error?.code === "model_decommissioned") {
      return res.status(503).json({
        success: false,
        message: "The configured AI model has been retired by the provider. Please update the model name in aiController.js — check console.groq.com/docs/models for a current one.",
      });
    }

    res.status(upstreamStatus || 500).json({
      success: false,
      message: error.message || "Something went wrong while generating blog titles.",
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, style, publish } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.json({ success: false, message: "A description is required" });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const fullPrompt = `${prompt}, ${style || 'Realistic'} style, high quality, detailed`;

    const seed = Math.floor(Math.random() * 1_000_000);
    const pollinationsUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}` +
      `?width=1024&height=1024&nologo=true&seed=${seed}`;

    const imageResponse = await fetch(pollinationsUrl);

    if (!imageResponse.ok) {
      const err = new Error(`Image generation failed upstream (${imageResponse.status})`);
      err.status = imageResponse.status;
      throw err;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadImageBuffer(imageBuffer);
    const content = uploadResult.secure_url;

    const isPublished = Boolean(publish);

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type, is_published)
        VALUES (${userId}, ${fullPrompt}, ${content}, 'image', ${isPublished})`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    res.json({ success: true, prompt: fullPrompt, content });

  } catch (error) {
    console.error(error);
    const upstreamStatus = error?.status || error?.response?.status;

    if (upstreamStatus === 429) {
      return res.status(429).json({
        success: false,
        message: "The image service is rate-limited right now. Please wait a bit and try again.",
      });
    }

    res.status(upstreamStatus || 500).json({
      success: false,
      message: error.message || "Something went wrong while generating the image.",
    });
  }
};

export const removeBackground = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;

    if (!req.file) {
      return res.json({ success: false, message: "An image file is required" });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const processedBuffer = await removeBackgroundRemoveBg(req.file.buffer);
    const uploadResult = await uploadImageBuffer(processedBuffer);
    const content = uploadResult.secure_url;
    const prompt = "Remove background from uploaded image";

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'background-removal')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error(error);
    const upstreamStatus = error?.status || error?.response?.status;

    if (upstreamStatus === 429) {
      return res.status(429).json({
        success: false,
        message: "The background-removal service is rate-limited right now. Please wait a bit and try again.",
      });
    }

    if (upstreamStatus === 503) {
      return res.status(503).json({
        success: false,
        message: error.message || "The background-removal model is warming up. Please try again in a few seconds.",
      });
    }

    if (upstreamStatus === 402) {
      return res.status(402).json({
        success: false,
        message: "The background-removal service's free monthly credits have run out. Check your remove.bg account or wait for the next billing cycle.",
      });
    }

    res.status(upstreamStatus || 500).json({
      success: false,
      message: error.message || "Something went wrong while removing the background.",
    });
  }
};

// Handles BOTH modes for object removal:
// - mode 'cloud' -> Gemini 2.5 Flash Image, conversational edit driven by
//   the object description text field
// - mode 'local' -> self-hosted IOPaint server, uses the painted mask
//   directly (unlimited, free, does NOT count against free_usage)
export const removeObject = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const mode = req.body.mode === 'local' ? 'local' : 'cloud';

    const imageFile = req.files?.image?.[0];
    const maskFile = req.files?.mask?.[0];

    if (!imageFile) {
      return res.json({ success: false, message: "An image is required" });
    }

    if (mode === 'local' && !maskFile) {
      return res.json({ success: false, message: "Local mode requires a painted mask" });
    }

    if (mode === 'cloud' && plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const processedBuffer = mode === 'local'
      ? await removeObjectIOPaint(imageFile.buffer, maskFile.buffer)
      : await removeObjectGemini(imageFile.buffer, imageFile.mimetype, req.body.object);

    const uploadResult = await uploadImageBuffer(processedBuffer);
    const content = uploadResult.secure_url;

    const prompt = req.body.object
      ? `Remove object: ${req.body.object}`
      : `Remove painted object (${mode} mode)`;

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'object-removal')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (mode === 'cloud' && plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    res.json({ success: true, content, mode });

  } catch (error) {
    console.error(error);
    const { mode } = req.body;
    const upstreamStatus = error?.status || error?.response?.status;

    if (upstreamStatus === 429) {
      return res.status(429).json({
        success: false,
        message: "The service is rate-limited right now. Please wait a bit and try again.",
      });
    }

    if (upstreamStatus === 503) {
      const fallbackMessage = mode === 'local'
        ? "Local IOPaint server isn't reachable. Make sure it's running."
        : "Gemini's service is temporarily overloaded. Please try again in a moment.";

      return res.status(503).json({
        success: false,
        message: error.message || fallbackMessage,
      });
    }

    if (upstreamStatus === 502) {
      return res.status(502).json({
        success: false,
        message: error.message || "The AI model couldn't process this request. Try a more specific description.",
      });
    }

    res.status(upstreamStatus || 500).json({
      success: false,
      message: error.message || "Something went wrong while removing the object.",
    });
  }
};

export const saveLocalCreation = async (req, res) => {
  try {
    const { userId } = req;
    const { type = 'background-removal', prompt = 'Processed locally in browser' } = req.body;

    if (!req.file) {
      return res.json({ success: false, message: "A processed image file is required" });
    }

    const uploadResult = await uploadImageBuffer(req.file.buffer);
    const content = uploadResult.secure_url;

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, ${type})`;
    } catch (dbError) {
      console.error("Failed to save local creation to DB:", dbError.message);
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while saving the processed image.",
    });
  }
};