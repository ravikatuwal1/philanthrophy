import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api';
import { AuthContext } from '../../context/AuthContext';
import SEO from '../common/SEO';

// import DOMPurify from 'dompurify';
async function createCommentAPI({ postId, content, parentId }) {
  // primary attempt: POST /comments with flexible body
  try {
    return await API.post('/comments', {
      postId, post: postId,            // support both keys
      content, text: content,          // support both keys
      parentId, parent: parentId || null
    });
  } catch (err) {
    const status = err.response?.status;
    // fallback if route is defined as POST /comments/:postId
    if (status === 404 || status === 405) {
      return await API.post(`/comments/${postId}`, {
        content, text: content,
        parentId, parent: parentId || null,
      });
    }
    throw err;
  }
} 

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // comment state
  const [newComment, setNewComment] = useState('');
  const [replyFor, setReplyFor] = useState(null); // comment _id currently replying to
  const [replyText, setReplyText] = useState('');

  const isAdmin = !!user?.isAdmin;
  const authorId = useMemo(
    () => (post && (post.author?._id || post.author)) ? String(post.author?._id || post.author) : null,
    [post]
  );
  const isAuthor = !!(user && authorId && String(user._id) === authorId);
  const canEdit = isAdmin || isAuthor;

  // Load post (with author/admin fallback for pending)
  const fetchPost = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      if (err.response?.status === 403) {
        // Author-only fallback
        try {
          const { data } = await API.get(`/posts/mine/${id}`);
          setPost(data);
        } catch (e2) {
          setError(e2.response?.data?.message || 'Failed to load post');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to load post');
      }
    } finally {
      setLoading(false);
    }
  };
{post && <SEO title={post.title} description={post.summary?.slice(0, 150)} />}
  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Like toggle
  const toggleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await API.post(`/posts/${post._id}/like`);
      // Backend returns the post; if it’s not populated we still get likes array
      setPost(prev => ({ ...prev, likes: data.likes ?? prev.likes }));
    } catch (e) {
      console.error('Like failed', e);
    }
  };

  const likedByMe = useMemo(() => {
    if (!post?.likes || !user?._id) return false;
    const myId = String(user._id);
    return post.likes.some((uid) => String(uid) === myId);
  }, [post?.likes, user?._id]);

  // Comments helpers
  // Build a simple tree from flat comments: parent field can be null/undefined or string id
  const commentsTree = useMemo(() => {
    const list = post?.comments || [];
    const byParent = new Map();
    list.forEach((c) => {
      const parentId = String(c.parent || c.parentId || '');
      if (!byParent.has(parentId)) byParent.set(parentId, []);
      byParent.get(parentId).push(c);
    });
    const attach = (parentId = '') =>
      (byParent.get(parentId) || []).map((c) => ({
        ...c,
        replies: attach(String(c._id)),
      }));
    return attach('');
  }, [post]);

  const refreshComments = async () => {
    // Refetch just the post to refresh embedded comments
    await fetchPost();
  };

  // top-level comment
const submitComment = async (e) => {
  e.preventDefault();
  if (!user) return navigate('/login');
  if (!newComment.trim()) return;
  try {
    await createCommentAPI({ postId: post._id, content: newComment.trim(), parentId: null });
    setNewComment('');
    await fetchPost(); // refetch to refresh comments
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to add comment');
  }
};

// reply
const submitReply = async (parentId) => {
  if (!user) return navigate('/login');
  if (!replyText.trim()) return;
  try {
    await createCommentAPI({ postId: post._id, content: replyText.trim(), parentId });
    setReplyText('');
    setReplyFor(null);
    await fetchPost();
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to add reply');
  }
};

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      await refreshComments();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const approve = async () => {
    try {
      await API.put(`/posts/admin/${post._id}/approve`);
      setPost((p) => ({ ...p, approved: true }));
    } catch (e) {
      alert(e.response?.data?.message || 'Approve failed');
    }
  };

  const deletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/admin/${post._id}`);
      navigate('/admin');
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="container mt-4">Loading…</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!post) return null;

  const authorName = post.author?.name || post.author?.username || 'Unknown author';
  const likesCount = post.likes?.length ?? 0;

  // const safeHtml = DOMPurify.sanitize(post.content || '');
  const safeHtml = post.content || '';

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      {/* Title + author */}
      <div className="mb-3">
        <h2 className="mb-1">{post.title}</h2>
        <div className="text-muted">
          By <strong>{authorName}</strong>
        </div>
        {!post.approved && (isAuthor || isAdmin) && (
          <div className="badge bg-warning text-dark mt-2">
            Pending approval — visible only to author and admins
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-3" dangerouslySetInnerHTML={{ __html: safeHtml }} />

      {/* Actions row */}
      <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
        <Link to="/blog" className="btn btn-outline-secondary btn-sm">
          Back to Blogs
        </Link>

        {/* Like */}
        <button className="btn btn-outline-primary btn-sm" onClick={toggleLike}>
          {likedByMe ? 'Unlike' : 'Like'}
        </button>
        <span className="text-muted small">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>

        {/* Edit for author/admin */}
        {canEdit && (
          <Link to={`/submit-post/${post._id}`} className="btn btn-outline-primary btn-sm">
            Edit
          </Link>
        )}

        {/* Admin approve/delete on pending, delete always visible for admin */}
        {isAdmin && !post.approved && (
          <>
            <button className="btn btn-success btn-sm" onClick={approve}>Approve</button>
            <button className="btn btn-danger btn-sm" onClick={deletePost}>Delete</button>
          </>
        )}
        {isAdmin && post.approved && (
          <button className="btn btn-danger btn-sm" onClick={deletePost}>Delete</button>
        )}
      </div>

      {/* Comments */}
      <hr className="my-4" />
      <h5>Comments</h5>

      {!user ? (
        <p className="text-muted">Login to add a comment.</p>
      ) : (
        <form className="mb-3" onSubmit={submitComment}>
          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" type="submit">Post Comment</button>
        </form>
      )}

      <CommentsList
        items={commentsTree}
        currentUser={user}
        onReply={(cid) => { setReplyFor(cid); setReplyText(''); }}
        replyingTo={replyFor}
        replyText={replyText}
        setReplyText={setReplyText}
        submitReply={submitReply}
        onDelete={deleteComment}
      />
    </div>
  );
}

/* Render nested comments */
function CommentsList({
  items,
  currentUser,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  submitReply,
  onDelete,
  level = 0,
}) {
  if (!items?.length) return <p className={level === 0 ? 'text-muted' : ''}>{level === 0 ? 'No comments yet.' : ''}</p>;

  return (
    <div>
      {items.map((c) => {
        const canDelete =
          !!currentUser &&
          (String(c.author?._id || c.author) === String(currentUser._id) || currentUser.isAdmin);

        return (
          <div key={c._id} className="mb-3">
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <div className="small text-muted mb-1">
                  <strong>{c.author?.name || c.author?.username || 'User'}</strong>
                  {c.createdAt && (
                    <> • {new Date(c.createdAt).toLocaleString()}</>
                  )}
                </div>
                <div>{c.content}</div>

                <div className="mt-1 d-flex gap-2">
                  {currentUser && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={() => onReply(c._id)}
                    >
                      Reply
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-danger p-0"
                      onClick={() => onDelete(c._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Reply box */}
                {currentUser && replyingTo === c._id && (
                  <div className="mt-2">
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      placeholder="Write a reply…"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => submitReply(c._id)}
                      >
                        Reply
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onReply(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Children */}
                {c.replies?.length > 0 && (
                  <div className="ms-3 mt-2 border-start ps-3">
                    <CommentsList
                      items={c.replies}
                      currentUser={currentUser}
                      onReply={onReply}
                      replyingTo={replyingTo}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      submitReply={submitReply}
                      onDelete={onDelete}
                      level={level + 1}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}