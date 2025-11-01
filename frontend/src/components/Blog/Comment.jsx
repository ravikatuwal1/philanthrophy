import React from "react";

const Comment = ({ comment }) => (
  <div style={{borderLeft:"2px solid #ccc", paddingLeft:8, marginTop:8}}>
    <strong>{comment.author?.name || "User"}</strong>
    <div>{comment.content}</div>
    <small>{new Date(comment.date).toLocaleString()}</small>
  </div>
);

export default Comment;
