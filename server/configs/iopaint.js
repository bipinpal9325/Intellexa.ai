const IOPAINT_BASE_URL = process.env.IOPAINT_URL || "http://localhost:8080";

export async function removeObjectIOPaint(imageBuffer, maskBuffer) {
  const imageBase64 = imageBuffer.toString("base64");
  const maskBase64 = maskBuffer.toString("base64");

  let response;
  try {
    response = await fetch(`${IOPAINT_BASE_URL}/api/v1/inpaint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageBase64,
        mask: maskBase64,
      }),
    });
  } catch (networkErr) {
    const err = new Error(
      "Could not reach the local IOPaint server. Start it with: iopaint start --model=lama --device=cpu --port=8080"
    );
    err.status = 503;
    throw err;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errBody = contentType.includes("application/json")
        ? await response.json()
        : { detail: await response.text() };
      message = errBody?.detail || JSON.stringify(errBody) || message;
    } catch {
      // Body wasn't parseable — fall back to statusText
    }
    const err = new Error(`IOPaint request failed (${response.status}): ${message}`);
    err.status = response.status;
    throw err;
  }

  // Handle BOTH possible success formats: raw image bytes, or a JSON
  // envelope containing a base64 string under some field name.
  if (contentType.includes("image/")) {
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  if (contentType.includes("application/json")) {
    const json = await response.json();
    const base64Result = json.image || json.result || json.output || json.data;
    if (!base64Result) {
      console.error("IOPaint returned unexpected JSON shape:", json);
      throw new Error("IOPaint returned a JSON response, but no recognizable image field was found. Check server logs for the actual shape.");
    }
    const cleaned = base64Result.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(cleaned, "base64");
  }

  // Unknown content-type — treat as raw bytes as a last resort, but log
  // clearly so you can see exactly what came back.
  console.warn("IOPaint response had unexpected content-type:", contentType);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}