import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function RecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [loading, setLoading] = useState(!location.state?.recipe);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (recipe) return;

      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        const data = await res.json();

        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];

          const ingredients = [];

          for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];

            if (ing && ing.trim()) {
              ingredients.push(ing.trim());
            }
          }

          const ingredientCount = ingredients.length;

          setRecipe({
            ...meal,
            ingredients,
            estimatedCalories: ingredientCount * 80,
            protein: ingredientCount * 5,
            carbs: ingredientCount * 7,
            fat: ingredientCount * 3,
            servings: ingredientCount <= 5 ? 1 : 2,
            estimatedCookTime:
              ingredientCount <= 5
                ? 15
                : ingredientCount <= 10
                ? 30
                : 45,
          });
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <h2 style={{ padding: 20 }}>Loading recipe...</h2>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div>
        <Navbar />
        <h2 style={{ padding: 20 }}>Recipe not found</h2>
      </div>
    );
  }

  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(".")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <button onClick={() => navigate("/recipes")}>
          ← Back to Recipes
        </button>
      </div>

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
          alt={recipe.strMeal}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            marginBottom: 20,
          }}
        />

        <h2>Estimated Nutrition Facts</h2>

        <p>Calories: {recipe.estimatedCalories} (estimated)</p>
        <p>Protein: {recipe.protein}g (estimated)</p>
        <p>Carbs: {recipe.carbs}g (estimated)</p>
        <p>Fat: {recipe.fat}g (estimated)</p>
        <p>Servings: {recipe.servings} (estimated)</p>
        <p>Cook Time: {recipe.estimatedCookTime} mins (estimated)</p>

        <h2>Ingredients</h2>

        <ul>
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

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

              <p style={{ margin: 0 }}>
                {step}.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}