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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});