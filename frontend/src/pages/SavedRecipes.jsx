import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import { API } from "../utils/api";
import "./savedrecipes.css";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Side", "Starter"];
const MOODS = [
  { value: "happy",     label: "😊 Happy" },
  { value: "stressed",  label: "😟 Stressed" },
  { value: "relaxed",   label: "😌 Relaxed" },
  { value: "energetic", label: "💪 Energetic" },
  { value: "tired",     label: "😴 Tired" },
];

export default function SavedRecipes() {
  const navigate = useNavigate();
  const { username } = useContext(MealContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── FETCH ──
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(API.getRecipes, {
            credentials: "include",
            headers: { "X-User-Id": localStorage.getItem("user_id") || "" }
        });
        const data = await res.json();
        if (data.success) setRecipes(data.recipes);
        else navigate("/login");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // ── DELETE ──
  const handleDelete = async (id) => {
    try {
      const res = await fetch(API.deleteRecipe, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": localStorage.getItem("user_id") || ""
            },
            credentials: "include",
            body: JSON.stringify({ id }),
        });
      const data = await res.json();
      if (data.success) setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // ── EDIT OPEN ──
  const openEdit = (recipe) => {
    setEditingId(recipe.id);
    setEditForm({
      name:         recipe.name,
      description:  recipe.description,
      category:     recipe.category,
      mood:         recipe.mood,
      prep_time:    recipe.prep_time,
      servings:     recipe.servings,
      instructions: recipe.instructions,
      ingredients:  recipe.ingredients || [],
      image:        recipe.image || null,
    });
  };

  // ── EDIT SAVE ──
  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(API.editRecipe, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": localStorage.getItem("user_id") || ""
            },
            credentials: "include",
            body: JSON.stringify({ id: editingId, ...editForm }),
        });
      const data = await res.json();
      if (data.success) {
        setRecipes((prev) =>
          prev.map((r) => r.id === editingId ? { ...r, ...editForm } : r)
        );
        setEditingId(null);
      } else {
        alert(data.message || "Failed to update.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateIngredient = (idx, field, value) => {
    setEditForm((prev) => {
      const updated = [...prev.ingredients];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  const addIngredient = () => {
    setEditForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }));
  };

  const removeIngredient = (idx) => {
    setEditForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }));
  };

  // ── RENDER ──
  if (loading) return (
    <div className="sr-page">
      <Navbar username={username} />
      <div className="sr-empty"><p>Loading your recipes...</p></div>
    </div>
  );

  return (
    <div className="sr-page">
      <Navbar username={username} />

      <div className="sr-header">
        <div>
          <p className="sr-eyebrow">Cook Orbit</p>
          <h1 className="sr-title">My Created Recipes</h1>
          <p className="sr-subtitle">Recipes you've created, saved to your account.</p>
        </div>
        <button className="sr-create-btn" onClick={() => navigate("/createrecipe")}>
          + Create New Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="sr-empty">
          <p className="sr-empty-icon">🍽</p>
          <p>You haven't created any recipes yet.</p>
          <button className="sr-create-btn" onClick={() => navigate("/createrecipe")}>
            Create your first recipe
          </button>
        </div>
      ) : (
        <div className="sr-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="sr-card">
              <div className="sr-img-wrap">
                {recipe.image
                  ? <img src={recipe.image} alt={recipe.name} className="sr-img" />
                  : <div className="sr-img-empty">🍽</div>
                }
                <span className="sr-category">{recipe.category}</span>
              </div>

              <div className="sr-card-body">
                <h3 className="sr-card-name">{recipe.name}</h3>
                <p className="sr-card-desc">{recipe.description}</p>
                <div className="sr-card-meta">
                  <span>⏱ {recipe.prep_time} min</span>
                  <span>👤 {recipe.servings} servings</span>
                  <span>{MOODS.find(m => m.value === recipe.mood)?.label || recipe.mood}</span>
                </div>
              </div>

              <div className="sr-card-actions">
                <button className="sr-edit-btn" onClick={() => openEdit(recipe)}>✏️ Edit</button>
                <button className="sr-delete-btn" onClick={() => setDeleteConfirmId(recipe.id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirmId && (
        <div className="sr-overlay">
          <div className="sr-modal">
            <h3>Delete Recipe?</h3>
            <p>This can't be undone.</p>
            <div className="sr-modal-actions">
              <button className="sr-delete-btn" onClick={() => handleDelete(deleteConfirmId)}>Yes, Delete</button>
              <button className="sr-cancel-btn" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingId && (
        <div className="sr-overlay">
          <div className="sr-modal sr-edit-modal">
            <h3>Edit Recipe</h3>

            <label>Name</label>
            <input className="sr-input" value={editForm.name}
              onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />

            <label>Description</label>
            <textarea className="sr-textarea" value={editForm.description}
              onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} />

            <div className="sr-edit-row">
              <div>
                <label>Category</label>
                <select className="sr-select" value={editForm.category}
                  onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Mood</label>
                <select className="sr-select" value={editForm.mood}
                  onChange={(e) => setEditForm(p => ({ ...p, mood: e.target.value }))}>
                  {MOODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            <div className="sr-edit-row">
              <div>
                <label>Prep Time (mins)</label>
                <input className="sr-input" type="number" value={editForm.prep_time}
                  onChange={(e) => setEditForm(p => ({ ...p, prep_time: e.target.value }))} />
              </div>
              <div>
                <label>Servings</label>
                <input className="sr-input" type="number" value={editForm.servings}
                  onChange={(e) => setEditForm(p => ({ ...p, servings: e.target.value }))} />
              </div>
            </div>

            <label>Instructions</label>
            <textarea className="sr-textarea tall" value={editForm.instructions}
              onChange={(e) => setEditForm(p => ({ ...p, instructions: e.target.value }))} />

            <label>Ingredients</label>
            {editForm.ingredients.map((ing, idx) => (
              <div key={idx} className="sr-ing-row">
                <input className="sr-input" placeholder="Ingredient"
                  value={ing.name} onChange={(e) => updateIngredient(idx, "name", e.target.value)} />
                <input className="sr-input" placeholder="Quantity"
                  value={ing.quantity} onChange={(e) => updateIngredient(idx, "quantity", e.target.value)} />
                <button className="sr-ing-remove" onClick={() => removeIngredient(idx)}>✕</button>
              </div>
            ))}
            <button className="sr-add-ing" onClick={addIngredient}>+ Add Ingredient</button>

            <div className="sr-modal-actions">
              <button className="sr-save-btn" onClick={handleEditSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="sr-cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}