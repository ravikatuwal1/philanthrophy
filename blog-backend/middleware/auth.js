import jwt from "jsonwebtoken";
const { verify, sign } = jwt;
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const header = req.header("Authorization");
  const token = header && header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Attach useful user info
    req.user = { id: user._id.toString(), isAdmin: user.isAdmin };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
