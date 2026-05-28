import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ username }) {
  return (
    <nav className="navbar">
      {/* LEFT - LOGO */}
      <h2 className="logo">MealBite</h2>

      {/* RIGHT - LINKS */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {/* Recipes Dropdown */}
        <div className="dropdown">
          <span>Recipes ▾</span>
          <div className="dropdown-content">
            <Link to="/recipes">View All</Link>
            <Link to="/saved">Saved</Link>
            <Link to="/created">Created</Link>
          </div>
        </div>

        {/* PROFILE */}
        <div className="profile">
          {username ? (
            <span>👤 {username}</span>
          ) : (
            <Link to="/login">Login 👤</Link>
          )}
        </div>
      </div>
    </nav>
  );
}