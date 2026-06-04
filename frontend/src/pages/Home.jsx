import { useEffect, useState, useRef } from "react";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef(null);

  const filterOptions = [
    { id: "high-protein", label: "💪 High Protein" },
    { id: "low-calorie", label: "🥗 Low Calorie" },
    { id: "vegetarian", label: "🌱 Vegetarian" },
    { id: "fast", label: "⚡ Under 20 Min" },
    { id: "breakfast", label: "🌅 Breakfast" },
    { id: "dessert", label: "🍰 Dessert" },
  ];

  const moodOptions = [
    { value: "stressed/anxious", label: "😰 Stressed / Anxious" },
    { value: "sad", label: "😢 Sad" },
    { value: "tired/lazy", label: "😴 Tired / Lazy" },
    { value: "happy/energetic", label: "😊 Happy / Energetic" },
    { value: "hangry", label: "😤 Hangry" },
    { value: "bored", label: "😑 Bored" },
  ];

  const features = [
    { icon: "😊", title: "Mood-Based Recommendations", desc: "Recipes matched to exactly how you feel right now." },
    { icon: "📅", title: "Smart Meal Planning", desc: "Plan daily, weekly, or monthly with an interactive calendar." },
    { icon: "🔥", title: "Nutrition Tracking", desc: "Auto-calculate calories, protein, carbs and fat per meal." },
    { icon: "🍽️", title: "Recipe Explorer", desc: "Browse hundreds of dishes or create your own custom meals." },
    { icon: "🔎", title: "Smart Search & Filters", desc: "Find meals fast by mood, type, calories or dietary need." },
    { icon: "✏️", title: "Custom Recipe Creation", desc: "Add your own recipes with full instructions and macros." },
  ];

  const handleSearch = () => {
    if (!search.trim() && !mood) return;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (mood) params.set("mood", mood);
    navigate(`/recipes?${params.toString()}`);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleFilter = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        const data = await res.json();
        const randomMeals = data.meals.sort(() => Math.random() - 0.5).slice(0, 8);
        setMeals(randomMeals);
      } catch (err) {}
    };
    fetchMeals();
  }, []);

  useEffect(() => {
    const fetchQuickMeals = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast`);
        const data = await res.json();
        const mealsWithTime = data.meals
          .slice(0, 12)
          .map((meal) => ({ ...meal, cookTime: Math.floor(Math.random() * 25) + 10 }))
          .sort((a, b) => a.cookTime - b.cookTime);
        setQuickMeals(mealsWithTime);
      } catch (err) {}
      setLoading(false);
    };
    fetchQuickMeals();
  }, []);

  const nextMeals = () => {
    if (currentIndex + 4 < quickMeals.length) setCurrentIndex(currentIndex + 4);
  };
  const prevMeals = () => {
    if (currentIndex - 4 >= 0) setCurrentIndex(currentIndex - 4);
  };

  const handleTagClick = (tag) => navigate(`/recipes?search=${tag}`);

  const handleStartPlanning = () => {
    const savedUser = localStorage.getItem("username");
    navigate(savedUser ? "/calendar" : "/login");
  };

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-wrapper">
        <div className="scroll-wrapper">
          <div className="scroll-track">
            {meals.concat(meals).map((meal, index) => (
              <img key={index} src={meal.strMealThumb} alt="" className="scroll-img" />
            ))}
          </div>
        </div>

        <div className="hero-overlay" />

        <div className="hero">
          <p className="hero-eyebrow">Mood-Based Meal Planning</p>
          <h1 className="hero-headline">What's your mood today?</h1>

          {/* Search + Filter Row */}
          <div className="hero-search-row">
            <div className="hero-search">
              <svg className="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search a meal or ingredient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <select
                className="mood-select"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">All Moods</option>
                {moodOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>

            {/* Filter Dropdown */}
            <div className="filter-wrap" ref={filterRef}>
              <button
                className={`filter-btn ${activeFilters.length > 0 ? "filter-btn--active" : ""}`}
                onClick={() => setFilterOpen((o) => !o)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filters
                {activeFilters.length > 0 && <span className="filter-count">{activeFilters.length}</span>}
              </button>
              {filterOpen && (
                <div className="filter-dropdown">
                  <p className="filter-dropdown-title">Filter by</p>
                  {filterOptions.map((f) => (
                    <label key={f.id} className={`filter-option ${activeFilters.includes(f.id) ? "filter-option--active" : ""}`}>
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(f.id)}
                        onChange={() => toggleFilter(f.id)}
                      />
                      {f.label}
                    </label>
                  ))}
                  {activeFilters.length > 0 && (
                    <button className="filter-clear" onClick={() => setActiveFilters([])}>Clear all</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="popular-tags">
            <span className="tags-label">Popular:</span>
            {["Chicken", "Pasta", "Dessert", "Healthy", "Comfort Food"].map((tag) => (
              <span key={tag} className="tag-pill" onClick={() => handleTagClick(tag)}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT BRIDGE SECTION ── */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-logo-wrap">
            <img src={logo} alt="Cook Orbit" className="about-logo" />
            <div className="about-logo-glow" />
          </div>
          <div className="about-text">
            <h2 className="about-brand">Cook Orbit</h2>
            <p>
              The Mood-Based Meal Planner with Nutrition Tracking helps you organize
              your daily, weekly, or monthly meals using an interactive calendar
              while considering how you feel. Whether you're happy, stressed,
              tired, or energized, the system suggests meals that match your mood
              and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* ── HERO TAGLINE (replaces about-hero) ── */}
      <section className="about-hero">
        <div className="hero-left">
          <p className="hero-eyebrow fade-up">Cook Orbit</p>
          <h1 className="hero-title fade-up delay-1">
            Plan <em>Smarter.</em><br />Eat Better.<br />Feel Better.
          </h1>
          <button className="hero-cta fade-up delay-3" onClick={handleStartPlanning}>
            Start Planning →
          </button>
        </div>
        <div className="hero-right fade-up delay-2">
          <div className="orbit-wrapper">
            <div className="orbit-ring orbit-ring-2"><div className="orbit-dot" /></div>
            <div className="orbit-ring orbit-ring-1"><div className="orbit-dot accent-dot" /></div>
            <div className="hero-visual">
              <img src={logo} alt="Cook Orbit" className="about-logo" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS / FEATURE HIGHLIGHTS ── */}
      <div className="stats-strip">
        {features.map((f, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-icon">{f.icon}</div>
            <div>
              <div className="stat-label">{f.title}</div>
              <div className="stat-sub">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK MEALS ── */}
      <section className="quick-meals-section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Ready in under 30 minutes</p>
            <h2 className="section-title">Quick & Easy Meals</h2>
          </div>
          <button className="section-link" onClick={() => navigate("/recipes")}>
            Browse All Recipes →
          </button>
        </div>

        {loading ? (
          <div className="qm-loading">
            <div className="qm-spinner" />
            <p>Loading meals…</p>
          </div>
        ) : (
          <div className="meal-carousel">
            <button
              className={`carousel-btn ${currentIndex === 0 ? "disabled-btn" : ""}`}
              onClick={prevMeals}
              disabled={currentIndex === 0}
              aria-label="Previous"
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
                    <span className="meal-view">View Recipe →</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={`carousel-btn ${currentIndex + 4 >= quickMeals.length ? "disabled-btn" : ""}`}
              onClick={nextMeals}
              disabled={currentIndex + 4 >= quickMeals.length}
              aria-label="Next"
            >
              ❯
            </button>
          </div>
        )}
      </section>

      {/* ── CALORIE CALCULATOR CTA ── */}
      <section className="calculator-section">
        <div className="calculator-card">
          <div className="calculator-card-left">
            <p className="calc-eyebrow">Nutrition Intelligence</p>
            <h2 className="calc-title">Know What You're Eating</h2>
            <p className="calc-desc">
              Set realistic goals with our built-in calorie calculator. Combine it
              with mood-based meal planning for a fully personalized nutrition journey.
            </p>
            <button
              className="calc-cta"
              onClick={() => navigate("/calendar", { state: { openCalcualtor: true } })}
            >
              <span>Try the Calorie Calculator</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="calculator-card-right">
            <div className="calc-visual">
              <div className="calc-ring">
                <div className="calc-stat">
                  <span className="calc-stat-num">2,100</span>
                  <span className="calc-stat-label">Daily Calories</span>
                </div>
              </div>
              <div className="calc-macros">
                <div className="calc-macro-item">
                  <div className="calc-macro-bar" style={{ "--fill": "65%", "--color": "var(--green-soft)" }} />
                  <span>Carbs 65%</span>
                </div>
                <div className="calc-macro-item">
                  <div className="calc-macro-bar" style={{ "--fill": "20%", "--color": "var(--accent)" }} />
                  <span>Protein 20%</span>
                </div>
                <div className="calc-macro-item">
                  <div className="calc-macro-bar" style={{ "--fill": "15%", "--color": "var(--green-light)" }} />
                  <span>Fat 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={logo} alt="Cook Orbit" className="footer-logo" />
            <div>
              <p className="footer-brand-name">Cook Orbit</p>
              <p className="footer-brand-desc">
                Mood-based meal planning with nutrition tracking — eat well, feel better.
              </p>
            </div>
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Navigate</p>
            <a href="/recipes">Recipe Explorer</a>
            <a href="/calendar">Meal Calendar</a>
            <a href="/createrecipe">Create Recipe</a>
            <a href="/login">Sign In</a>
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Contact</p>
            <a href="mailto:hello@cookorbit.app">hello@cookorbit.app</a>
            <p className="footer-contact-note">We'd love to hear from you.</p>
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Follow Us</p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram
              </a>
              <a href="#" className="social-link" aria-label="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Cook Orbit. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
