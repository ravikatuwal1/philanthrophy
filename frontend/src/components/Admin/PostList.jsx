import React from "react";
import API from "../../api";

const PostList = ({ posts, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await API.delete(`/posts/admin/${id}`);
    onDelete();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">All Posts</h2>
      {posts.map((post) => (
        <div
          key={post._id}
          className="border p-2 mb-2 flex justify-between items-center rounded"
        >
          <span>{post.title}</span>
          <div>
            <button
              onClick={() => onEdit(post)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
