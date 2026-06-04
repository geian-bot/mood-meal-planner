import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";
import "./recipedetails.css";

const MOODS = [
  { value: "happy",     label: "😊 Happy" },
  { value: "stressed",  label: "😟 Stressed" },
  { value: "relaxed",   label: "😌 Relaxed" },
  { value: "energetic", label: "💪 Energetic" },
  { value: "tired",     label: "😴 Tired" },
];

export default function CreatedRecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [loading, setLoading] = useState(!location.state?.recipe);

  // If navigated directly via URL, fetch from backend
  useEffect(() => {
    if (recipe) return;
    const fetchRecipe = async () => {
      try {
        const res = await fetch(API.getRecipes, {
          credentials: "include",
          headers: { "X-User-Id": localStorage.getItem("user_id") || "" }
        });
        const data = await res.json();
        if (data.success) {
          const found = data.recipes.find((r) => String(r.id) === String(id));
          if (found) setRecipe(found);
          else navigate("/created");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return (
    <div className="rd-loading-screen">
      <Navbar />
      <div className="rd-loading-content">
        <div className="rd-spinner" />
        <p>Loading recipe…</p>
      </div>
    </div>
  );

  if (!recipe) return (
    <div>
      <Navbar />
      <div className="rd-not-found">
        <h2>Recipe not found</h2>
        <button className="rd-back-btn" onClick={() => navigate("/created")}>
          ← Back to My Recipes
        </button>
      </div>
    </div>
  );

  const steps = recipe.instructions
    ? recipe.instructions
        .split(/\n|(?<=\.)\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5)
    : [];

  const moodLabel = MOODS.find((m) => m.value === recipe.mood)?.label || recipe.mood;

  const nutritionStats = [
    { label: "Prep Time",  value: recipe.prep_time,  unit: "mins",     icon: "⏱️" },
    { label: "Servings",   value: recipe.servings,   unit: "plate(s)", icon: "🍽️" },
    { label: "Category",   value: recipe.category,   unit: "",         icon: "📋" },
    { label: "Mood",       value: moodLabel,         unit: "",         icon: "😊" },
  ];

  return (
    <div className="rd-page">
      <Navbar />

      {/* ── Back Button ── */}
      <div className="rd-back-wrapper">
        <button className="rd-back-btn" onClick={() => navigate("/created")}>
          <svg className="rd-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to My Recipes
        </button>
      </div>

      {/* ── Hero Image ── */}
      <div className="rd-hero">
        <div className="rd-hero-image-wrap">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} className="rd-hero-image" />
          ) : (
            <div className="rd-hero-image" style={{ background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>🍽</div>
          )}
          <div className="rd-hero-overlay" />
          {recipe.category && <span className="rd-category-badge">{recipe.category}</span>}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="rd-container">

        {/* ── Title ── */}
        <div className="rd-title-row">
          <div className="rd-title-left">
            <span className="rd-origin-tag">My Recipe</span>
            <h1 className="rd-title">{recipe.name}</h1>
            {recipe.description && <p style={{ color: "#666", marginTop: 8 }}>{recipe.description}</p>}
          </div>
        </div>

        {/* ── Quick Info ── */}
        <section className="rd-section">
          <h2 className="rd-section-title">
            <span className="rd-section-accent" />
            Recipe Info
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

        {/* ── Ingredients ── */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="rd-section">
            <h2 className="rd-section-title">
              <span className="rd-section-accent" />
              Ingredients
            </h2>
            <ul className="rd-ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <li className="rd-ingredient-item" key={i}>
                  <span className="rd-ingredient-dot" />
                  <span className="rd-ingredient-name">{ing.name}</span>
                  {ing.quantity && <span className="rd-ingredient-measure">{ing.quantity}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Instructions ── */}
        {steps.length > 0 && (
          <section className="rd-section rd-section--steps">
            <h2 className="rd-section-title">
              <span className="rd-section-accent" />
              Instructions
            </h2>
            <div className="rd-steps-list">
              {steps.map((step, index) => (
                <div className="rd-step-card" key={index}>
                  <div className="rd-step-number"><span>{index + 1}</span></div>
                  <div className="rd-step-body">
                    <p className="rd-step-label">Step {index + 1}</p>
                    <p className="rd-step-text">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer Back ── */}
        <div className="rd-footer-back">
          <button className="rd-back-btn" onClick={() => navigate("/created")}>
            <svg className="rd-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to My Recipes
          </button>
        </div>

      </div>
    </div>
  );
}