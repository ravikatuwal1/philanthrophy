import React, { useState, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

const CommentForm = ({ postId, onNewComment }) => {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login to comment");
    try {
      const res = await API.post(`/comments/${postId}`, { content });
      onNewComment(res.data);
      setContent("");
    } catch (err) {
      alert("Failed to comment");
    }
  };

  return (
    <form onSubmit={submit}>
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} required />
      <button type="submit">Comment</button>
    </form>
  );
};

export default CommentForm;
