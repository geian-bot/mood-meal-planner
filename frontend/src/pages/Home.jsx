import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );

      const data = await res.json();

      const randomMeals = data.meals
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      setMeals(randomMeals);
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <Navbar />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          padding: "20px",
        }}
      >
        {meals.map((meal) => (
          <img
            key={meal.idMeal}
            src={meal.strMealThumb}
            alt={meal.strMeal}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h1 style={{ fontSize: "3rem" }}>Meal Planner</h1>

        <p>
          Plan your meals based on your mood and organize your nutrition.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 25px",
            marginTop: "20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
          }}
        >
            Start Editing
        </button>
      </div>
    </div>
  );
}