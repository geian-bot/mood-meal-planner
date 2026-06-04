import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MealContext } from "../context/MealContext";
import "./login.css";
import logo from "../assets/cook-orbit.png";
import BASE_URL from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const { setUsername } = useContext(MealContext);

  const handleLogin = async () => {
    if (!inputUsername || !inputPassword) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: inputUsername,
            password: inputPassword,
          }),
        }
      );

      console.log("HTTP STATUS:", res.status);

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.success) {
        setUsername(inputUsername);
        localStorage.setItem("username", inputUsername);
        localStorage.setItem("user_id", String(data.user_id));
        navigate("/calendar");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
      alert("Server error.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-card">
          <img src={logo} alt="Cook Orbit" className="login-logo" />
          <h3 className="login-brand">Cook Orbit</h3>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Continue planning meals that fit your mood.
          </p>
          <input
            type="text"
            placeholder="Username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <button
            className="login-button guest-btn"
            onClick={() => {
              localStorage.setItem("username", "Guest");
              setUsername("Guest");
              navigate("/calendar");
            }}
          >
            Continue as Guest
          </button>
          <p className="login-text">
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
}