import React from "react";
import "./UpcomingEvents.css";
import EventCard from "./EventCard";
import eventsData from "../../data/events.json";
import Button from "../Buttons/Buttons";

// dynamically import all images in /assets/images/events/
function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
const images = importAll(require.context("../../assets/images/events", false, /\.(png|jpe?g|svg)$/));

const UpcomingEvents = () => {
  const today = new Date();

  const upcomingEvents = eventsData
    .filter(event => new Date(event.date) > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="container event-container mt-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>

      <div className="row inner-card justify-content-center  g-0 g-md-5">
        {upcomingEvents.map(event => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            image={images[event.image]}
            days={event.days}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <Button to="/events" variant="primary" className="px-4" icon="arrow-right-circle">
          View All Events
        </Button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
