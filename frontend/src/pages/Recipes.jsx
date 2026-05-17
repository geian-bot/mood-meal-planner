import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";

export default function Recipes() {
  const { addMeal, selectedMood, username } =
    useContext(MealContext);

  const [meals, setMeals] = useState([]);
  const [popup, setPopup] = useState("");
  const [selectedRecipe, setSelectedRecipe] =
    useState(null);

  const [sortType, setSortType] = useState("");

  // MOOD -> CATEGORY MAPPING
  const moodCategories = {
    Happy: ["Dessert", "Beef", "Chicken"],

    Stressed: ["Seafood", "Pasta", "Starter"],

    Lazy: ["Pasta", "Breakfast", "Side"],

    Energetic: ["Chicken", "Seafood", "Beef"],
  };

  // FETCH RECIPES
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const categories =
          moodCategories[selectedMood] || ["Chicken"];

        const results = await Promise.all(
          categories.map((category) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
            ).then((res) => res.json())
          )
        );

        const combinedMeals = results.flatMap(
          (result) => result.meals || []
        );

        // REMOVE DUPLICATES
        const uniqueMeals = combinedMeals.filter(
          (meal, index, self) =>
            index ===
            self.findIndex(
              (m) => m.idMeal === meal.idMeal
            )
        );

        // FETCH FULL DETAILS
        const detailedMeals = await Promise.all(
          uniqueMeals.map(async (meal) => {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );

            const data = await res.json();

            const fullMeal = data.meals[0];

            // INGREDIENT COUNT
            const ingredients = [];

            for (let i = 1; i <= 20; i++) {
              const ingredient =
                fullMeal[`strIngredient${i}`];

              if (
                ingredient &&
                ingredient.trim()
              ) {
                ingredients.push(ingredient);
              }
            }

            const ingredientCount =
              ingredients.length;

            // ESTIMATED VALUES
            const cookTime =
              ingredientCount <= 5
                ? 15
                : ingredientCount <= 10
                ? 30
                : 45;

            const calories =
              ingredientCount * 80;

            const servings =
              ingredientCount <= 5 ? 1 : 2;

            const tags = [];

            // TAGS
            if (cookTime <= 20) {
              tags.push("Fast");
              tags.push("Easy");
            }

            if (
              fullMeal.strCategory === "Chicken" ||
              fullMeal.strCategory ===
                "Seafood" ||
              fullMeal.strCategory ===
                "Vegetarian"
            ) {
              tags.push("Healthy");
            }

            if (
              ingredients.some((i) =>
                [
                  "Spinach",
                  "Salmon",
                  "Egg",
                  "Beans",
                  "Broccoli",
                ].includes(i)
              )
            ) {
              tags.push("Nutrient Dense");
            }

            return {
              ...fullMeal,
              ingredients,
              cookTime,
              calories,
              servings,
              protein:
                ingredientCount * 5,
              carbs:
                ingredientCount * 7,
              fat:
                ingredientCount * 3,
              vitamins: [
                "Vitamin A",
                "Vitamin C",
                "Iron",
              ],
              tags,
            };
          })
        );

        // SHUFFLE
        const shuffled =
          detailedMeals.sort(
            () => Math.random() - 0.5
          );

        setMeals(shuffled);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeals();
  }, [selectedMood]);

  // ADD TO CALENDAR
  const addToCalendar = (meal) => {
    addMeal({
      name: meal.strMeal,
      mood: selectedMood,
    });

    setPopup(
      "Recipe added to your calendar"
    );

    setTimeout(() => {
      setPopup("");
    }, 2000);
  };

  // SORTING
  const sortedMeals = [...meals];

  if (sortType === "fastest") {
    sortedMeals.sort(
      (a, b) => a.cookTime - b.cookTime
    );
  }

  if (sortType === "calories") {
    sortedMeals.sort(
      (a, b) => a.calories - b.calories
    );
  }

  if (sortType === "healthy") {
    sortedMeals.sort(
      (a, b) =>
        b.tags.includes("Healthy") -
        a.tags.includes("Healthy")
    );
  }

  return (
    <div>
      <Navbar username={username} />

      {/* TOAST */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            border: "1px solid #ccc",
            padding: 10,
            zIndex: 999,
          }}
        >
          {popup}
        </div>
      )}

      {/* HEADER */}
      <div style={{ padding: 20 }}>
        <h1>Recipes</h1>

        {selectedMood && (
          <h3>
            Showing recipes for:{" "}
            {selectedMood}
          </h3>
        )}

        {/* SORT */}
        <select
          value={sortType}
          onChange={(e) =>
            setSortType(e.target.value)
          }
        >
          <option value="">
            Sort Recipes
          </option>

          <option value="fastest">
            Fastest to Make
          </option>

          <option value="calories">
            Lowest Calories
          </option>

          <option value="healthy">
            Healthiest
          </option>
        </select>
      </div>

      {/* RECIPES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          padding: 20,
        }}
      >
        {sortedMeals.map((meal) => (
          <div
            key={meal.idMeal}
            style={{
              border: "1px solid #ccc",
              padding: 15,
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                position: "relative",
              }}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setSelectedRecipe(meal)
                }
              />

              {/* TAGS */}
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
                      border:
                        "1px solid #ccc",
                      padding:
                        "2px 6px",
                      fontSize: 12,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h3>{meal.strMeal}</h3>

            <p>
              Estimated Calories: {meal.calories} cal
            </p>

            <p>
              Estimated Cook Time: {meal.cookTime} mins
            </p>

            <button
              onClick={() =>
                addToCalendar(meal)
              }
            >
              Add to Calendar
            </button>
          </div>
        ))}
      </div>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
          }}
          onClick={() =>
            setSelectedRecipe(null)
          }
        >
          <div
            style={{
              border: "1px solid #ccc",
              padding: 30,
              width: "80%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              onClick={() =>
                setSelectedRecipe(null)
              }
            >
              Close
            </button>

            <h1>
              {selectedRecipe.strMeal}
            </h1>

            <img
              src={
                selectedRecipe.strMealThumb
              }
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
              }}
            />

            <h2>Nutrition Facts</h2>

            <p>
              Calories:{" "}
              {selectedRecipe.calories}
            </p>

            <p>
              Protein:{" "}
              {selectedRecipe.protein}g
            </p>

            <p>
              Carbs: {selectedRecipe.carbs}g
            </p>

            <p>
              Fat: {selectedRecipe.fat}g
            </p>

            <p>
              Servings:{" "}
              {selectedRecipe.servings}
            </p>

            <p>
              Cook Time:{" "}
              {selectedRecipe.cookTime} mins
            </p>

            <h3>Vitamins & Minerals</h3>

            <ul>
              {selectedRecipe.vitamins.map(
                (v) => (
                  <li key={v}>{v}</li>
                )
              )}
            </ul>

            <h2>Ingredients</h2>

            <ul>
              {selectedRecipe.ingredients.map(
                (ingredient, index) => (
                  <li key={index}>
                    {ingredient}
                  </li>
                )
              )}
            </ul>

            <h2>Instructions</h2>

            <p>
              {
                selectedRecipe.strInstructions
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}