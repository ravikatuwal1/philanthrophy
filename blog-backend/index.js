import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';

//be removed
import galleryRoutes from "./routes/gallery.js";
import uploadRoutes from "./routes/upload.js";


import uploadBlogRouter from "./routes/uploadBlog.js";
import uploadGalleryRouter from "./routes/uploadGallery.js";
import uploadPublicationRouter from "./routes/uploadPublication.js";

const app = express();
connectDB();

// --- Middleware
app.use(cors()); // optionally specify origin in production
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Serve static assets
app.use(express.static("public"));

// --- Upload routes
app.use("/api/upload/blog", uploadBlogRouter);
app.use("/api/upload/gallery", uploadGalleryRouter);
app.use("/api/upload/publication", uploadPublicationRouter);

// routes for blog API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


// routes for gallery
app.use("/api/gallery", galleryRoutes);

//routes for image upload (to be removed)
app.use("/api/upload", uploadRoutes);

// generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
