import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./recipedetails.css";
import { API } from "../utils/api";

export default function RecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const user_id = localStorage.getItem("user_id");
  const isGuest = !user_id;

  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [loading, setLoading] = useState(!location.state?.recipe);
  const [saved, setSaved] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

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
            const measure = meal[`strMeasure${i}`];

            if (ing && ing.trim()) {
              ingredients.push({
                name: ing.trim(),
                measure: measure?.trim() || "",
              });
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
              ingredientCount <= 5 ? 15 : ingredientCount <= 10 ? 30 : 45,
          });
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (isGuest || !recipe) return;

      try {
        const res = await fetch(API.getBookmarks, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(user_id ? { "X-User-Id": user_id } : {}),
          },
        });

        const data = await res.json();

        if (data.success) {
          setSaved(
            data.bookmarks.some((b) => b.recipe_id === recipe.idMeal)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkBookmark();
  }, [recipe]);

  if (loading) {
    return (
      <div className="rd-loading-screen">
        <Navbar />
        <div className="rd-loading-content">
          <div className="rd-spinner" />
          <p>Loading recipe…</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div>
        <Navbar />
        <div className="rd-not-found">
          <h2>Recipe not found</h2>
          <button
            className="rd-back-btn"
            onClick={() => navigate("/recipes")}
          >
            ← Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10)
    : [];

  const nutritionStats = [
    { label: "Calories", value: recipe.estimatedCalories, unit: "kcal", icon: "🔥" },
    { label: "Protein", value: `${recipe.protein}g`, unit: "est.", icon: "💪" },
    { label: "Carbs", value: `${recipe.carbs}g`, unit: "est.", icon: "🌾" },
    { label: "Fat", value: `${recipe.fat}g`, unit: "est.", icon: "🫒" },
    { label: "Servings", value: recipe.servings, unit: "plate(s)", icon: "🍽️" },
    { label: "Cook Time", value: recipe.estimatedCookTime, unit: "mins", icon: "⏱️" },
  ];

  return (
    <div className="rd-page">
      <Navbar />

      <div className="rd-back-wrapper">
        <button className="rd-back-btn" onClick={() => navigate("/recipes")}>
          ← Back to Recipes
        </button>
      </div>

      <div className="rd-hero">
        <div className="rd-hero-image-wrap">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="rd-hero-image"
          />
          <div className="rd-hero-overlay" />
        </div>
      </div>

      <div className="rd-container">

        <div className="rd-title-row">
          <h1 className="rd-title">{recipe.strMeal}</h1>

          <button
            className={`rd-save-btn ${saved ? "rd-save-btn--saved" : ""}`}
            disabled={bookmarkLoading}
            onClick={async () => {
              if (isGuest) {
                alert("Guest mode cannot save recipes. Please log in");
                return;
              }

              setBookmarkLoading(true);

              try {
                const headers = {
                  "Content-Type": "application/json",
                };

                if (user_id) {
                  headers["X-User-Id"] = user_id;
                }

                if (!saved) {
                  await fetch(API.saveBookmark, {
                    method: "POST",
                    headers,
                    credentials: "include",
                    body: JSON.stringify({
                      recipe_id: recipe.idMeal,
                      recipe_name: recipe.strMeal,
                      recipe_thumb: recipe.strMealThumb,
                      recipe_category: recipe.strCategory || "",
                    }),
                  });
                } else {
                  await fetch(API.deleteBookmark, {
                    method: "POST",
                    headers,
                    credentials: "include",
                    body: JSON.stringify({
                      recipe_id: recipe.idMeal,
                    }),
                  });
                }

                setSaved((s) => !s);
              } catch (err) {
                console.error(err);
              } finally {
                setBookmarkLoading(false);
              }
            }}
          >
            {saved ? "Saved" : "Save Recipe"}
          </button>
        </div>

        <section className="rd-section">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>
                {ing.name} {ing.measure && `- ${ing.measure}`}
              </li>
            ))}
          </ul>
        </section>

        <section className="rd-section">
          <h2>Instructions</h2>
          <div>
            {steps.map((step, index) => (
              <p key={index}>
                {index + 1}. {step}
              </p>
            ))}
          </div>
        </section>

        <div className="rd-footer-back">
          <button onClick={() => navigate("/recipes")}>
            ← Back to Recipes
          </button>
        </div>

      </div>
    </div>
  );
}