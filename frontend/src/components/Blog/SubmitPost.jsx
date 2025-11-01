import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import QuillEditor from "./QuillEditor";

export default function SubmitPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { postId } = useParams();
  const editing = Boolean(postId);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    let alive = true;
    setError('');

    (async () => {
      try {
        const { data } = await API.get(`/posts/${postId}`);
        if (!alive) return;
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setContent(data.content || "");
      } catch (err) {
        if (err.response?.status === 403) {
          try {
            const { data } = await API.get(`/posts/mine/${postId}`);
            if (!alive) return;
            setTitle(data.title || "");
            setSummary(data.summary || "");
            setContent(data.content || "");
          } catch (e2) {
            if (!alive) return;
            setError(e2.response?.data?.message || "Failed to load post");
          }
        } else {
          if (!alive) return;
          setError(err.response?.data?.message || "Failed to load post");
        }
      }
    })();

    return () => { alive = false; };
  }, [editing, postId]);

  if (!user) return <div className="container mt-4">Login required to submit posts.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await API.put(`/posts/${postId}`, { title, summary, content });
      } else {
        await API.post("/posts/submit", { title, summary, content });
      }
      navigate("/my-posts");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h3>{editing ? "Edit Post" : "Submit a New Blog Post"}</h3>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Summary</label>
          <input className="form-control" value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Content</label>
          <QuillEditor value={content} onChange={setContent} />
        </div>
        <button type="submit" className="btn btn-success">
          {editing ? "Save Changes" : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}