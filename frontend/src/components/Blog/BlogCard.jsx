import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

const BlogCard = ({ post }) => (
  <div className="blog-card">
    {post.image && <img src={post.image} alt={post.title} className="blog-card-image" />}
    <div className="blog-card-content">
      <h3 className="blog-card-title">{post.title}</h3>
      {post.summary ?<p className="blog-card-summary">{post.summary}</p>: <div> <p> - </p> </div>}
      <small className="blog-card-date">
        {new Date(post.date).toLocaleDateString()}
      </small>
      <div className="blog-card-actions">
        <Link to={`/blog/${post._id}`} className="blog-card-link">
          Read More 
          <span className="blog-card-link-arrow">→</span>
        </Link>
        <LikeButton post={post} />
      </div>
    </div>
  </div>
);

export default BlogCard;