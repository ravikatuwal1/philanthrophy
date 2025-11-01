import React, { useState, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

const LikeButton = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const liked = user ? likes.map(l => l.toString()).includes(user._id) : false;

  const toggle = async () => {
    if (!user) return alert("Login to like posts");
    const res = await API.post(`/posts/${post._id}/like`);
    setLikes(res.data.likes);
  };

  return <button onClick={toggle}>{liked ? "❤️" : "🤍"} {likes.length}</button>;
};

export default LikeButton;
