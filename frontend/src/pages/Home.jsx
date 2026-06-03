import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./home.css";
import logo from "../assets/cook-orbit.png";

export default function Home() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [quickMeals, setQuickMeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mood, setMood] = useState("");
  const [search, setSearch] = useState("");

  const moodMap = {
    "stressed/anxious": ["chicken soup", "rice", "salmon", "oatmeal"],
    sad: ["chocolate", "pasta", "ice cream", "cake"],
    "tired/lazy": ["toast", "sandwich", "noodles", "eggs"],
    "happy/energetic": ["salad", "grilled chicken", "fruit", "smoothie"],
    hangry: ["beef", "burger", "fried chicken", "pizza"],
    bored: ["pasta", "tacos", "wrap", "dessert"],
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    const query = mood
      ? `/recipes?search=${search}&mood=${mood}`
      : `/recipes?search=${search}`;
    navigate(query);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        const data = await res.json();
        const randomMeals = data.meals.sort(() => Math.random() - 0.5).slice(0, 6);
        setMeals(randomMeals);
      } catch (err) {
        // API unavailable, show nothing
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    const fetchQuickMeals = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast`);
        const data = await res.json();
        const mealsWithTime = data.meals
          .slice(0, 12)
          .map((meal) => ({
            ...meal,
            cookTime: Math.floor(Math.random() * 25) + 10,
          }))
          .sort((a, b) => a.cookTime - b.cookTime);
        setQuickMeals(mealsWithTime);
      } catch (err) {
        // API unavailable, show nothing
      }
    };

    fetchQuickMeals();
  }, []);

  const nextMeals = () => {
    if (currentIndex + 4 < quickMeals.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const prevMeals = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/recipes?search=${tag}`);
  };

  return (
    <div className="home">

      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-wrapper">

        {/* SCROLLING BACKGROUND */}
        <div className="scroll-wrapper">
          <div className="scroll-track">
            {meals.concat(meals).map((meal, index) => (
              <img
                key={index}
                src={meal.strMealThumb}
                alt=""
                className="scroll-img"
              />
            ))}
          </div>
        </div>

        {/* DARK OVERLAY */}
        <div className="hero-overlay"></div>

        {/* HERO CONTENT */}
        <div className="hero">

          <h1>What's your mood today?</h1>

          <div className="hero-search">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search meals for your mood..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <select
              value={mood}
              onChange={(e) => {
                const selected = e.target.value;
                setMood(selected);
                if (selected) {
                  navigate(`/recipes?mood=${selected}`);
                }
              }}
            >
              <option value="">Mood</option>
              <option value="stressed/anxious">Stressed / Anxious</option>
              <option value="sad">Sad</option>
              <option value="tired/lazy">Tired / Lazy</option>
              <option value="happy/energetic">Happy / Energetic</option>
              <option value="hangry">Hangry</option>
              <option value="bored">Bored</option>
            </select>

          </div>

          <div className="popular-tags">
            <span onClick={() => handleTagClick("chicken")}>Chicken</span>
            <span onClick={() => handleTagClick("pasta")}>Pasta</span>
            <span onClick={() => handleTagClick("dessert")}>Dessert</span>
            <span onClick={() => handleTagClick("healthy")}>Healthy</span>
            <span onClick={() => handleTagClick("comfort food")}>Comfort Food</span>
          </div>

        </div>

      </section>

      <section className="about-section">

        <div className="about-content">

          <img src={logo} alt="Cook Orbit" className="about-logo" />

          <div className="about-text">

            <h2>Cook Orbit</h2>

            <p>
              The Mood-Based Meal Planner with Nutrition Tracking helps you organize
              your daily, weekly, or monthly meals using an interactive calendar
              while considering how you feel. Whether you're happy, stressed,
              tired, or energized, the system suggests meals that match your mood
              and lifestyle.
            </p>

            <button
              className="start-btn"
              onClick={() => {
                const savedUser = localStorage.getItem("username");

                if (savedUser) {
                  navigate("/calendar");
                } else {
                  navigate("/login");
                }
              }}
            >
              Start Planning!
            </button>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section">

        <h2>What we can offer:</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>📅 Smart Meal Calendar</h3>
            <p>Plan your meals daily, weekly, or monthly using an interactive calendar. Easily add, edit, or organize meals for better food planning.</p>
          </div>

          <div className="feature-card">
            <h3>😊 Mood-Based Suggestions</h3>
            <p>Get meal recommendations based on your current mood—whether you're happy, stressed, tired, or energetic.</p>
          </div>

          <div className="feature-card">
            <h3>🍽️ Recipe Explorer</h3>
            <p>Search and browse recipes from an integrated API or add your own custom meals with full instructions and ingredients.</p>
          </div>

          <div className="feature-card">
            <h3>🔥 Nutrition Tracking</h3>
            <p>Automatically calculate calories, protein, carbohydrates, and fats for every meal.</p>
          </div>

          <div className="feature-card">
            <h3>🔎 Smart Search & Filters</h3>
            <p>Quickly find meals based on type, mood, calories, or dietary preferences.</p>
          </div>

          <div className="feature-card">
            <h3>👤 Personal Meal Profile</h3>
            <p>Save your favorite recipes, track meal history, and manage your personalized experience.</p>
          </div>

        </div>

      </section>

      {/* QUICK MEALS */}
      <section className="quick-meals-section">

        <h2>Get started with these quick and easy meals!</h2>

        <div className="meal-carousel">

          <button
            className={`carousel-btn ${currentIndex === 0 ? "disabled-btn" : ""}`}
            onClick={prevMeals}
            disabled={currentIndex === 0}
          >
            ❮
          </button>

          <div className="meal-cards">
            {quickMeals.slice(currentIndex, currentIndex + 4).map((meal) => (
              <div
                key={meal.idMeal}
                className="meal-card"
                onClick={() => navigate(`/recipe/${meal.idMeal}`)}
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <div className="meal-overlay">
                  <h3>{meal.strMeal}</h3>
                  <p>⏱ {meal.cookTime} mins</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`carousel-btn ${currentIndex + 4 >= quickMeals.length ? "disabled-btn" : ""}`}
            onClick={nextMeals}
            disabled={currentIndex + 4 >= quickMeals.length}
          >
            ❯
          </button>

        </div>

      </section>

      {/* CALORIE CALCULATOR */}
      <section className="calculator-section">

        <h2>Try our calorie calculator!</h2>

        <div className="calculator-card">

          <h3>Calorie Calculator</h3>

          <p>
            Struggling to set realistic weight goals? Our tool simplifies
            the process, guiding you towards a customized nutrition plan.
            Combine it with our Automatic Meal Planner for delicious,
            goal-aligned recipes, and make starting your health journey a snap.
          </p>

        </div>

      </section>

    </div>
  );
}