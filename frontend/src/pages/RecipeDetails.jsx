import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const recipe = location.state?.recipe;

  if (!recipe) {
    return <h1>Recipe not found</h1>;
  }

  // split instructions into steps
  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(".")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div>
      <Navbar />

      {/* breadcrumb */}
      <div style={{ padding: 20 }}>
        <button onClick={() => navigate("/recipes")}>
          ← Back to Recipes
        </button>
      </div>

      {/* MAIN CONTENT (LEFT ALIGNED) */}
      <div
        style={{
          padding: 20,
          textAlign: "left",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h1>{recipe.strMeal}</h1>

        <img
          src={recipe.strMealThumb}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            marginBottom: 20,
          }}
        />

        {/* NUTRITION */}
        <h2>Estimated Nutrition Facts</h2>

        <p>Calories: {recipe.estimatedCalories} (estimated)</p>
        <p>Protein: {recipe.protein}g (estimated)</p>
        <p>Carbs: {recipe.carbs}g (estimated)</p>
        <p>Fat: {recipe.fat}g (estimated)</p>
        <p>Servings: {recipe.servings} (estimated)</p>
        <p>Cook Time: {recipe.estimatedCookTime} mins (estimated)</p>

        {/* INGREDIENTS */}
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        {/* INSTRUCTIONS */}
        <h2>Steps</h2>

        <div>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                padding: 10,
                borderLeft: "3px solid #999",
              }}
            >
              <strong>Step {index + 1}</strong>
              <p style={{ margin: 0 }}>{step}.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}