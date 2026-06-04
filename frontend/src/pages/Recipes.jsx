import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import "./recipes.css";

export default function Recipes() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const moodQuery = queryParams.get("mood") || "";

  const { username, userRecipes = [] } = useContext(MealContext);
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "mine"
  const mealsPerPage = 12;

  const searchAliases = {
    "healthy":      ["Vegetarian", "Vegan", "Seafood", "Starter"],
    "comfort food": ["Pasta", "Beef", "Dessert", "Miscellaneous"],
  };

  const moodKeywords = {
    "stressed/anxious": ["chicken soup", "rice", "salmon", "oatmeal"],
    sad: ["chocolate", "pasta", "ice cream", "cake"],
    "tired/lazy": ["toast", "sandwich", "noodles", "eggs"],
    "happy/energetic": ["salad", "grilled chicken", "fruit", "smoothie"],
    hangry: ["beef", "burger", "fried chicken", "pizza"],
    bored: ["pasta", "tacos", "wrap", "dessert"],
  };

  const moodCategories = {
    "stressed/anxious": ["Seafood", "Chicken", "Pasta"],
    sad: ["Dessert", "Pasta", "Beef"],
    "tired/lazy": ["Pasta", "Breakfast", "Side"],
    "happy/energetic": ["Chicken", "Seafood", "Starter"],
    hangry: ["Beef", "Chicken", "Lamb"],
    bored: ["Pasta", "Miscellaneous", "Dessert"],
  };

  const allCategories = [
    "Beef", "Breakfast", "Chicken", "Dessert", "Goat", "Lamb",
    "Miscellaneous", "Pasta", "Pork", "Seafood", "Side",
    "Starter", "Vegan", "Vegetarian",
  ];

  const meat = ["chicken","beef","pork","fish","lamb","shrimp","crab","salmon","tuna","anchovy"];
  const dairyEgg = ["milk","cheese","butter","cream","egg","yogurt","mayonnaise","ghee"];
  const plant = ["rice","beans","lentils","tofu","potato","tomato","onion","garlic","spinach","broccoli","carrot","cabbage","peas","mushroom"];

  const moodLabels = {
    "stressed/anxious": "😰 Stressed / Anxious",
    sad: "😢 Sad",
    "tired/lazy": "😴 Tired / Lazy",
    "happy/energetic": "😊 Happy / Energetic",
    hangry: "😤 Hangry",
    bored: "😑 Bored",
  };

  const fetchInBatches = async (ids, batchSize = 10) => {
    const results = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (meal) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          const data = await res.json();
          const full = data.meals[0];
          const ingredients = [];
          for (let j = 1; j <= 20; j++) {
            const ing = full[`strIngredient${j}`];
            if (ing && ing.trim()) ingredients.push(ing.trim());
          }
          const ingredientCount = ingredients.length;
          const estimatedCookTime = ingredientCount <= 5 ? 15 : ingredientCount <= 10 ? 30 : 45;
          const estimatedCalories = ingredientCount * 80;
          const servings = ingredientCount <= 5 ? 1 : 2;
          let score = 60;
          ingredients.forEach((ing) => {
            const lower = ing.toLowerCase();
            meat.forEach((m) => { if (lower.includes(m)) score -= 35; });
            dairyEgg.forEach((d) => { if (lower.includes(d)) score -= 15; });
            plant.forEach((p) => { if (lower.includes(p)) score += 5; });
          });
          score = Math.max(0, Math.min(100, score));
          const tags = [];
          if (estimatedCookTime <= 20) { tags.push("Fast"); tags.push("Easy"); }
          if (score >= 65) tags.push("Vegetarian");
          if (ingredients.some((i) => ["spinach","beans","broccoli","lentils"].includes(i.toLowerCase()))) {
            tags.push("Nutrient Dense");
          }
          return {
            ...full, ingredients, estimatedCookTime, estimatedCalories, servings,
            protein: ingredientCount * 5, carbs: ingredientCount * 7, fat: ingredientCount * 3,
            vitamins: ["Vitamin A", "Vitamin C", "Iron"], vegetarianScore: score, tags,
          };
        })
      );
      results.push(...batchResults.filter((r) => r.status === "fulfilled").map((r) => r.value));
      if (i + batchSize < ids.length) await new Promise((r) => setTimeout(r, 150));
    }
    return results;
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setMeals([]);
      try {
        let detailed = [];

        if (searchQuery) {
          // check aliases first (e.g. "healthy", "comfort food")
          const alias = searchAliases[searchQuery.toLowerCase()];
          if (alias) {
            const aliasResults = await Promise.allSettled(
              alias.map((cat) =>
                fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`).then(r => r.json())
              )
            );
            const aliasCombined = aliasResults
              .filter(r => r.status === "fulfilled")
              .flatMap(r => r.value.meals || []);
            const aliasUnique = aliasCombined.filter((m, i, self) => i === self.findIndex((x) => x.idMeal === m.idMeal));
            detailed = await fetchInBatches(aliasUnique.slice(0, 60), 10);
            setMeals(detailed);
            setCurrentPage(1);
            setLoading(false);
            return;
          }

          // search by name AND by category simultaneously
          const [nameRes, catRes] = await Promise.allSettled([
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`).then(r => r.json()),
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchQuery}`).then(r => r.json()),
          ]);

          const nameMatches = nameRes.status === "fulfilled" ? (nameRes.value.meals || []) : [];
          const catMatches  = catRes.status  === "fulfilled" ? (catRes.value.meals  || []) : [];

          // combine and deduplicate
          const combined = [...nameMatches, ...catMatches];
          const unique = combined.filter((m, i, self) => i === self.findIndex((x) => x.idMeal === m.idMeal));

          // name search results already have full data, cat results need lookup
          const nameIds = new Set(nameMatches.map(m => m.idMeal));
          const needsLookup = unique.filter(m => !nameIds.has(m.idMeal));

          const lookedUp = await fetchInBatches(needsLookup, 10);

          // enrich name results with computed fields
          const enrichedNameMatches = nameMatches.map((meal) => {
            const ingredients = [];
            for (let j = 1; j <= 20; j++) {
              const ing = meal[`strIngredient${j}`];
              if (ing && ing.trim()) ingredients.push(ing.trim());
            }
            const ingredientCount = ingredients.length;
            const estimatedCookTime = ingredientCount <= 5 ? 15 : ingredientCount <= 10 ? 30 : 45;
            const estimatedCalories = ingredientCount * 80;
            let score = 60;
            ingredients.forEach((ing) => {
              const lower = ing.toLowerCase();
              meat.forEach((m) => { if (lower.includes(m)) score -= 35; });
              dairyEgg.forEach((d) => { if (lower.includes(d)) score -= 15; });
              plant.forEach((p) => { if (lower.includes(p)) score += 5; });
            });
            score = Math.max(0, Math.min(100, score));
            const tags = [];
            if (estimatedCookTime <= 20) { tags.push("Fast"); tags.push("Easy"); }
            if (score >= 65) tags.push("Vegetarian");
            return {
              ...meal, ingredients, estimatedCookTime, estimatedCalories,
              servings: ingredientCount <= 5 ? 1 : 2,
              protein: ingredientCount * 5, carbs: ingredientCount * 7, fat: ingredientCount * 3,
              vitamins: [], vegetarianScore: score, tags,
            };
          });

          detailed = [...enrichedNameMatches, ...lookedUp];

        } else {
          // no search — fetch all categories as before
          const categories = moodQuery ? moodCategories[moodQuery] || ["Chicken"] : allCategories;
          const results = await Promise.allSettled(
            categories.map((cat) =>
              fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`).then((r) => r.json())
            )
          );
          const combined = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value.meals || []);
          const unique = combined.filter((m, i, self) => i === self.findIndex((x) => x.idMeal === m.idMeal));
          const toFetch = moodQuery ? unique : unique.slice(0, 300);
          detailed = await fetchInBatches(toFetch, 10);

          if (moodQuery && moodKeywords[moodQuery]) {
            const keywords = moodKeywords[moodQuery];
            const moodFiltered = detailed.filter((meal) =>
              keywords.some((kw) => meal.strMeal.toLowerCase().includes(kw.toLowerCase()))
            );
            if (moodFiltered.length > 0) detailed = moodFiltered;
          }
        }

        setMeals(detailed);
        setCurrentPage(1);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [searchQuery, moodQuery]);

  // Also load from localStorage on mount (fallback when no context)
  const localUserRecipes = (() => {
    try { return JSON.parse(localStorage.getItem("userRecipes") || "[]"); } catch { return []; }
  })();

  const allUserRecipes = [
    ...userRecipes,
    ...localUserRecipes.filter((lr) => !userRecipes.find((ur) => ur.idMeal === lr.idMeal)),
  ];

  // Build display list based on active tab
  const baseList = activeTab === "mine" ? allUserRecipes : [...allUserRecipes, ...meals];

  let sorted = [...baseList];
  if (sortType === "fastest") sorted.sort((a, b) => a.estimatedCookTime - b.estimatedCookTime);
  if (sortType === "calories") sorted.sort((a, b) => a.estimatedCalories - b.estimatedCalories);
  if (sortType === "vegetarian") sorted.sort((a, b) => b.vegetarianScore - a.vegetarianScore);

  const totalPages = Math.ceil(sorted.length / mealsPerPage);
  const paginated = sorted.slice((currentPage - 1) * mealsPerPage, currentPage * mealsPerPage);

  const maxVisible = 10;
  const startPage = Math.floor((currentPage - 1) / maxVisible) * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const tagColors = {
    Fast: "tag-fast", Easy: "tag-easy",
    Vegetarian: "tag-vegetarian", "Nutrient Dense": "tag-nutrient",
  };

  const displayCount = activeTab === "mine" ? allUserRecipes.length : meals.length;

  return (
    <div className="recipes-page">
      <Navbar username={username} />

      {/* ── PAGE HEADER ── */}
      <div className="recipes-header">
        <div className="recipes-header-left">
          <p className="recipes-eyebrow">
            {moodQuery ? moodLabels[moodQuery] : "All Recipes"}
          </p>
          <h1 className="recipes-title">
            {searchQuery ? `Results for "${searchQuery}"` : "Recipe Explorer"}
          </h1>
          {!loading && displayCount > 0 && (
            <p className="recipes-count">{displayCount} recipes found</p>
          )}
        </div>

        <div className="recipes-controls">
          <button
            className="create-recipe-btn"
            onClick={() => navigate("/createrecipe")}
          >
            ✏️ Create Recipe
          </button>

          <select
            className="recipes-select"
            value={sortType}
            onChange={(e) => { setSortType(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Sort by</option>
            <option value="fastest">⏱ Fastest</option>
            <option value="calories">🔥 Lowest Calories</option>
            <option value="vegetarian">🌱 Most Vegetarian</option>
          </select>

          <select
            className="recipes-select"
            value={moodQuery}
            onChange={(e) => {
              const selected = e.target.value;
              const params = new URLSearchParams();
              if (searchQuery) params.set("search", searchQuery);
              if (selected) params.set("mood", selected);
              navigate(`/recipes?${params.toString()}`);
            }}
          >
            <option value="">All Moods</option>
            <option value="stressed/anxious">😰 Stressed / Anxious</option>
            <option value="sad">😢 Sad</option>
            <option value="tired/lazy">😴 Tired / Lazy</option>
            <option value="happy/energetic">😊 Happy / Energetic</option>
            <option value="hangry">😤 Hangry</option>
            <option value="bored">😑 Bored</option>
          </select>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="recipes-tabs">
        <button
          className={`recipes-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
        >All Recipes</button>
        <button
          className={`recipes-tab ${activeTab === "mine" ? "active" : ""}`}
          onClick={() => { setActiveTab("mine"); setCurrentPage(1); }}
        >
          My Recipes
          {allUserRecipes.length > 0 && (
            <span className="tab-badge">{allUserRecipes.length}</span>
          )}
        </button>
      </div>

      {/* ── LOADING ── */}
      {loading && activeTab === "all" && (
        <div className="recipes-loading">
          <div className="loading-spinner" />
          <p>Finding recipes for you...</p>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && sorted.length === 0 && (
        <div className="recipes-empty">
          <span className="empty-icon">{activeTab === "mine" ? "✏️" : "🍽"}</span>
          <h3>{activeTab === "mine" ? "No recipes created yet" : "No recipes found"}</h3>
          <p>
            {activeTab === "mine"
              ? "Click \"Create Recipe\" to add your first recipe!"
              : "Try adjusting your search or mood filter."}
          </p>
          {activeTab === "mine" && (
            <button className="create-recipe-btn" style={{ marginTop: 16 }} onClick={() => navigate("/createrecipe")}>
              ✏️ Create Your First Recipe
            </button>
          )}
        </div>
      )}

      {/* ── GRID ── */}
      {!loading && paginated.length > 0 && (
        <div className="recipes-grid">
          {paginated.map((meal) => (
            <div
              key={meal.idMeal}
              className={`recipe-card ${meal.isUserCreated ? "user-created-card" : ""}`}
              onClick={() => navigate(`/recipe/${meal.idMeal}`, { state: { recipe: meal } })}
            >
              <div className="recipe-card-img-wrap">
                <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-card-img" />
                <div className="recipe-card-tags">
                  {meal.isUserCreated && (
                    <span className="recipe-tag tag-user">My Recipe</span>
                  )}
                  {(meal.tags || []).map((tag) => (
                    <span key={tag} className={`recipe-tag ${tagColors[tag] || ""}`}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{meal.strMeal}</h3>

                <div className="recipe-card-meta">
                  <span className="meta-item">⏱ {meal.estimatedCookTime} min</span>
                  <span className="meta-dot" />
                  <span className="meta-item">🔥 {meal.estimatedCalories} kcal</span>
                  <span className="meta-dot" />
                  <span className="meta-item">👤 {meal.servings}</span>
                </div>

                <div className="recipe-card-macros">
                  <div className="macro">
                    <span className="macro-val">{meal.protein}g</span>
                    <span className="macro-label">Protein</span>
                  </div>
                  <div className="macro">
                    <span className="macro-val">{meal.carbs}g</span>
                    <span className="macro-label">Carbs</span>
                  </div>
                  <div className="macro">
                    <span className="macro-val">{meal.fat}g</span>
                    <span className="macro-label">Fat</span>
                  </div>
                  <div className="macro">
                    <span className="macro-val">{meal.vegetarianScore}</span>
                    <span className="macro-label">Veg Score</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>❮</button>
          {startPage > 1 && (<><button className="page-btn" onClick={() => setCurrentPage(1)}>1</button><span className="page-ellipsis">…</span></>)}
          {visiblePages.map((page) => (
            <button key={page} className={`page-btn ${currentPage === page ? "page-active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          {endPage < totalPages && (<><span className="page-ellipsis">…</span><button className="page-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button></>)}
          <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>❯</button>
        </div>
      )}
    </div>
  );
}
