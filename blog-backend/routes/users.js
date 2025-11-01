import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";
const { genSalt, hash, compare } = bcrypt;
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import User from "../models/User.js";
import auth from "../middleware/auth.js";

// Register
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Please provide name, username, email and password" });
  }
  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ msg: "Email or username already exists" });

    user = new User({ name, username, email, password });
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Login - accept email OR username
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  // identifier = email or username
  if (!identifier || !password) {
    return res.status(400).json({ msg: "Provide identifier (email or username) and password" });
  }
  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
