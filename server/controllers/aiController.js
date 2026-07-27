import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { uploadImageBuffer } from "../configs/cloudinary.js";
import { removeBackgroundRemoveBg } from "../configs/removeBg.js";

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
      messages: [{
        role: "user",
        content: prompt,
      }],
      temperature: 0.7,
      max_tokens: length,
      reasoning_effort: "low",
    });

    const content = response.choices[0].message.content;

    // Persisting the creation and bumping usage are secondary to actually
    // returning the generated article. Wrap them separately so a DB/Clerk
    // hiccup (e.g. stale DATABASE_URL credentials) doesn't turn a
    // successful generation into a failed request.
    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: free_usage + 1
          }
        });
      } catch (usageError) {
        console.error("Failed to update free_usage metadata:", usageError.message);
      }
    }

    // Echo the prompt back so the client/Postman can confirm what was sent
    res.json({ success: true, prompt, content });

  } catch (error) {
    console.error(error);

    // The openai SDK exposes the real HTTP status on error.status even when
    // talking to Groq's OpenAI-compatible endpoint
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
      messages: [{
        role: "user",
        content: prompt,
      }],
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

    // Same pattern as generateArticle: persistence/usage-tracking failures
    // shouldn't block the already-generated titles from reaching the user.
    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
    } catch (dbError) {
      console.error("Failed to save creation to DB:", dbError.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: free_usage + 1
          }
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

    // Fold the chosen style into the actual prompt sent to the image model
    const fullPrompt = `${prompt}, ${style || 'Realistic'} style, high quality, detailed`;

    // Pollinations.ai — free, no API key. A random seed avoids getting a
    // cached/identical image back for a repeated prompt.
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

    // Upload to Cloudinary for a permanent, shareable URL — Pollinations'
    // own URLs aren't guaranteed to be stable/cacheable long-term.
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
          privateMetadata: {
            free_usage: free_usage + 1
          }
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

    // req.file.buffer comes from multer's memory storage (see middlewares/multer.js)
    const processedBuffer = await removeBackgroundRemoveBg(req.file.buffer);

    // Cloudinary hosts the result (a transparent PNG) at a permanent URL
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
          privateMetadata: {
            free_usage: free_usage + 1
          }
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

// Saves a result that was already processed CLIENT-SIDE (e.g. by
// @imgly/background-removal running in the browser) into the creations
// table. Unlike removeBackground, this does NOT call any external AI API —
// the heavy processing already happened on the user's device — so it does
// NOT count against free_usage, since no paid/metered resource was consumed.
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
      // Still return success — the user's processed image and its Cloudinary
      // URL are valid even if the history row failed to save.
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