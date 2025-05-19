import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar-custom">
      <div className="container">
        <Link to="/" className="brand">CineScope</Link>
        <div className="links">
          <Link to="/">Home</Link>  {/* Home page */}
          <Link to="/movies">Movies</Link>  {/* Movies page */}
          <Link to="/tv-shows">TV Shows</Link>  {/* TV shows page */}
        </div>
      </div>
    </nav>
  );
}
