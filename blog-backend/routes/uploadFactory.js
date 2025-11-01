import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Creates a router for uploading to a specific folder+URL.
 * @param {string} folderRelative e.g. "../public/bloguploads"
 * @param {string} urlBase e.g. "/bloguploads"
 */
export function createUploader(folderRelative, urlBase) {
  const router = express.Router();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadPath = path.join(__dirname, folderRelative);

  const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      const safe = file.originalname.replace(/\s+/g, "_");
      cb(null, Date.now() + "-" + safe);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

  router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file" });
    res.json({ url: `${urlBase}/${req.file.filename}` });
  });

  return router;
}