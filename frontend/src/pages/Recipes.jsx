import { useEffect, useState, useContext } from "react";
import { MealContext } from "../context/MealContext";

export default function Recipes() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;

  const { addMeal } = useContext(MealContext);

  // FETCH MORE RECIPES (categories)
  useEffect(() => {
    const categories = ["Chicken", "Beef", "Seafood", "Vegetarian"];

    Promise.all(
      categories.map((cat) =>
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
        ).then((res) => res.json())
      )
    ).then((results) => {
      const combined = results.flatMap((r) => r.meals || []);
      setMeals(combined);
    });
  }, []);

  // OPEN FULL RECIPE (FIXED: lookup API)
  const openMeal = async (meal) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
    );

    const data = await res.json();
    setSelectedMeal(data.meals[0]);
  };

  const handleAdd = (meal) => {
    addMeal({
      name: meal.strMeal,
      mood: "Happy",
    });
  };

  // PAGINATION LOGIC
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);

  const totalPages = Math.ceil(meals.length / mealsPerPage);

  // WINDOWED PAGINATION (10 pages at a time)
  const pageWindowSize = 10;

  const startPage =
    Math.floor((currentPage - 1) / pageWindowSize) * pageWindowSize + 1;

  const endPage = Math.min(startPage + pageWindowSize - 1, totalPages);

  return (
    <div>
      <h1>Recipes</h1>

      {/* LIST */}
      {currentMeals.map((meal) => (
        <div
          key={meal.idMeal}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{meal.strMeal}</h3>

          <img src={meal.strMealThumb} width="150" />

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => openMeal(meal)}>
              View Recipe
            </button>

            <button
              onClick={() => handleAdd(meal)}
              style={{ marginLeft: "10px" }}
            >
              Add to Calendar
            </button>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        {/* PREV WINDOW */}
        <button
          onClick={() =>
            setCurrentPage(Math.max(startPage - pageWindowSize, 1))
          }
          disabled={startPage === 1}
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => {
            const pageNumber = startPage + index;

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  margin: "5px",
                  padding: "5px 10px",
                  backgroundColor:
                    currentPage === pageNumber ? "black" : "white",
                  color:
                    currentPage === pageNumber ? "white" : "black",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                {pageNumber}
              </button>
            );
          }
        )}

        {/* NEXT WINDOW */}
        <button
          onClick={() =>
            setCurrentPage(
              Math.min(startPage + pageWindowSize, totalPages)
            )
          }
          disabled={endPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedMeal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setSelectedMeal(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "80%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedMeal(null)}>
              Close
            </button>

            <h2>{selectedMeal.strMeal}</h2>

            <img src={selectedMeal.strMealThumb} width="200" />

            <button
              onClick={() => handleAdd(selectedMeal)}
              style={{ display: "block", margin: "10px 0" }}
            >
              Add to Calendar
            </button>

            {/* INGREDIENTS */}
            <h3>Ingredients</h3>
            <ul>
              {Array.from({ length: 20 }).map((_, i) => {
                const ingredient =
                  selectedMeal[`strIngredient${i + 1}`];
                const measure =
                  selectedMeal[`strMeasure${i + 1}`];

                return (
                  ingredient &&
                  ingredient.trim() && (
                    <li key={i}>
                      {ingredient} - {measure}
                    </li>
                  )
                );
              })}
            </ul>

            {/* INSTRUCTIONS */}
            <h3>Instructions</h3>
            <p>{selectedMeal.strInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}