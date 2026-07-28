// Verify the exact model name at ai.google.dev/gemini-api/docs before
// production — model identifiers change periodically.
const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set — Cloud mode object removal will fail. " +
    "Get a key at aistudio.google.com, add it to .env, and restart the server."
  );
}

export async function removeObjectGemini(imageBuffer, mimeType, objectDescription) {
  const base64Image = imageBuffer.toString("base64");

  const instruction = objectDescription
    ? `Remove the ${objectDescription} from this image. Fill the area naturally so it blends seamlessly with the surrounding background. Do not alter anything else in the image.`
    : `Remove the marked/unwanted object from this image and fill the area naturally so it blends with the surrounding background. Do not alter anything else in the image.`;

  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: instruction },
          { inline_data: { mime_type: mimeType, data: base64Image } },
        ],
      }],
    }),
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errBody = await response.json();
      message = errBody?.error?.message || message;
    } catch {
      // Body wasn't JSON — fall back to statusText
    }
    const err = new Error(`Gemini request failed: ${message}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inline_data);

  if (!imagePart) {
    const err = new Error("Gemini did not return an edited image. Try a more specific object description.");
    err.status = 502;
    throw err;
  }

  return Buffer.from(imagePart.inline_data.data, "base64");
}