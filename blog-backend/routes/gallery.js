import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct path resolution
const filePath = path.join(__dirname, "../data/gallery.json");

/* Get all events */
router.get("/events", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data.events);
  } catch (err) {
    console.error("Error reading gallery data:", err);
    res.status(500).json({ message: "Failed to read gallery data" });
  }
});

/* Get one event by ID */
router.get("/events/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const event = data.events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    console.error("Error reading gallery by ID:", err);
    res.status(500).json({ message: "Error reading gallery" });
  }
});

export default router;