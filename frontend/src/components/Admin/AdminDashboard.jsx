import React, { useEffect, useState, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setErr("");
    try {
      const [{ data: pending }, { data: approved }] = await Promise.all([
        API.get("/posts/admin", { params: { status: "pending" } }),
        API.get("/posts/admin", { params: { status: "approved" } }),
      ]);
      setPendingPosts(pending);
      setApprovedPosts(approved);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchPosts();
  }, [user]);

  const approvePost = async (id) => {
    await API.put(`/posts/admin/${id}/approve`);
    // Optimistic move from pending -> approved
    setPendingPosts(list => list.filter(p => p._id !== id));
    // Optionally refetch or append:
    await fetchPosts();
  };

  const deletePost = async (id) => {
    await API.delete(`/posts/admin/${id}`);
    setPendingPosts(list => list.filter(p => p._id !== id));
    setApprovedPosts(list => list.filter(p => p._id !== id));
  };

  if (!user?.isAdmin) return <div className="container mt-4">Access denied.</div>;
  if (loading) return <div className="container mt-4">Loading…</div>;
  if (err) return <div className="container mt-4 text-danger">{err}</div>;

  return (
    <div className="container mt-4">
      <h3>Admin Dashboard</h3>

      <section className="mt-4">
        <h5>Pending Approval</h5>
        {pendingPosts.length === 0 ? (
          <p>No pending posts.</p>
        ) : (
          pendingPosts.map((post) => (
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
          ))
        )}
      </section>

      <hr />

      <section>
        <h5>Approved Posts</h5>
        {approvedPosts.length === 0 ? (
          <p>No approved posts yet.</p>
        ) : (
          approvedPosts.map((post) => (
            <div key={post._id} className="border p-3 mb-2 rounded">
              <h6>{post.title}</h6>
              <p className="text-muted">{post.summary}</p>
              <button className="btn btn-danger btn-sm" onClick={() => deletePost(post._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;