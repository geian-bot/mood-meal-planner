import { Link } from "react-router-dom";

export default function Navbar({ username }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h2 style={{ margin: 0 }}>
        {username ? `Welcome ${username}!` : "Meal Planner"}
      </h2>

      <div>
        <Link to="/" style={{ marginRight: "15px" }}>
          Home
        </Link>

        <Link to="/recipes" style={{ marginRight: "15px" }}>
          Recipes
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}