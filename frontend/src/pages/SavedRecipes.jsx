import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import { API } from "../utils/api";
import "./savedrecipes.css";

export default function SavedRecipes() {
  const navigate = useNavigate();
  const { username } = useContext(MealContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const user_id = localStorage.getItem("user_id");

      // ── GUEST MODE ──
      if (!user_id) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API.getBookmarks, {
          credentials: "include",
          headers: { "X-User-Id": user_id }
        });

        const data = await res.json();

        if (data.success) {
          setBookmarks(data.bookmarks);
        } else {
          setBookmarks([]);
        }

      } catch (err) {
        console.error(err);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleUnsave = async (recipe_id) => {
    const user_id = localStorage.getItem("user_id");
    try {
      await fetch(API.deleteBookmark, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": user_id },
        credentials: "include",
        body: JSON.stringify({ recipe_id }),
      });
      setBookmarks((prev) => prev.filter((b) => b.recipe_id !== recipe_id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="sr-page">
      <Navbar username={username} />
      <div className="sr-empty"><p>Loading saved recipes...</p></div>
    </div>
  );

  return (
    <div className="sr-page">
      <Navbar username={username} />

      <div className="sr-header">
        <div>
          <p className="sr-eyebrow">Cook Orbit</p>
          <h1 className="sr-title">Saved Recipes</h1>
          <p className="sr-subtitle">Recipes you've bookmarked from the collection.</p>
        </div>
        <button className="sr-create-btn" onClick={() => navigate("/recipes")}>
          Browse Recipes
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="sr-empty">
          <p className="sr-empty-icon">🔖</p>
          <p>You haven't saved any recipes yet.</p>
          <button className="sr-create-btn" onClick={() => navigate("/recipes")}>
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="sr-grid">
          {bookmarks.map((b) => (
            <div key={b.recipe_id} className="sr-card">
              <div className="sr-img-wrap">
                {b.recipe_thumb
                  ? <img src={b.recipe_thumb} alt={b.recipe_name} className="sr-img" />
                  : <div className="sr-img-empty">🍽</div>
                }
                {b.recipe_category && <span className="sr-category">{b.recipe_category}</span>}
              </div>
              <div className="sr-card-body">
                <h3 className="sr-card-name">{b.recipe_name}</h3>
              </div>
              <div className="sr-card-actions">
                <button className="sr-edit-btn"
                  onClick={() => navigate(`/recipe/${b.recipe_id}`)}>
                  👁 View
                </button>
                <button className="sr-delete-btn" onClick={() => handleUnsave(b.recipe_id)}>
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}