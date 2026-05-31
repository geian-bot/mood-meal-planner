import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import { useLocation } from "react-router-dom";

export default function Recipes() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const { selectedMood, username } = useContext(MealContext);

  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [sortType, setSortType] = useState("");

  const moodCategories = {
    Happy: ["Dessert", "Beef", "Chicken"],
    Stressed: ["Seafood", "Pasta", "Starter"],
    Lazy: ["Pasta", "Breakfast", "Side"],
    Energetic: ["Chicken", "Seafood", "Beef"],
  };

  const meat = [
    "chicken",
    "beef",
    "pork",
    "fish",
    "lamb",
    "shrimp",
    "crab",
    "salmon",
    "tuna",
    "anchovy",
  ];

  const dairyEgg = [
    "milk",
    "cheese",
    "butter",
    "cream",
    "egg",
    "yogurt",
    "mayonnaise",
    "ghee",
  ];

  const plant = [
    "rice",
    "beans",
    "lentils",
    "tofu",
    "potato",
    "tomato",
    "onion",
    "garlic",
    "spinach",
    "broccoli",
    "carrot",
    "cabbage",
    "peas",
    "mushroom",
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const categories =
          moodCategories[selectedMood] || ["Chicken"];

        const results = await Promise.all(
          categories.map((cat) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
            ).then((res) => res.json())
          )
        );

        const combined = results.flatMap(
          (r) => r.meals || []
        );

        const unique = combined.filter(
          (m, i, self) =>
            i === self.findIndex(x => x.idMeal === m.idMeal)
        );

        const detailed = await Promise.all(
          unique.map(async (meal) => {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );

            const data = await res.json();
            const full = data.meals[0];

            const ingredients = [];

            for (let i = 1; i <= 20; i++) {
              const ing = full[`strIngredient${i}`];
              if (ing && ing.trim()) {
                ingredients.push(ing.trim());
              }
            }

            const ingredientCount = ingredients.length;

            const estimatedCookTime =
              ingredientCount <= 5
                ? 15
                : ingredientCount <= 10
                ? 30
                : 45;

            const estimatedCalories =
              ingredientCount * 80;

            const servings =
              ingredientCount <= 5 ? 1 : 2;

            // VEGETARIAN SCORE SYSTEM
            let score = 60;

            ingredients.forEach((ing) => {
              const lower = ing.toLowerCase();

              meat.forEach((m) => {
                if (lower.includes(m)) {
                  score -= 35;
                }
              });

              dairyEgg.forEach((d) => {
                if (lower.includes(d)) {
                  score -= 15;
                }
              });

              plant.forEach((p) => {
                if (lower.includes(p)) {
                  score += 5;
                }
              });
            });

            score = Math.max(0, Math.min(100, score));

            const isVegetarian = score >= 65;

            const tags = [];

            if (estimatedCookTime <= 20) {
              tags.push("Fast");
              tags.push("Easy");
            }

            if (isVegetarian) {
              tags.push("Vegetarian");
            }

            if (
              ingredients.some((i) =>
                ["spinach", "beans", "broccoli", "lentils"].includes(
                  i.toLowerCase()
                )
              )
            ) {
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

        let filteredMeals = detailed;

        if (searchQuery) {
          filteredMeals = detailed.filter((meal) =>
            meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setMeals(filteredMeals);

        setMeals(detailed);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMeals();
  }, [selectedMood]);

  let sorted = [...meals];

  if (sortType === "fastest") {
    sorted.sort((a, b) => a.estimatedCookTime - b.estimatedCookTime);
  }

  if (sortType === "calories") {
    sorted.sort((a, b) => a.estimatedCalories - b.estimatedCalories);
  }

  // DESCENDING ORDER (MOST VEGETARIAN FIRST)
  if (sortType === "vegetarian") {
    sorted.sort((a, b) => b.vegetarianScore - a.vegetarianScore);
  }

  return (
    <div>
      <Navbar username={username} />

      <div style={{ padding: 20 }}>
        <h1>Recipes</h1>

        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="">Sort Recipes</option>
          <option value="fastest">Fastest</option>
          <option value="calories">Lowest Calories</option>
          <option value="vegetarian">Most Vegetarian-Friendly</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          padding: 20,
        }}
      >
        {sorted.map((meal) => (
          <div
            key={meal.idMeal}
            onClick={() =>
              navigate(`/recipe/${meal.idMeal}`, {
                state: { recipe: meal },
              })
            }
            style={{
              border: "1px solid #ccc",
              padding: 15,
              cursor: "pointer",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {meal.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(128,128,128,0.75)",
                      padding: "2px 6px",
                      fontSize: 12,
                      color: "white",
                    }}
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
    </div>
  );
}