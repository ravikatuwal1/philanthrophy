import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function AdminApproval() {
  const { user } = useContext(AuthContext);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await API.get("/posts/admin", { params: { status: "pending" } });
      setPendingPosts(data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load pending posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchPending();
  }, [user]);

  const approvePost = async (id) => {
    try {
      await API.put(`/posts/admin/${id}/approve`);
      setPendingPosts(list => list.filter(p => p._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Approve failed");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/admin/${id}`);
      setPendingPosts(list => list.filter(p => p._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  if (!user?.isAdmin) return <div className="container mt-4">Admin only</div>;
  if (loading) return <div className="container mt-4">Loading…</div>;
  if (err) return <div className="container mt-4 text-danger">{err}</div>;

  return (
    <div className="container py-3">
      <h1 className="h4 mb-3">Admin Approval</h1>
      {pendingPosts.length === 0 ? (
        <p>No pending posts</p>
      ) : (
        pendingPosts.map((post) => (
          <div key={post._id} className="border p-3 mb-2 rounded">
            <h3 className="h6 mb-1">{post.title}</h3>
            <p className="mb-2 text-muted">{post.summary}</p>
            <div className="d-flex gap-2">
              <Link to={`/blog/${post._id}`} className="btn btn-outline-secondary btn-sm">
                View
              </Link>
              <button className="btn btn-success btn-sm" onClick={() => approvePost(post._id)}>
                Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => deletePost(post._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}