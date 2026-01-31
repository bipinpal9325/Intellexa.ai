import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateBlogTitle = async (req, res) => {
  try {
    const { category, topic } = req.body;

    console.log("Request body:", req.body);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }

    if (!category || !topic) {
      return res.status(400).json({
        success: false,
        message: "Category and topic are required",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ MATCHING GOOGLE AI STUDIO MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    const prompt = `
Generate 5 SEO-friendly blog titles.
Category: ${category}
Topic: ${topic}
Return only the titles as a numbered list.
`;

    const result = await model.generateContent(prompt);

    const text =
      result?.response?.text?.() || "No titles generated";

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("🔥 Gemini Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
