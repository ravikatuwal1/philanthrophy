import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default model("Post", postSchema);
