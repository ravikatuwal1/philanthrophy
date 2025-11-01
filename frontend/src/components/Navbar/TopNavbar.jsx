import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './TopNavbar.css';
import { Nav } from 'react-bootstrap';
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from '../../context/UseAuth';


function TopNavbar() {
  const { user, logout } = useAuth();

console.log("user");
  return (
    <Nav className="navbar navbar-expand-sm navbar-custom navbar-dark fixed-top" id="navbar1">
      <div className="container-fluid d-flex justify-content-end align-items-center">
        {user ? (
          <div className="d-flex align-items-center">
            <span className="me-2 text-white small">Hello, {user?.name || user?.username}</span>
            <button onClick={logout} className="btn btn-outline-light btn-sm">Logout</button>
          </div>
        ) : (
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <Link to="/login" className="text-sm fw-bold link-white-hover">Login</Link>
            </li>
          </ul>
        )}
      </div>
    </Nav>
  );
}

export default TopNavbar;
