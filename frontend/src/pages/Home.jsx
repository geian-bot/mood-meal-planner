import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./home.css";

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

      {/* HERO MEALS */}
      <div className="scroll-wrapper">
        <div className="scroll-track">
          {meals.concat(meals).map((meal, index) => (
            <img
              key={index}
              src={meal.strMealThumb}
              alt=""
              className="scroll-img"
            />
          ))}
        </div>
      </div>

      {/* BRAND SECTION */}
      <div className="hero">
        <h1>MealBite</h1>
        <p>MoodBite helps you discover and plan meals based on how you feel. Whether you're stressed, happy, tired, or craving comfort food, we match your mood with the perfect meal ideas to make eating easier, smarter, and more enjoyable.</p>

        <button onClick={() => navigate("/login")}>
          Start Planning
        </button>
      </div>
    </div>
  );
}