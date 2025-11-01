import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // filters
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // pagination
  const pageSize = 15;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/gallery/events")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sorted);
        setFiltered(sorted);
      })
      .catch(console.error);
  }, []);

  // filter by month/year whenever these change
  useEffect(() => {
    let list = events;
    if (month || year) {
      list = events.filter((ev) => {
        const d = new Date(ev.date);
        const m = ("0" + (d.getMonth() + 1)).slice(-2);
        const y = d.getFullYear().toString();
        const matchMonth = month ? m === month : true;
        const matchYear = year ? y === year : true;
        return matchMonth && matchYear;
      });
    }
    setFiltered(list);
    setPage(1); // reset page on filter change
  }, [month, year, events]);

  // derive page count and current slice
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const currentPageData = filtered.slice(start, start + pageSize);

  // data for selects
  const allYears = Array.from(
    new Set(events.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  return (
    <div className="container py-5 gallery-page">
      <h2 className="gallery-heading text-center mb-3">Events Photo Gallery</h2>
      <p className="text-center text-muted mb-4">
        Photos and moments from Satsang functions
      </p>

      {/* ----- Filter Bar ----- */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-5 flex-wrap">
        <select
          className="form-select w-auto"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {(month || year) && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setMonth("");
              setYear("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ----- Gallery Cards ----- */}
      <div className="row g-4">
        {currentPageData.length === 0 && (
          <p className="text-center text-muted">No events found</p>
        )}
        {currentPageData.map((ev) => (
          <div key={ev.id} className="col-md-4 col-sm-6">
            <div className="gallery-card shadow-sm h-100">
              <img
                src={`http://localhost:5000${ev.cover}`}
                alt={ev.title}
                className="img-fluid rounded-top"
              />
              <div className="p-3">
                <h5 className="fw-bold">{ev.title}</h5>
                <small className="text-muted d-block mb-2">
                  {new Date(ev.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long"
                  })}
                </small>
                <p className="small text-secondary">{ev.description}</p>
                <Link
                  to={`/gallery/${ev.id}`}
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  View Gallery →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ----- Pagination Controls ----- */}
      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`btn btn-sm ${
                num === page
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}