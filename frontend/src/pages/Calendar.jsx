import { useState } from "react";

export default function Calendar() {
  const [meals, setMeals] = useState([]);
  const [input, setInput] = useState("");

  const addMeal = () => {
    setMeals([...meals, input]);
    setInput("");
  };

  return (
    <div>
      <h1>Meal Calendar</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter meal"
      />
      <button onClick={addMeal}>Add</button>

      <ul>
        {meals.map((meal, index) => (
          <li key={index}>{meal}</li>
        ))}
      </ul>
    </div>
  );
}