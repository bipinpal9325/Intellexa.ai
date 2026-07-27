import multer from "multer";

// Memory storage — the file arrives as a Buffer on req.file.buffer, never
// written to disk. This matches the Cloudinary upload pattern already used
// in generateImage (uploadImageBuffer), so the same helper can be reused.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap
  fileFilter,
});

export default upload;