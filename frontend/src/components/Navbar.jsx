import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/cook-orbit.png";

export default function Navbar({ username }) {
  return (
    <nav className="navbar">

      {/* RIGHT - LINKS */}
      <div className="nav-links">
        <div className="nav-left">
          <img src={logo} alt="Cook Orbit" className="logo" />
          <h2>Cook Orbit</h2>
      </div>

        <div className="nav-center">
          <input type="text" placeholder="Search recipes..." />
        </div>

        <div className="nav-right">
          <Link to="/home">Home</Link>

          <div className="dropdown">
            <span>Recipes ▾</span>
            <div className="dropdown-content">
              <Link to="/recipes">View All</Link>
              <Link to="/saved">Saved</Link>
              <Link to="/created">Created</Link>
            </div>
          </div>

          <Link to="/about">About Us</Link>

          <div className="profile">
          {username ? (
            <span>👤 {username}</span>
          ) : (
            <Link to="/login">Login 👤</Link>
          )}
        </div>
        </div>

        {/* Recipes Dropdown */}
        

        {/* PROFILE */}
        
      </div>
    </nav>
  );
}