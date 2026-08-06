const CLIPDROP_CLEANUP_URL = "https://clipdrop-api.co/cleanup/v1";

if (!process.env.CLIPDROP_API_KEY) {
  console.warn(
    "CLIPDROP_API_KEY is not set — cloud object removal will fail. " +
    "Get a key at clipdrop.co/apis (free tier available), add it to .env, and restart the server."
  );
}

export async function removeObjectClipdrop(imageBuffer, maskBuffer) {
  const formData = new FormData();
  formData.append("image_file", new Blob([imageBuffer]), "image.png");
  formData.append("mask_file", new Blob([maskBuffer]), "mask.png");

  const response = await fetch(CLIPDROP_CLEANUP_URL, {
    method: "POST",
    headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errBody = await response.json();
      message = errBody?.error || message;
    } catch {}
    const err = new Error(`Clipdrop cleanup request failed: ${message}`);
    err.status = response.status;
    throw err;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}