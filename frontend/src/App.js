import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

// pages
import Home from './pages/Home';
import Events from './pages/Events';
import Prayer from './pages/Prayer';
import Publication from './pages/Publication';
import Nepali from './pages/Nepali';
import English from './pages/English';
import Bangla from './pages/Bangla';
import Esatsang from './pages/Esatsang';
import Blog from './components/Blog/Blog';
import Gallery from "./components/Gallery/Gallery";
import EventGallery from "./components/Gallery/EventGallery";
import Contact from './pages/Contact';
import LoginSignup from './components/Auth/LoginSignup';

// components
import BlogPost from './components/Blog/BlogPost';
import MyPosts from './components/Blog/MyPosts';
import SubmitPost from './components/Blog/SubmitPost';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css'
export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />

        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/prayertime" element={<Prayer />} />

        <Route path="/publication" element={<Publication />} />
        <Route path="/publication/nepali" element={<Nepali />} />
        <Route path="/publication/english" element={<English />} />
        <Route path="/publication/bangla" element={<Bangla />} />
        <Route path="/publication/esatsang" element={<Esatsang />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/submit-post" element={<SubmitPost />} />
        <Route path="/submit-post/:postId" element={<SubmitPost />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:eventId" element={<EventGalleryWrapper />}
      />
      </Routes>
    </AppLayout>
  );
}

const EventGalleryWrapper = () => {
  const { eventId } = useParams();
  return <EventGallery eventId={eventId} />;
};