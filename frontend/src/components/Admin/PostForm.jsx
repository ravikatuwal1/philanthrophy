import React, { useState, useEffect } from "react";
import API from "../../api";

const PostForm = ({ editingPost, onPostSaved }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSummary(editingPost.summary);
      setContent(editingPost.content);
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await API.put(`/posts/${editingPost._id}`, { title, summary, content });
      } else {
        await API.post("/posts/submit", { title, summary, content });
      }
      setTitle("");
      setSummary("");
      setContent("");
      onPostSaved();
    } catch (err) {
      alert("Error saving post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">
        {editingPost ? "Edit Post" : "Create New Post"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {editingPost ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
};

export default PostForm;
