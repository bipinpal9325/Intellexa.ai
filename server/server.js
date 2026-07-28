import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // makes req.auth() available — does NOT reject anything itself

app.get("/", (req, res) => res.send("Server is Live!"));

// requireAuth() removed — your custom `auth` middleware (applied per-route
// inside aiRouter) is the single, sufficient gate. It already checks for
// userId and returns a proper JSON error if missing.
app.use("/api/ai", aiRouter);

// Global error handler — MUST be registered after all routes/routers above.
// Without this, any thrown/unhandled error in a route handler produces a
// bare, contentless 500 with nothing printed to this terminal. This makes
// the real error visible both here (for debugging) and in the response
// (for the frontend's toast messages to actually be meaningful).
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});