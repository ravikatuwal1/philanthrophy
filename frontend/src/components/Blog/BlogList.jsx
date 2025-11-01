import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import Button from "../Buttons/Buttons";
import './BlogList.css'

function getDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(+dt) ? "" : dt.toLocaleDateString();
}

function sortByDateDesc(arr) {
  return [...arr].sort((a, b) => {
    const ad = new Date(a.date || a.createdAt || 0);
    const bd = new Date(b.date || b.createdAt || 0);
    return bd - ad;
  });
}

export default function BlogList({
  // Home/front page usage: <BlogList limit={3} showViewAll />
  // Blog page usage: <BlogList paginate pageSize={10} />
  paginate = false,
  pageSize = 10,
  limit = 0,
  showViewAll = false,
  title = "Articles",
}) {
  const [items, setItems] = useState([]);       // raw items from server or sliced
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // paging state (client-side or server meta)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchPosts() {
    setLoading(true);
    setErr("");

    try {
      const params = {};
      // Try server-side pagination/limit if supported by backend
      if (paginate) { params.page = page; params.limit = pageSize; }
      else if (limit) { params.limit = limit; }

      const { data } = await API.get("/posts", { params });

      if (Array.isArray(data)) {
        // Server returned full array (didn't paginate) → do client-side slice
        const sorted = sortByDateDesc(data);
        if (paginate) {
          const total = sorted.length;
          const pages = Math.max(1, Math.ceil(total / pageSize));
          setTotalPages(pages);
          const start = (page - 1) * pageSize;
          setItems(sorted.slice(start, start + pageSize));
        } else {
          setItems(limit ? sorted.slice(0, limit) : sorted);
          setTotalPages(1);
        }
      } else {
        // Server returned paginated/meta shape: { items, totalPages, ... }
        const sorted = sortByDateDesc(data.items || []);
        setItems(sorted);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, paginate, pageSize, limit]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="container blog-container mt-5">
      <h2 className="text-center mb-4">{title}</h2>

      {loading && <p>Loading…</p>}
      {err && <p className="text-danger">{err}</p>}

      {!loading && !err && (
        <>
          <div className="row">
            {items.map((post) => {
              const authorName =
                post.author?.name || post.author?.username || "Unknown";
              const dateStr = getDate(post.date || post.createdAt);
              const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;

              return (
                <div key={post._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow rounded-4">
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      {post.summary ? (
                        <p className="card-text">{post.summary}</p>
                      ) : (
                        <p className="text-muted mb-2">-</p>
                      )}

                      <div className="text-muted small mb-2">
                        By <strong>{authorName}</strong>
                        {dateStr ? <> • {dateStr}</> : null}
                        <> • {likeCount} {likeCount === 1 ? "like" : "likes"}</>
                      </div>

                      <Link
                        to={`/blog/${post._id}`}
                        className="btn btn-outline-primary btn-sm read-more"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showViewAll && limit > 0 && (
            <div className="text-center mt-3">
              <Button to="/blog" variant="primary" className="px-4" icon="arrow-right-circle">
                Read All Articles
              </Button>
            </div>
          )}

          {paginate && totalPages > 1 && (
            <div className="d-flex justify-content-center my-3 gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={!canPrev}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="align-self-center small">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}