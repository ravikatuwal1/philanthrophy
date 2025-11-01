import React, { useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import HomeHero from '../components/home/HomeHero';
import TopNavbar from '../components/Navbar/TopNavbar.jsx';
import AppNavbar from '../components/Navbar/Navbar.jsx';
import Footer from '../components/Footer/Footer';
import FloatingSocial from '../components/FloatingSocial/FloatingSocial';
const META = [
  { path: '/', title: 'Home', desc: 'Welcome to Satsang Nepal Biratnagar' },
  { path: '/login', title: 'Login', desc: 'Welcome to Satsang Nepal Biratnagar' },
    { path: '/register', title: 'Register', desc: 'Welcome to Satsang Nepal Biratnagar' },
  { path: '/events', title: 'Events', desc: 'Upcoming gatherings and schedules' },
  { path: '/prayertime', title: 'Prayer Time', desc: 'Monthly prayer times by zone' },
  { path: '/publication', title: 'Publication', desc: 'Read publications and resources' },
  { path: '/publication/:lang', title: 'Publication', desc: 'Language specific publications' },
  { path: '/blog', title: 'Blog', desc: 'Latest posts and reflections' },
  { path: '/blog/:id', title: 'Blog Article', desc: 'Read this article' },
  { path: '/gallery', title: 'Gallery', desc: 'Photos and moments' },
  { path: '/contact', title: 'Contact', desc: 'Reach out to us' },
  { path: '/my-posts', title: 'My Posts', desc: 'Your submitted posts' },
  { path: '/submit-post', title: 'Submit Post', desc: 'Contribute a new post' },
  { path: '/submit-post/:postId', title: 'Edit Post', desc: 'Edit your post' },
  { path: '/admin', title: 'Admin', desc: 'Administration dashboard', noIndex: true },
];

function getMeta(pathname) {
  for (const m of META) {
    const match = matchPath({ path: m.path, end: true }, pathname);
    if (match) return m;
  }
  // fallback: find best prefix
  for (const m of META) {
    const match = matchPath({ path: m.path, end: false }, pathname);
    if (match) return m;
  }
  return { title: 'Page', desc: '' };
}

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const meta = useMemo(() => getMeta(pathname), [pathname]);

  return (
    <>
  <SEO title={meta.title} description={meta.desc} noIndex={meta.noIndex} />
  <header>
    <TopNavbar />
    <AppNavbar />
    <FloatingSocial />
  
  </header>

  <main style={{ paddingTop: 'px' }}>
    {isHome && <HomeHero />}
    {!isHome && <PageHeader title={meta.title} subtitle={meta.desc} />}
    {children}
  </main>

  <Footer />
</>
  );
}