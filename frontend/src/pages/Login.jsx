import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MealContext } from "../context/MealContext";

export default function Login() {
  const navigate = useNavigate();

  const [inputUsername, setInputUsername] = useState("");

  const { setUsername } = useContext(MealContext);

  const handleLogin = () => {
    setUsername(inputUsername);
    navigate("/dashboard"); // need to change this once backend is coded in
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
      </div>
    </div>
  );
}