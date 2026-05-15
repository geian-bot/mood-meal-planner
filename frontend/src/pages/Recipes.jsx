import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";

export default function Recipes() {
  const { addMeal, selectedMood, username } =
    useContext(MealContext);

  const [meals, setMeals] = useState([]);
  const [popup, setPopup] = useState("");

  useEffect(() => {
    fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    )
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals || []);
      });
  }, []);

  const addToCalendar = (meal) => {
    addMeal({
      name: meal.strMeal,
      mood: selectedMood || "Happy",
    });

    setPopup("Recipe added to your calendar");

    setTimeout(() => setPopup(""), 2000);
  };

  // REAL FILTER LOGIC BASED ON MOOD
  const filteredMeals = meals.filter((meal) => {
    if (!selectedMood) return true;

    const name = meal.strMeal.toLowerCase();

    switch (selectedMood) {
      case "Happy":
        return name.includes("chicken") || name.includes("beef");

      case "Stressed":
        return name.includes("soup") || name.includes("rice");

      case "Lazy":
        return name.includes("sandwich") || name.includes("noodle");

      case "Energetic":
        return name.includes("salad") || name.includes("grilled");

      default:
        return true;
    }
  });

  return (
    <div>
      <Navbar username={username} />

      {/* TOAST */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            border: "1px solid #ccc",
            padding: 10,
          }}
        >
          {popup}
        </div>
      )}

      {/* TITLE */}
      <div style={{ padding: 20 }}>
        <h2>
          {selectedMood
            ? `Mood: ${selectedMood}`
            : "All Recipes"}
        </h2>
      </div>

      {/* LIST */}
      <div style={{ padding: 20 }}>
        {filteredMeals.map((meal) => (
          <div
            key={meal.idMeal}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10,
            }}
          >
            <h3>{meal.strMeal}</h3>

            <img
              src={meal.strMealThumb}
              width={120}
            />

            <div>
              <button
                onClick={() => addToCalendar(meal)}
              >
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}