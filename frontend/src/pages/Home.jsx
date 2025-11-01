import React from 'react';
import Counter from '../components/Counter/Counter';
import UpcomingEvents from '../components/UpcomingEvents/UpcomingEvents';
import BlogList from '../components/Blog/BlogList';
import PrayerVideo from '../components/PrayerVideo/PrayerVideo';
import TopNavbar from '../components/Navbar/TopNavbar';


export default function Home() {
  return (
    <>
    <Counter />
    <UpcomingEvents />
    <BlogList limit={3} showViewAll title="Latest Articles" />
    <PrayerVideo />
    </>
  );
}
