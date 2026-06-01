import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";
import logo from "../assets/cook-orbit.png";

export default function Navbar({ username }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/recipes?search=${search}`);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <nav className="navbar">

      {/* RIGHT - LINKS */}
      <div className="nav-links">
        <div className="nav-left">
          <img src={logo} alt="Cook Orbit" className="logo" />
          <h2>Cook Orbit</h2>
      </div>

        <div className="nav-center">
           <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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

          <Link to="/calendar">Calendar</Link>

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