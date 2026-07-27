import express from "express";
import { generateArticle, generateBlogTitles, generateImage, removeBackground, saveLocalCreation } from "../controllers/aiController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-titles', auth, generateBlogTitles);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-background', auth, upload.single('image'), removeBackground);
aiRouter.post('/save-local-creation', auth, upload.single('image'), saveLocalCreation);

export default aiRouter;