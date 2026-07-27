const REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg";

if (!process.env.REMOVE_BG_API_KEY) {
  console.warn(
    "REMOVE_BG_API_KEY is not set — background removal will fail. " +
    "Get a free key at remove.bg/api (no card required, ~50 free calls/month), " +
    "add it to .env, and restart the server."
  );
}

export async function removeBackgroundRemoveBg(imageBuffer) {
  const formData = new FormData();
  formData.append("image_file", new Blob([imageBuffer]), "image.png");
  formData.append("size", "auto");

  const response = await fetch(REMOVE_BG_URL, {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errBody = await response.json();
      message = errBody?.errors?.[0]?.title || message;
    } catch {
      // Body wasn't JSON — fall back to statusText
    }

    const err = new Error(`remove.bg request failed: ${message}`);
    err.status = response.status;
    throw err;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}