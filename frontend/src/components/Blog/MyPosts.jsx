import React, { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";
import SubmitPost from "./SubmitPost";

function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/my/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Blog Posts</h3>
      {posts.length === 0 ? (
        <p>No posts submitted yet.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5>{post.title}</h5>
                  <p>{post.summary}</p>
                  <p>
                    Status:{" "}
                    <span className={post.approved ? "text-success" : "text-warning"}>
                      {post.approved ? "Approved" : "Pending Approval"}
                    </span>
                  </p>
                  <Link to={`/blog/${post._id}`} className="btn btn-outline-primary btn-sm">
                  View
                </Link>
                <Link to={`/submit-post/${post._id}`} className="btn btn-outline-secondary btn-sm ms-2">
                  Edit
                </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPosts;
