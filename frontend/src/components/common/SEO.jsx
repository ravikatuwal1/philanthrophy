import { useEffect } from 'react';

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

function setMetaName(name, content) {
  if (!content) return;
  const el = upsertMeta(`meta[name="${name}"]`, { name });
  el.setAttribute('content', content);
}

function setMetaProp(property, content) {
  if (!content) return;
  const el = upsertMeta(`meta[property="${property}"]`, { property });
  el.setAttribute('content', content);
}

function setCanonical(href) {
  if (!href) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function SEO({ title, description, noIndex = false, canonical }) {
  useEffect(() => {
    const site = 'Satsang Nepal Biratnagar';
    const prevTitle = document.title;
    document.title = title ? `${title} • ${site}` : site;

    if (description) setMetaName('description', description);
    setMetaName('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // Basic OpenGraph/Twitter
    setMetaProp('og:title', title ? `${title} • ${site}` : site);
    if (description) setMetaProp('og:description', description);
    if (canonical) setCanonical(canonical);

    return () => { document.title = prevTitle; };
  }, [title, description, noIndex, canonical]);

  return null;
}