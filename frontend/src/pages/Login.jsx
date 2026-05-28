import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MealContext } from "../context/MealContext";
import "./login.css";

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
        "http://localhost/MOOD-MEAL-PLANNER/backend/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          // 🔥 REQUIRED for PHP sessions
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
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
      alert("Server error. Check XAMPP + backend URL.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-overlay">

        <div className="login-card">

          <div className="login-logo">🍽️ MoodBite</div>

          <h2>Welcome Back</h2>

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

          <p className="login-text">
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register now
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}