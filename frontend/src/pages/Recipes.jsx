import { useEffect, useState, useContext } from "react";
import { MealContext } from "../context/MealContext";

export default function Recipes() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { addMeal } = useContext(MealContext);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals || []);
      });
  }, []);

  const handleAdd = (meal) => {
    addMeal({
      name: meal.strMeal,
      mood: "Happy",
    });
  };

  return (
    <div>
      <h1>Recipes</h1>

      {/* LIST */}
      {meals.slice(0, 10).map((meal) => (
        <div
          key={meal.idMeal}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{meal.strMeal}</h3>

          <img src={meal.strMealThumb} width="150" />

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setSelectedMeal(meal)}>
              View Recipe
            </button>

            <button
              onClick={() => handleAdd(meal)}
              style={{ marginLeft: "10px" }}
            >
              Add to Calendar
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {selectedMeal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setSelectedMeal(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "80%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedMeal(null)}>
              Close
            </button>

            <h2>{selectedMeal.strMeal}</h2>

            <img src={selectedMeal.strMealThumb} width="200" />

            {/* ALSO KEEP ADD BUTTON INSIDE MODAL */}
            <button
              onClick={() => handleAdd(selectedMeal)}
              style={{ display: "block", margin: "10px 0" }}
            >
              Add to Calendar
            </button>

            <h3>Ingredients</h3>
            <ul>
              {Array.from({ length: 10 }).map((_, i) => {
                const ingredient =
                  selectedMeal[`strIngredient${i + 1}`];
                const measure =
                  selectedMeal[`strMeasure${i + 1}`];

                return (
                  ingredient && (
                    <li key={i}>
                      {ingredient} - {measure}
                    </li>
                  )
                );
              })}
            </ul>

            <h3>Instructions</h3>
            <p>{selectedMeal.strInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}