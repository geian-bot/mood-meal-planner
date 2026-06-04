  import { Link, useNavigate } from "react-router-dom";
  import { useState, useContext, useEffect } from "react";
  import { MealContext } from "../context/MealContext";
  import "./navbar.css";
  import logo from "../assets/cook-orbit.png";

  export default function Navbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { username, setUsername } = useContext(MealContext);

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const displayName = username || localStorage.getItem("username");

    const [profileOpen, setProfileOpen] = useState(false);

    const toggleSidebar = () => {
      setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
      setSidebarOpen(false);
    };

    const handleLogout = () => {
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      localStorage.removeItem("mode");
      setUsername("");
      setShowLogoutPopup(false);
      navigate("/home");
    };

    const handleSearch = () => {
      if (!search.trim()) return;
      navigate(`/recipes?search=${search}`);
      setSearch("");
      closeSidebar();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleSearch();
    };

    const toggleProfileDropdown = () => {
      setProfileOpen((prev) => !prev);
    };

    const closeProfileDropdown = () => {
      setProfileOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = () => setProfileOpen(false);
      if (profileOpen) window.addEventListener("click", handleClickOutside);

      return () => window.removeEventListener("click", handleClickOutside);
    }, [profileOpen]);

    return (
      <nav className="navbar">
        <div className="nav-links">

          {/* LEFT */}
          <div className="nav-left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>

            <img src={logo} alt="Cook Orbit" className="logo" />
            <h2>Cook Orbit</h2>
          </div>

          {/* CENTER */}
          <div className="nav-center">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* RIGHT */}
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
              {displayName ? (
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <span
                    className="profile-trigger"
                    onClick={toggleProfileDropdown}
                    style={{ cursor: "pointer" }}
                  >
                    👤 {displayName} ▾
                  </span>

                  {profileOpen && (
                    <div className="profile-dropdown-menu">
                      <button
                        className="profile-logout-btn"
                        onClick={() => {
                          setShowLogoutPopup(true);
                          closeProfileDropdown();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">Login 👤</Link>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR OVERLAY */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={closeSidebar}
        />

        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <img src={logo} alt="logo" className="logo" />
              <h2>Cook Orbit</h2>
            </div>

            <button className="sidebar-close-btn" onClick={closeSidebar}>
              ✕
            </button>
          </div>

          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="sidebar-nav">
            <Link to="/home" className="sidebar-link" onClick={closeSidebar}>
              🏠 Home
            </Link>

            <div className="sidebar-section-label">Recipes</div>

            <Link to="/recipes" className="sidebar-sub-link" onClick={closeSidebar}>
              View All
            </Link>
            <Link to="/saved" className="sidebar-sub-link" onClick={closeSidebar}>
              Saved
            </Link>
            <Link to="/created" className="sidebar-sub-link" onClick={closeSidebar}>
              Created
            </Link>

            <Link to="/calendar" className="sidebar-link" onClick={closeSidebar}>
              📅 Calendar
            </Link>

            <Link to="/about" className="sidebar-link" onClick={closeSidebar}>
              ℹ️ About Us
            </Link>
          </div>
        </div>

        {/* LOGOUT POPUP */}
        {showLogoutPopup && (
          <div className="logout-overlay">
            <div className="logout-popup">
              <h3>Log Out?</h3>
              <p>Are you sure you want to log out?</p>

              <div className="logout-actions">
                <button className="logout-yes" onClick={handleLogout}>
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