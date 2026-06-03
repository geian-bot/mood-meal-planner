import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/cook-orbit.png";
import BASE_URL from "../utils/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/register.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Registered successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server error.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-card">
          <img src={logo} alt="Cook Orbit" className="login-logo" />
          <h2>Create Account</h2>
          <p className="login-subtitle">
            Start planning meals that fit your mood and lifestyle.
          </p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleRegister} className="login-button">
            Register
          </button>
          <p className="login-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
}