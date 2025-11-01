import React from "react";
import API from "../../api";

const CommentList = ({ comments, onCommentsUpdated }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    await API.delete(`/comments/${id}`);
    onCommentsUpdated();
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold">Comments</h3>
      {comments.map((c) => (
        <div key={c._id} className="border p-2 mb-2 rounded">
          <strong>{c.author.name}</strong>: {c.content}
          <button
            onClick={() => handleDelete(c._id)}
            className="ml-2 bg-red-500 text-white px-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
