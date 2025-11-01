import React from 'react';
import './Footer.css';
import { Envelope, Telephone, GeoAlt } from 'react-bootstrap-icons';

export default function Footer() {
const year = new Date().getFullYear();
const phoneHref =
typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
? 'tel:+9779807049632'
: 'https://wa.me/9779807049632';

return (
<>
<footer className="footer-custom">
<div className="container">
<div className="footer-inner">
{/* Top row */}
<div className="row gy-4">
<div className="col-12 col-md-4">
<h5>Contact Us</h5>
<address className="footer-address mb-0">
<ul className="list-unstyled footer-links">
<li>
<a href={phoneHref} target="_blank" rel="noopener noreferrer" aria-label="Call or WhatsApp">
<Telephone className="me-2" /> +977 - 9807049632
</a>
</li>
<li>
<a href="mailto:mail@satsangbiratnagar.org.np">
<Envelope className="me-2" /> mail@satsangbiratnagar.org.np
</a>
</li>
<li>
<a href="/contact">
<GeoAlt className="me-2" />
Bank Road, Biratnagar, Morang, Nepal.
</a>
</li>
</ul>
</address>
</div>
          <div className="col-12 col-md-4">
            <h5>Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/prayertime">Prayer Time</a></li>
              <li><a href="/publication">Publications</a></li>
              <li><a href="https://satwati.com/" target="_blank" rel="noopener noreferrer">Satwati Monthly</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h5>More Info</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="https://app.acco.satsangphilanthropy.com/" target="_blank" rel="noopener noreferrer">Deoghar Accommodation</a></li>
              <li><a href="https://www.satsang.org.in/home/satsang-worldwide" target="_blank" rel="noopener noreferrer">Satsang Worldwide</a></li>
              <li><a href="https://www.satsang.org.in/home/announcements" target="_blank" rel="noopener noreferrer">Utsav Announcement</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        {/* Copyright */}
        <div className="text-center pb-4">
          <small className="copyright-text">
            © {year} All rights reserved @satsangbiratnagar
            <span className="mx-2">|</span>
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/ravikatuwal"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Ravi Katuwal
            </a>
          </small>
        </div>
      </div>
    </div>
  </footer>

  <footer className="footer-small">
    <div className="container">
      <div className="footer-inner text-center">
        "Do never die, nor cause death; but resist death to death." - Sri Sri Thakur Anukulchandra.
      </div>
    </div>
  </footer>
</>
);
}