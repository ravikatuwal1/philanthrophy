import React, { useEffect, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import './FloatingSocial.css';

export default function FloatingSocial() {
const barRef = useRef(null);

useEffect(() => {
const bar = barRef.current;
if (!bar || typeof window === 'undefined') return;
const SAFE_GAP = 16; // px between bar and footer
const SELECTOR = '.footer-small, .footer-custom, footer';

const update = () => {
  const footers = document.querySelectorAll(SELECTOR);
  if (!footers.length) {
    bar.classList.remove('near-footer');
    bar.style.removeProperty('--bottom-raise');
    return;
  }

  // Compute the top-most footer top (closest to viewport bottom)
  let nearestTop = Infinity;
  footers.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0) nearestTop = Math.min(nearestTop, r.top);
  });

  const vh = window.innerHeight;

  // Bar bottom if centered (no need to read current transform)
  const barHalf = bar.offsetHeight / 2;
  const baseBarBottom = vh / 2 + barHalf;

  // If the footer’s top will cross the bar bottom, we need to bump
  const willCollide = nearestTop <= (baseBarBottom + SAFE_GAP);

  if (!isFinite(nearestTop) || !willCollide) {
    bar.classList.remove('near-footer');
    bar.style.removeProperty('--bottom-raise');
    return;
  }

  // Bottom offset so the bar sits just above the footer (with gap)
  // bottom = visible footer height from bottom + SAFE_GAP
  const visibleFooterFromBottom = Math.max(0, vh - nearestTop);
  const bottomRaise = visibleFooterFromBottom + SAFE_GAP;

  bar.style.setProperty('--bottom-raise', `${Math.round(bottomRaise)}px`);
  bar.classList.add('near-footer');
};

// rAF-throttled scroll/resize
let raf = null;
const onScrollOrResize = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = null;
    update();
  });
};

// Observe size changes for accuracy (bar or footers)
const ro = new ResizeObserver(onScrollOrResize);
ro.observe(bar);
document.querySelectorAll(SELECTOR).forEach((el) => ro.observe(el));

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);
update();

return () => {
  ro.disconnect();
  window.removeEventListener('scroll', onScrollOrResize);
  window.removeEventListener('resize', onScrollOrResize);
  if (raf) cancelAnimationFrame(raf);
};
}, []);

return (
<nav ref={barRef} className="social-bar" aria-label="Social media links">
<a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook" >
<FaFacebookF />
</a>
  <a
    href="https://instagram.com/yourhandle"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="social-link instagram"
  >
    <FaInstagram />
  </a>

  <a
    href="https://youtube.com/@yourchannel"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
    className="social-link youtube"
  >
    <FaYoutube />
  </a>
</nav>
);
}