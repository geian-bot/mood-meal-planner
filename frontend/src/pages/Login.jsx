import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MealContext } from "../context/MealContext";

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
        }}
      >
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
          }}
        >
          Login
        </button>

        {/* REGISTER LINK */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/register")}
          >
            Register now
          </span>
        </p>
      </div>
    </div>
  );
}