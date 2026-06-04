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
          ><span className="rd-back-arrow">←</span> Back to Recipes
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
          <svg className="rd-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Recipes
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
          <div className="rd-hero-overlay" />
          {recipe.strCategory && (
            <span className="rd-category-badge">{recipe.strCategory}</span>
          )}
        </div>
      </div>

      <div className="rd-container">

        <div className="rd-title-row">
          <div className="rd-title-left">
            {recipe.strArea && (
              <span className="rd-origin-tag">{recipe.strArea} Cuisine</span>
            )}
            <h1 className="rd-title">{recipe.strMeal}</h1>
          </div>
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
            <svg className="rd-heart-icon" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {saved ? "Saved!" : "Save Recipe"}
          </button>
        </div>
        
        <section className="rd-section">
          <h2 className="rd-section-title">
            <span className="rd-section-accent" />
            Nutrition Overview
          </h2>
          <div className="rd-nutrition-grid">
            {nutritionStats.map((stat) => (
              <div className="rd-nutrition-card" key={stat.label}>
                <span className="rd-nutrition-icon">{stat.icon}</span>
                <span className="rd-nutrition-value">{stat.value}</span>
                <span className="rd-nutrition-unit">{stat.unit}</span>
                <span className="rd-nutrition-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rd-section">
          <h2 className="rd-section-title">
            <span className="rd-section-accent" />
            Ingredients
          </h2>
          <ul className="rd-ingredients-list">
            {recipe.ingredients?.map((ing, i) => (
              <li className="rd-ingredient-item" key={i}>
                <span className="rd-ingredient-dot" />
                <span className="rd-ingredient-name">
                  {typeof ing === "object" ? ing.name : ing}
                </span>
                {typeof ing === "object" && ing.measure && (
                  <span className="rd-ingredient-measure">{ing.measure}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rd-section rd-section--steps">
          <h2 className="rd-section-title">
            <span className="rd-section-accent" />
            Instructions
          </h2>
          <div className="rd-steps-list">
            {steps.map((step, index) => (
              <div className="rd-step-card" key={index}>
                <div className="rd-step-number">
                  <span>{index + 1}</span>
                </div>
                <div className="rd-step-body">
                  <p className="rd-step-label">Step {index + 1}</p>
                  <p className="rd-step-text">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer Back ── */}
        <div className="rd-footer-back">
          <button className="rd-back-btn" onClick={() => navigate("/recipes")}>
            <svg className="rd-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Recipes
          </button>
        </div>

      </div>
    </div>
  );
}