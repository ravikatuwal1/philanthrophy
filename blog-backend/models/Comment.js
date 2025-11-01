import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

export default model("Comment", commentSchema);
