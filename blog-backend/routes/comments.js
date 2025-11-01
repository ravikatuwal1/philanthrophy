import { Router } from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = Router();

// POST /api/comments/:postId - add comment
router.post("/:postId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ msg: "Comment cannot be empty" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = new Comment({
      postId: req.params.postId,
      author: req.user.id,
      content,
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    // return the populated comment
    const populated = await Comment.findById(comment._id)
      .populate("author", "name username");
    
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE /api/comments/:id - author or admin
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const post = await Post.findById(comment.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const isAuthor = comment.author.toString() === req.user.id;
    if (!isAuthor && !req.user.isAdmin) return res.status(403).json({ msg: "Not authorized" });

    post.comments = post.comments.filter(c => c.toString() !== comment._id.toString());
    await post.save();
    await comment.deleteOne();

    res.json({ msg: "Comment removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
