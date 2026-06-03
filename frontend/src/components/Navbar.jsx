import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { MealContext } from "../context/MealContext";
import "./navbar.css";
import logo from "../assets/cook-orbit.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { username, setUsername } = useContext(MealContext);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const displayName = username || localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowLogoutPopup(false);
    navigate("/home");
  };

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
              <Link to="/createrecipe">Created</Link>
            </div>
          </div>

          <Link to="/calendar">Calendar</Link>

          <Link to="/about">About Us</Link>

          <div className="profile">
            {displayName ? (
              <span
                className="profile-user"
                onClick={() => setShowLogoutPopup(true)}
                style={{ cursor: "pointer" }}
              >
                👤 {displayName}
              </span>
            ) : (
              <Link to="/login">Login 👤</Link>
            )}
          </div>
        </div>

        {/* Recipes Dropdown */}
        

        {/* PROFILE */}
        
      </div>
      {showLogoutPopup && (
        <div className="logout-overlay">
          <div className="logout-popup">
            <h3>Log Out?</h3>

            <p>
              Are you sure you want to log out?
            </p>

            <div className="logout-actions">
              <button
                className="logout-yes"
                onClick={handleLogout}
              >
                Yes
              </button>

              <button
                className="logout-no"
                onClick={() => setShowLogoutPopup(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}