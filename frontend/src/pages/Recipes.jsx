import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";

export default function Recipes() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const moodQuery = queryParams.get("mood") || "";

  const { username } = useContext(MealContext);
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const mealsPerPage = 12;

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

  const meat = [
    "chicken", "beef", "pork", "fish", "lamb", "shrimp",
    "crab", "salmon", "tuna", "anchovy",
  ];

  const dairyEgg = [
    "milk", "cheese", "butter", "cream", "egg",
    "yogurt", "mayonnaise", "ghee",
  ];

  const plant = [
    "rice", "beans", "lentils", "tofu", "potato", "tomato",
    "onion", "garlic", "spinach", "broccoli", "carrot",
    "cabbage", "peas", "mushroom",
  ];

  const fetchInBatches = async (ids, batchSize = 10) => {
    const results = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (meal) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
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
          if (ingredients.some((i) =>
            ["spinach", "beans", "broccoli", "lentils"].includes(i.toLowerCase())
          )) {
            tags.push("Nutrient Dense");
          }

          return {
            ...full,
            ingredients,
            estimatedCookTime,
            estimatedCalories,
            servings,
            protein: ingredientCount * 5,
            carbs: ingredientCount * 7,
            fat: ingredientCount * 3,
            vitamins: ["Vitamin A", "Vitamin C", "Iron"],
            vegetarianScore: score,
            tags,
          };
        })
      );
      results.push(
        ...batchResults.filter((r) => r.status === "fulfilled").map((r) => r.value)
      );
      if (i + batchSize < ids.length) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
    return results;
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setMeals([]);
      try {
        const categories = moodQuery
          ? moodCategories[moodQuery] || ["Chicken"]
          : allCategories;

        const results = await Promise.allSettled(
          categories.map((cat) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then((res) => res.json())
          )
        );

        const combined = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value.meals || []);

        const unique = combined.filter(
          (m, i, self) => i === self.findIndex((x) => x.idMeal === m.idMeal)
        );

        const toFetch = moodQuery ? unique : unique.slice(0, 300);

        const detailed = await fetchInBatches(toFetch, 10);

        let filteredMeals = detailed;

        if (searchQuery) {
          filteredMeals = filteredMeals.filter((meal) =>
            meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (moodQuery && moodKeywords[moodQuery]) {
          const keywords = moodKeywords[moodQuery];
          const moodFiltered = filteredMeals.filter((meal) =>
            keywords.some((kw) =>
              meal.strMeal.toLowerCase().includes(kw.toLowerCase())
            )
          );
          if (moodFiltered.length > 0) filteredMeals = moodFiltered;
        }

        setMeals(filteredMeals);
        setCurrentPage(1);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [searchQuery, moodQuery]);

  let sorted = [...meals];
  if (sortType === "fastest") sorted.sort((a, b) => a.estimatedCookTime - b.estimatedCookTime);
  if (sortType === "calories") sorted.sort((a, b) => a.estimatedCalories - b.estimatedCalories);
  if (sortType === "vegetarian") sorted.sort((a, b) => b.vegetarianScore - a.vegetarianScore);

  const totalPages = Math.ceil(sorted.length / mealsPerPage);
  const paginated = sorted.slice((currentPage - 1) * mealsPerPage, currentPage * mealsPerPage);

  const maxVisible = 10;
  const startPage = Math.floor((currentPage - 1) / maxVisible) * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div>
      <Navbar username={username} />

      <div style={{ padding: 20 }}>
        <h1>Recipes</h1>

        <select value={sortType} onChange={(e) => { setSortType(e.target.value); setCurrentPage(1); }}>
          <option value="">Sort Recipes</option>
          <option value="fastest">Fastest</option>
          <option value="calories">Lowest Calories</option>
          <option value="vegetarian">Most Vegetarian-Friendly</option>
        </select>

        <select
          value={moodQuery}
          onChange={(e) => {
            const selected = e.target.value;
            const params = new URLSearchParams();
            if (searchQuery) params.set("search", searchQuery);
            if (selected) params.set("mood", selected);
            navigate(`/recipes?${params.toString()}`);
          }}
          style={{ marginLeft: 10 }}
        >
          <option value="">All Moods</option>
          <option value="stressed/anxious">Stressed / Anxious</option>
          <option value="sad">Sad</option>
          <option value="tired/lazy">Tired / Lazy</option>
          <option value="happy/energetic">Happy / Energetic</option>
          <option value="hangry">Hangry</option>
          <option value="bored">Bored</option>
        </select>
      </div>

      {loading && (
        <p style={{ textAlign: "center", padding: 40 }}>Loading recipes...</p>
      )}

      {!loading && meals.length === 0 && (
        <p style={{ textAlign: "center", padding: 40 }}>
          No recipes found. Try again or adjust your search.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, padding: 20 }}>
        {paginated.map((meal) => (
          <div
            key={meal.idMeal}
            onClick={() => navigate(`/recipe/${meal.idMeal}`, { state: { recipe: meal } })}
            style={{ border: "1px solid #ccc", padding: 15, cursor: "pointer" }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                {meal.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{ background: "rgba(128,128,128,0.75)", padding: "2px 6px", fontSize: 12, color: "white" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h3>{meal.strMeal}</h3>
            <p>Estimated Calories: {meal.estimatedCalories}</p>
            <p>Estimated Cook Time: {meal.estimatedCookTime} mins</p>
            <p>Vegetarian Score: {meal.vegetarianScore}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: 20, flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            ❮
          </button>

          {startPage > 1 && (
            <>
              <button onClick={() => setCurrentPage(1)} style={{ padding: "6px 12px", cursor: "pointer" }}>1</button>
              <span>…</span>
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: currentPage === page ? "bold" : "normal",
                background: currentPage === page ? "#333" : "white",
                color: currentPage === page ? "white" : "black",
                border: "1px solid #ccc",
              }}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              <span>…</span>
              <button onClick={() => setCurrentPage(totalPages)} style={{ padding: "6px 12px", cursor: "pointer" }}>
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}