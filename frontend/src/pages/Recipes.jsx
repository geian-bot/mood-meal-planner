import { useEffect, useState } from "react";

export default function Recipes() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then(res => res.json())
      .then(data => {
        setMeals(data.meals || []);
      });
  }, []);

  return (
    <div>
      <h1>Recipes</h1>

      {meals.map((meal) => (
        <div key={meal.idMeal} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{meal.strMeal}</h3>
          <img src={meal.strMealThumb} width="150" />
          <p>{meal.strInstructions.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}