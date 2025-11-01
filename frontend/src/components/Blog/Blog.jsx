import React, { useEffect, useState } from "react";
import API from "../../api";
import BlogCard from "./BlogCard";
import './Blog.css'

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container">
      {posts.length === 0 && <p>No posts yet.</p>}
      <div className="blog-masonry">
      {posts.map((p) => <BlogCard key={p._id} post={p} />)}
       </div>
    </div>
  );
};

export default Blog;
