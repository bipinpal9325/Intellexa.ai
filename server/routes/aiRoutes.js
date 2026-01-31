import express from "express";
import { generateBlogTitle } from "../controllers/aiController.js";

const router = express.Router();

router.post("/blog-titles", generateBlogTitle);

export default router;
