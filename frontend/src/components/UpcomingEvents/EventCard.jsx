import React from "react";
import "./EventCard.css";

const EventCard = ({ title, date, location, image, days }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="col-sm-6 col-md-4 d-flex justify-content-center">
      <div className="event-card card shadow-sm">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body text-center">
          <h5 className="card-title mb-2">{title}</h5>
          <p className="mb-1">
            <i className="bi bi-calendar3 me-2"></i>
            {formattedDate} – {days} {days > 1 ? "Days" : "Day"}
          </p>
          <p>
            <i className="bi bi-geo-fill me-2"></i>
            {location || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
