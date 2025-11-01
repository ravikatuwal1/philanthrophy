import React from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Make sure this is imported somewhere globally
import './Breadcrumb.css'
const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/prayertime', label: 'Prayer Time' },
  { path: '/publication', label: 'Publication' },
  { path: '/publication/:lang', label: ({ lang }) => lang.charAt(0).toUpperCase() + lang.slice(1) },
  { path: '/blog', label: 'Blog' },
  { path: '/blog/:id', label: 'Blog Article' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
  { path: '/my-posts', label: 'My Posts' },
  { path: '/submit-post', label: 'Submit Post' },
  { path: '/submit-post/:postId', label: 'Edit Post' },
  { path: '/admin', label: 'Admin' },
];

function labelFor(pathname) {
  for (const r of ROUTES) {
    const m = matchPath({ path: r.path, end: true }, pathname);
    if (m) return typeof r.label === 'function' ? r.label(m.params) : r.label;
  }
  return null;
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [];
  let acc = '';

  // Always include Home
  crumbs.push({ to: '/', label: 'Home' });

  parts.forEach((seg, i) => {
    acc += `/${seg}`;
    const label = labelFor(acc) || seg;
    crumbs.push({ to: acc, label });
  });

  const last = crumbs[crumbs.length - 1]?.to;

  return (
    <nav aria-label="breadcrumb" className="custom-breadcrumb-nav">
      <ol className="breadcrumb mb-0">
        {crumbs.map((c, idx) =>
          c.to === last ? (
            <li key={c.to} className="breadcrumb-item active" aria-current="page">
              {idx === 0 ? <i className="bi bi-house-door me-1"></i> : null}
              {c.label}
            </li>
          ) : (
            <li key={c.to} className="breadcrumb-item">
              <Link to={c.to}>
                {idx === 0 ? <i className="bi bi-house-door me-1"></i> : null}
                {c.label}
              </Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}