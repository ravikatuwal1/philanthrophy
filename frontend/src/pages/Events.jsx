import React from "react";
import eventsData from "../data/events.json";
import EventCard from "../components/UpcomingEvents/EventCard";
import "../components/UpcomingEvents/UpcomingEvents.css";

// Dynamically import all images in /assets/images/events/
function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
const images = importAll(
  require.context("../assets/images/events", false, /\.(png|jpe?g|svg)$/)
);

export default function Events() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time for comparison

  // Separate upcoming and past events
  const upcomingEvents = eventsData
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = eventsData
    .filter((event) => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent past first

  return (
    <div className="container event-container mt-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>
      <div className="row inner-card justify-content-center g-0 g-md-5">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              image={images[event.image]}
              days={event.days}
            />
          ))
        ) : (
          <div className="text-center mb-4">No upcoming events.</div>
        )}
      </div>

      <h2 className="text-center my-4">Past Events</h2>
      <div className="row inner-card justify-content-center g-0 g-md-5">
        {pastEvents.length > 0 ? (
          pastEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              image={images[event.image]}
              days={event.days}
            />
          ))
        ) : (
          <div className="text-center mb-4">No past events.</div>
        )}
      </div>
    </div>
  );
}