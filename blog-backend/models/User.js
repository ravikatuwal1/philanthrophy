import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: false, unique: true }, // added
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true });

export default model("User", userSchema);
