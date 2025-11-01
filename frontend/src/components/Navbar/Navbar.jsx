import React, { useContext, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Logo from '../../assets/images/logos/satsang-nepal-biratnagar.jpg';
import { AuthContext } from "../../context/AuthContext";
import './Navbar.css';

function AppNavbar() {
  const { user } = useContext(AuthContext);
  const isAdmin = !!user?.isAdmin;
  const location = useLocation();

  // Consider these paths part of “Blog”
  const isBlogActive = [
    '/blog',
    '/my-posts',
    '/submit-post',
    '/admin'
  ].some(prefix => location.pathname.startsWith(prefix));

  useEffect(() => {
    const handleScroll = () => {
      const navbar1 = document.getElementById('navbar1');
      const navbar2 = document.getElementById('navbar2');
      if (window.scrollY > 100) {
        if (navbar1) navbar1.style.transform = 'translateY(-100%)';
        if (navbar2) navbar2.style.top = '0';
      } else {
        if (navbar1) navbar1.style.transform = 'translateY(0)';
        if (navbar2) navbar2.style.top = '35px';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar expand="lg" id="navbar2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={Logo} alt="Satsang Nepal Biratnagar" className="rounded-pill me-2 logo-img" />
          <span className="fs-5 fw-semibold">Satsang Nepal Biratnagar</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-link-custom">
            {/* Top-level links use NavLink so they get the 'active' class */}
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/prayertime">Prayer Time</Nav.Link>

            {/* Publication dropdown */}
            <NavDropdown title="Publication" id="publication-dropdown">
              <NavDropdown.Item as={NavLink} to="/publication">Overview</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/publication/nepali">Nepali</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/publication/english">English</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/publication/bangla">Bangla</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/publication/esatsang">eSatsang</NavDropdown.Item>
            </NavDropdown>

            {/* Blog: plain link for guests, dropdown for signed-in/admins */}
            {!user ? (
              <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            ) : (
              <NavDropdown title="Blog" id="blog-dropdown" active={isBlogActive}>
                <NavDropdown.Item as={NavLink} to="/blog">Blogs</NavDropdown.Item>
                {!isAdmin && (
                  <>
                    <NavDropdown.Item as={NavLink} to="/my-posts">My Posts</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/submit-post">Submit Post</NavDropdown.Item>
                  </>
                )}
                {isAdmin && (
                  <NavDropdown.Item as={NavLink} to="/admin">Admin Dashboard</NavDropdown.Item>
                )}
              </NavDropdown>
            )}

            <Nav.Link as={NavLink} to="/gallery">Gallery</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;