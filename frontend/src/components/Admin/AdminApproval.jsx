import React, { useEffect, useState, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

const AdminApproval = () => {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await API.get("/posts/admin", { params: { status: "pending" } });
      setPending(data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load pending posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchPending();
  }, [user]);

  const approve = async (id) => {
    try {
      await API.put(`/posts/admin/${id}/approve`);
      setPending(list => list.filter(p => p._id !== id)); // optimistic
    } catch (e) {
      alert(e.response?.data?.message || "Approve failed");
    }
  };

  if (!user?.isAdmin) return <div className="container mt-4">Admin only</div>;
  if (loading) return <div className="container mt-4">Loading…</div>;
  if (err) return <div className="container mt-4 text-danger">{err}</div>;

  return (
    <div className="container mt-4">
      <h3>Admin Approval</h3>
      {pending.length === 0 ? (
        <p>No pending posts</p>
      ) : (
        pending.map(p => (
          <div key={p._id} className="card mb-2">
            <div className="card-body">
              <h5 className="card-title">{p.title}</h5>
              <p className="card-text">{p.summary}</p>
              <button className="btn btn-success btn-sm" onClick={() => approve(p._id)}>
                Approve
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminApproval;