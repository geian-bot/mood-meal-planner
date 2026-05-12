import { useContext } from "react";
import { MealContext } from "../context/MealContext";

export default function Calendar() {
  const { plannedMeals, setPlannedMeals } = useContext(MealContext);

  const removeMeal = (indexToRemove) => {
    const updatedMeals = plannedMeals.filter(
      (_, index) => index !== indexToRemove
    );

    setPlannedMeals(updatedMeals);
  };

  return (
    <div>
      <h1>Meal Calendar</h1>

      {plannedMeals.length === 0 ? (
        <p>No meals planned yet.</p>
      ) : (
        plannedMeals.map((meal, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{meal.name}</h3>
            <p>Mood: {meal.mood}</p>

            <button onClick={() => removeMeal(index)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}