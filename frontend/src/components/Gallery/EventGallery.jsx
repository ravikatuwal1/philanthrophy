import React, { useState, useEffect, useRef } from "react";
import "./Gallery.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function EventGallery({ eventId }) {
  const [event, setEvent] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const carouselRef = useRef();

  useEffect(() => {
    fetch(`/api/gallery/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error(err));
  }, [eventId]);

  useEffect(() => {
    if (!carouselRef.current) return;
    const bs = window.bootstrap;
    if (bs?.Carousel) {
      const c = new bs.Carousel(carouselRef.current, {
        interval: false,
        ride: false,
        wrap: true,
      });
      c.to(slideIndex);
    }
  }, [slideIndex]);

  if (!event)
    return <div className="text-center py-5">Loading event gallery…</div>;

  return (
    <div className="container py-5">
      <h2 className="gallery-heading text-center mb-5">
        {event.title}
      </h2>

      <div className="row">
        {event.images.map((img, i) => (
          <div key={i} className="col-lg-4 col-md-6 mb-4">
            <img
              src={img}
              alt=""
              className="img-fluid rounded shadow-sm gallery-img"
              data-bs-toggle="modal"
              data-bs-target="#eventModal"
              onClick={() => setSlideIndex(i)}
            />
          </div>
        ))}
      </div>

      <div
        className="modal fade"
        id="eventModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-transparent border-0">
            <div className="modal-body p-0">
              <div
                id="eventCarousel"
                className="carousel slide"
                data-bs-interval="false"
                ref={carouselRef}
              >
                <div className="carousel-inner">
                  {event.images.map((img, i) => (
                    <div
                      key={i}
                      className={`carousel-item ${
                        i === slideIndex ? "active" : ""
                      }`}
                    >
                      <img
                        src={img}
                        className="d-block w-100 rounded"
                        alt=""
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#eventCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#eventCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}