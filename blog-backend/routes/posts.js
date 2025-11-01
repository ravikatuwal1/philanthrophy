import jwt from "jsonwebtoken";
import { Router } from "express";
const router = Router();
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

// Small helper
const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ msg: "Admin only" });
  next();
};

const optionalAuth = async (req, res, next) => {
  const header = req.header('Authorization') || req.header('authorization');
  if (!header) return next();
  try {
    const token = header.replace(/^Bearer\s+/i, '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId =
      decoded?.id ||
      decoded?.userId ||
      decoded?._id ||
      decoded?.user?.id ||
      decoded?.sub;

    if (userId) {
      const user = await User.findById(userId).select('_id isAdmin');
      if (user) req.user = { id: String(user._id), isAdmin: user.isAdmin };
    }
  } catch (e) {
    // ignore invalid tokens so public access still works
  }
  next();
};

/**
 * PUBLIC
 * GET /api/posts
 * Returns only approved posts
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // 0 = no paging (return all)
    const limit = parseInt(req.query.limit) || 0;
    const query = { approved: true };

    const base = Post.find(query)
      .populate("author", "name username")
      .sort({ date: -1, createdAt: -1 });

    if (page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        base.skip(skip).limit(limit),
        Post.countDocuments(query),
      ]);
      return res.json({
        items,
        total,
        page,
        pageSize: limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });
    }

    const items = await base;
    return res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * USER
 * GET /api/posts/my/posts
 * Returns the authenticated user's posts (approved and pending)
 */
router.get("/my/posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN (preferred)
 * GET /api/posts/admin?status=pending|approved|all
 * Returns posts filtered by status for admins
 */
router.get("/admin", auth, adminOnly, async (req, res) => {
  try {
    const { status = "all" } = req.query;
    let query = {};
    if (status === "pending") query.approved = false;
    else if (status === "approved") query.approved = true;

    const posts = await Post.find(query)
      .populate("author", "name username")
      .sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN (backward compat)
 * GET /api/posts/all
 * Admin only: get all posts
 */
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username")
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN
 * PUT /api/posts/admin/:id/approve
 * Approve a post
 */
router.put("/admin/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN
 * PUT /api/posts/admin/:id
 * Update any post (admin). You can optionally pass approved in body.
 */
router.put("/admin/:id", auth, adminOnly, async (req, res) => {
  try {
    const { title, summary, content, approved } = req.body;
    const update = {};
    if (title != null) update.title = title;
    if (summary != null) update.summary = summary;
    if (content != null) update.content = content;
    if (approved != null) update.approved = approved;

    const post = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN
 * DELETE /api/posts/admin/:id
 * Delete any post (admin)
 */
router.delete("/admin/:id", auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    await Post.deleteOne({ _id: req.params.id });
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUBLIC/RESTRICTED
// GET /api/posts/:id
// Public if approved; otherwise only author/admin (optional auth)
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name username" },
      });

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.approved) return res.json(post);

    const viewer = req.user; // set by optionalAuth if token provided & valid
    const authorId = String(post.author?._id ?? post.author);

    if (viewer && (viewer.isAdmin || viewer.id === authorId)) {
      return res.json(post);
    }
    return res.status(403).json({ msg: "Not authorized to view this post" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// USER
// GET /api/posts/mine/:id
// Author (or admin) can fetch their own post regardless of approval
router.get("/mine/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name username" },
      });

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const authorId = String(post.author?._id ?? post.author);
    if (req.user.isAdmin || authorId === req.user.id) {
      return res.json(post);
    }
    return res.status(403).json({ msg: "Not authorized" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
/**
 * USER
 * POST /api/posts/submit
 * Authenticated user submits a post (approved = false)
 */
router.post("/submit", auth, async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const post = new Post({
      title,
      summary,
      content,
      author: req.user.id,
      approved: false,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * ADMIN (legacy path)
 * PUT /api/posts/:id/approve
 * Admin approves (kept for compatibility)
 */
router.put("/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    post.approved = true;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * USER/ADMIN
 * PUT /api/posts/:id
 * Edit a post (author or admin)
 * - User edits reset approval to false
 * - Admin edits retain approval (unless explicitly set in body)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ msg: "Not authorized" });

    const { title, summary, content, approved } = req.body;
    if (title != null) post.title = title;
    if (summary != null) post.summary = summary;
    if (content != null) post.content = content;

    if (req.user.isAdmin) {
      if (approved != null) post.approved = approved;
    } else {
      post.approved = false;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * USER/ADMIN
 * DELETE /api/posts/:id
 * Delete a post (author or admin)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ msg: "Not authorized" });
    await Post.deleteOne({ _id: req.params.id });
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * USER
 * POST /api/posts/:id/like
 * Toggle like
 */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const idx = post.likes.findIndex((id) => id.toString() === req.user.id);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;