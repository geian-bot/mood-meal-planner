import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import "./createrecipe.css";
import { API } from "../utils/api";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Side", "Starter"];
const MOODS = [
  { value: "happy",     label: "😊 Happy" },
  { value: "stressed",  label: "😟 Stressed" },
  { value: "relaxed",   label: "😌 Relaxed" },
  { value: "energetic", label: "💪 Energetic" },
  { value: "tired",     label: "😴 Tired" },
];

const EMPTY_INGREDIENT = { name: "", quantity: "" };

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { username } = useContext(MealContext);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", description: "", category: "", mood: "",
    prepTime: "", servings: "", instructions: "",
  });
  const [ingredients, setIngredients] = useState([
    { ...EMPTY_INGREDIENT }, { ...EMPTY_INGREDIENT },
  ]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateIngredient = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addIngredient = () => setIngredients((prev) => [...prev, { ...EMPTY_INGREDIENT }]);

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())         newErrors.name         = "Recipe name is required.";
    if (!form.description.trim())  newErrors.description  = "Description is required.";
    if (!form.category)            newErrors.category     = "Please select a category.";
    if (!form.mood)                newErrors.mood         = "Please select a mood.";
    if (!form.prepTime)            newErrors.prepTime     = "Preparation time is required.";
    if (!form.servings)            newErrors.servings     = "Number of servings is required.";
    if (!form.instructions.trim()) newErrors.instructions = "Instructions are required.";
    if (!ingredients.filter((i) => i.name.trim()).length)
      newErrors.ingredients = "Add at least one ingredient.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      document.querySelector(".field-error")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const user_id = localStorage.getItem("user_id");
    const isGuest = !user_id;

    setSaving(true);

    const cleanIngredients = ingredients.filter((i) => i.name.trim());

    if (isGuest) {
      alert("Guest mode: recipe will not be saved permanently.");

      setSuccess(true);
      setTimeout(() => navigate("/recipes"), 1800);

      setSaving(false);
      return;
    }

    try {
      const res = await fetch(API.saveRecipe, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user_id,
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          mood: form.mood,
          prep_time: parseInt(form.prepTime) || 30,
          servings: parseInt(form.servings) || 2,
          instructions: form.instructions.trim(),
          ingredients: cleanIngredients,
          image: imagePreview || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/created"), 1800);
      } else {
        alert(data.message || "Failed to save recipe.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="cr-page">
      <Navbar username={username} />

      {success && (
        <div className="cr-toast">
          <span className="cr-toast-icon">✓</span>
          Recipe saved! Redirecting to Recipes...
        </div>
      )}

      <div className="cr-layout">

        {/* ── LEFT: FORM ── */}
        <div className="cr-form-col">

          <div className="cr-page-header">
            <button className="cr-back-btn" onClick={() => navigate("/recipes")}>
              ← Back to Recipes
            </button>
            <div>
              <p className="cr-eyebrow">Cook Orbit</p>
              <h1 className="cr-title">Create a Recipe</h1>
              <p className="cr-subtitle">Share your own creation with the community.</p>
            </div>
          </div>

          {/* RECIPE INFO */}
          <div className="cr-card">
            <div className="cr-card-header">
              <span className="cr-card-icon">📋</span>
              <h2 className="cr-card-title">Recipe Information</h2>
            </div>

            <div className="cr-field">
              <label className="cr-label">Recipe Name <span className="req">*</span></label>
              <input
                className={`cr-input ${errors.name ? "has-error" : ""}`}
                type="text"
                placeholder="e.g. Creamy Garlic Pasta"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="cr-field">
              <label className="cr-label">Description <span className="req">*</span></label>
              <textarea
                className={`cr-textarea short ${errors.description ? "has-error" : ""}`}
                placeholder="A brief description of your recipe..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="cr-row">
              <div className="cr-field">
                <label className="cr-label">Category <span className="req">*</span></label>
                <select
                  className={`cr-select ${errors.category ? "has-error" : ""}`}
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="cr-field">
                <label className="cr-label">Mood Category <span className="req">*</span></label>
                <select
                  className={`cr-select ${errors.mood ? "has-error" : ""}`}
                  value={form.mood}
                  onChange={(e) => handleChange("mood", e.target.value)}
                >
                  <option value="">Select mood</option>
                  {MOODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                {errors.mood && <span className="field-error">{errors.mood}</span>}
              </div>
            </div>

            <div className="cr-row">
              <div className="cr-field">
                <label className="cr-label">Prep Time (mins) <span className="req">*</span></label>
                <input
                  className={`cr-input ${errors.prepTime ? "has-error" : ""}`}
                  type="number" min="1" placeholder="30"
                  value={form.prepTime}
                  onChange={(e) => handleChange("prepTime", e.target.value)}
                />
                {errors.prepTime && <span className="field-error">{errors.prepTime}</span>}
              </div>

              <div className="cr-field">
                <label className="cr-label">Servings <span className="req">*</span></label>
                <input
                  className={`cr-input ${errors.servings ? "has-error" : ""}`}
                  type="number" min="1" placeholder="4"
                  value={form.servings}
                  onChange={(e) => handleChange("servings", e.target.value)}
                />
                {errors.servings && <span className="field-error">{errors.servings}</span>}
              </div>
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="cr-card">
            <div className="cr-card-header">
              <span className="cr-card-icon">🥕</span>
              <h2 className="cr-card-title">Ingredients</h2>
            </div>

            {errors.ingredients && <span className="field-error">{errors.ingredients}</span>}

            <div className="cr-ingredients-list">
              <div className="cr-ing-header-row">
                <span className="cr-ing-col-label">Ingredient</span>
                <span className="cr-ing-col-label">Quantity / Amount</span>
                <span />
              </div>

              {ingredients.map((ing, idx) => (
                <div key={idx} className="cr-ing-row">
                  <input
                    className="cr-input"
                    type="text"
                    placeholder="e.g. Garlic"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                  />
                  <input
                    className="cr-input"
                    type="text"
                    placeholder="e.g. 3 cloves"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                  />
                  <button
                    className="cr-ing-remove"
                    onClick={() => removeIngredient(idx)}
                    disabled={ingredients.length <= 1}
                    title="Remove ingredient"
                  >✕</button>
                </div>
              ))}
            </div>

            <button className="cr-add-ing-btn" onClick={addIngredient}>
              + Add Ingredient
            </button>
          </div>

          {/* INSTRUCTIONS */}
          <div className="cr-card">
            <div className="cr-card-header">
              <span className="cr-card-icon">📝</span>
              <h2 className="cr-card-title">Instructions</h2>
            </div>

            <div className="cr-field">
              <label className="cr-label">Preparation Steps <span className="req">*</span></label>
              <textarea
                className={`cr-textarea ${errors.instructions ? "has-error" : ""}`}
                placeholder={"Step 1: Bring a large pot of salted water to a boil.\nStep 2: Cook pasta according to package directions.\nStep 3: ..."}
                value={form.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                rows={10}
              />
              {errors.instructions && <span className="field-error">{errors.instructions}</span>}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="cr-actions">
            <button className="cr-cancel-btn" onClick={() => navigate("/recipes")}>Cancel</button>
            <button className="cr-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="cr-spinner" /> Saving...</> : "Save Recipe ✓"}
            </button>
          </div>

        </div>

        {/* ── RIGHT: IMAGE + PREVIEW ── */}
        <div className="cr-preview-col">
          <div className="cr-card cr-sticky-card">
            <div className="cr-card-header">
              <span className="cr-card-icon">📸</span>
              <h2 className="cr-card-title">Recipe Image</h2>
            </div>

            <div
              className={`cr-image-drop ${imagePreview ? "has-image" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="cr-image-preview" />
              ) : (
                <div className="cr-image-placeholder">
                  <span className="cr-image-icon">🖼</span>
                  <p className="cr-image-hint">Click to upload image</p>
                  <p className="cr-image-sub">JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="cr-file-input"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <button
                className="cr-remove-image"
                onClick={() => setImagePreview(null)}
              >Remove Image</button>
            )}

            {form.name && (
              <div className="cr-live-preview">
                <p className="cr-preview-label">Live Preview</p>
                <div className="cr-preview-card">
                  <div className="cr-preview-img-wrap">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="cr-preview-img" />
                      : <div className="cr-preview-img-empty">🍽</div>
                    }
                    {form.category && <span className="cr-preview-tag">{form.category}</span>}
                  </div>
                  <div className="cr-preview-body">
                    <h4 className="cr-preview-name">{form.name}</h4>
                    <div className="cr-preview-meta">
                      {form.prepTime && <span>⏱ {form.prepTime} min</span>}
                      {form.servings && <span>👤 {form.servings}</span>}
                      {form.mood && <span>{MOODS.find((m) => m.value === form.mood)?.label}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
