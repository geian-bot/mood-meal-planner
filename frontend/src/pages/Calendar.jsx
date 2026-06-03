import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";
import "./calendar.css";

/* ── CONSTANTS ── */
const VIEWS = ["Daily", "Weekly", "Monthly", "Yearly"];
const MOODS = [
  { value: "happy",     emoji: "😊", label: "Happy",     categories: ["Dessert", "Chicken", "Beef"] },
  { value: "stressed",  emoji: "😟", label: "Stressed",  categories: ["Pasta", "Seafood", "Starter"] },
  { value: "lazy",      emoji: "😴", label: "Lazy",      categories: ["Breakfast", "Side", "Pasta"] },
  { value: "energetic", emoji: "💪", label: "Energetic", categories: ["Chicken", "Seafood", "Beef"] },
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ACTIVITY_LEVELS = [
  { value: "sedentary",    label: "Sedentary",          multiplier: 1.2 },
  { value: "light",        label: "Lightly Active",     multiplier: 1.375 },
  { value: "moderate",     label: "Moderately Active",  multiplier: 1.55 },
  { value: "very",         label: "Very Active",        multiplier: 1.725 },
];

/* ── HELPERS ── */
const dateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const today = new Date();

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/* ── NUTRITION BAR ── */
function NutritionBar({ label, consumed, target, unit, color }) {
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  return (
    <div className="nut-bar-wrap">
      <div className="nut-bar-header">
        <span className="nut-label">{label}</span>
        <span className="nut-values">{consumed}{unit} <span className="nut-sep">/</span> {target}{unit}</span>
      </div>
      <div className="nut-track">
        <div className="nut-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="nut-remaining">{Math.max(0, target - consumed)}{unit} remaining</div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function CalendarPage() {
  const navigate = useNavigate();
  const { username, setUsername } = useContext(MealContext);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");

    // no user at all → force login
    if (!savedUser) {
      navigate("/login");
      return;
    }

    // restore session user
    setUsername(savedUser);
  }, [navigate, setUsername]);

  const [view, setView] = useState("Monthly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealData, setMealData] = useState({});       // { dateKey: { mood, meals: [{type, recipe}] } }
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nutritionGoals, setNutritionGoals] = useState({ calories: 2200, protein: 120, carbs: 250, fat: 70 });

  /* modal states */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [editTarget, setEditTarget] = useState(null);   // { dateKey, mealIndex }

  /* add meal wizard */
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  /* edit meal */
  const [editMood, setEditMood] = useState(null);
  const [editMealType, setEditMealType] = useState("");
  const [editRecipe, setEditRecipe] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  /* calorie calculator */
  const [calcForm, setCalcForm] = useState({ age: "", gender: "male", weight: "", height: "", activity: "moderate" });
  const [calcResult, setCalcResult] = useState(null);

  /* ── FETCH RECIPES ── */
  const fetchRecipesByMood = async (mood) => {
    if (!mood) return;
    setLoadingRecipes(true);
    try {
      const moodObj = MOODS.find((m) => m.value === mood);
      const cat = moodObj?.categories[Math.floor(Math.random() * moodObj.categories.length)] || "Chicken";
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
      const data = await res.json();
      setSuggestedRecipes((data.meals || []).slice(0, 12));
    } catch (e) {
      setSuggestedRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const searchRecipes = async (query) => {
    if (!query.trim()) return fetchRecipesByMood(selectedMood?.value);
    setLoadingRecipes(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await res.json();
      setSuggestedRecipes((data.meals || []).slice(0, 12));
    } catch (e) {
      setSuggestedRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  /* ── NAVIGATION ── */
  const navigate_ = (dir) => {
    const d = new Date(currentDate);
    if (view === "Daily")   d.setDate(d.getDate() + dir);
    if (view === "Weekly")  d.setDate(d.getDate() + dir * 7);
    if (view === "Monthly") d.setMonth(d.getMonth() + dir);
    if (view === "Yearly")  d.setFullYear(d.getFullYear() + dir);
    setCurrentDate(d);
  };

  /* ── ADD MEAL ── */
  const openAddModal = (date) => {
    setModalDate(date);
    setStep(1);
    setSelectedMood(null);
    setSelectedMealType("");
    setSelectedRecipe(null);
    setRecipeSearch("");
    setSuggestedRecipes([]);
    setShowAddModal(true);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchRecipesByMood(mood.value);
  };

  const saveMeal = () => {
    if (!modalDate || !selectedMood || !selectedMealType || !selectedRecipe) return;
    const key = dateKey(modalDate);
    setMealData((prev) => {
      const existing = prev[key] || { mood: selectedMood, meals: [] };
      return {
        ...prev,
        [key]: {
          mood: selectedMood,
          meals: [...existing.meals, { type: selectedMealType, recipe: selectedRecipe }],
        },
      };
    });
    setShowAddModal(false);
  };

  /* ── EDIT MEAL ── */
  const openEditModal = (key, index) => {
    const entry = mealData[key];
    if (!entry) return;
    const meal = entry.meals[index];
    setEditTarget({ key, index });
    setEditMood(entry.mood);
    setEditMealType(meal.type);
    setEditRecipe(meal.recipe);
    setEditNotes(meal.notes || "");
    setShowEditModal(true);
  };

  const updateMeal = () => {
    if (!editTarget) return;
    const { key, index } = editTarget;
    setMealData((prev) => {
      const updated = { ...prev[key] };
      updated.mood = editMood;
      updated.meals = updated.meals.map((m, i) =>
        i === index ? { ...m, type: editMealType, recipe: editRecipe, notes: editNotes } : m
      );
      return { ...prev, [key]: updated };
    });
    setShowEditModal(false);
  };

  const deleteMeal = () => {
    if (!editTarget) return;
    const { key, index } = editTarget;
    setMealData((prev) => {
      const updated = { ...prev[key] };
      updated.meals = updated.meals.filter((_, i) => i !== index);
      if (updated.meals.length === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: updated };
    });
    setShowDeleteConfirm(false);
    setShowEditModal(false);
  };

  /* ── CALORIE CALC ── */
  const calculateCalories = () => {
    const { age, gender, weight, height, activity } = calcForm;
    if (!age || !weight || !height) return;
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height);
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const mult = ACTIVITY_LEVELS.find((l) => l.value === activity)?.multiplier || 1.55;
    const maintenance = Math.round(bmr * mult);
    setCalcResult({ maintenance, loss: maintenance - 500, gain: maintenance + 500 });
  };

  /* ── DAILY NUTRITION ── */
  const getDayNutrition = (key) => {
    const entry = mealData[key];
    if (!entry) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    entry.meals.forEach((m) => {
      totals.calories += 320;
      totals.protein  += 22;
      totals.carbs    += 38;
      totals.fat      += 12;
    });
    return totals;
  };

  const todayNutrition = getDayNutrition(dateKey(selectedDate));

  /* ── VIEWS ── */
  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="cal-cell empty" />);

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const key = dateKey(cellDate);
      const entry = mealData[key];
      const isToday = dateKey(cellDate) === dateKey(today);
      const isSelected = dateKey(cellDate) === dateKey(selectedDate);

      cells.push(
        <div
          key={d}
          className={`cal-cell ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}`}
          onClick={() => setSelectedDate(cellDate)}
        >
          <div className="cal-date-num">{d}</div>
          {entry && (
            <>
              <span className="cal-mood-badge">{entry.mood.emoji}</span>
              {entry.meals.slice(0, 2).map((m, i) => (
                <div key={i} className="cal-meal-pill" onClick={(e) => { e.stopPropagation(); openEditModal(key, i); }}>
                  {m.type === "Breakfast" ? "🍳" : m.type === "Lunch" ? "🥗" : m.type === "Dinner" ? "🍝" : "🍎"} {m.recipe?.strMeal?.split(" ").slice(0, 2).join(" ") || m.recipe?.strMeal || ""}
                </div>
              ))}
              {entry.meals.length > 2 && <div className="cal-more">+{entry.meals.length - 2} more</div>}
            </>
          )}
          <button className="cal-add-btn" onClick={(e) => { e.stopPropagation(); openAddModal(cellDate); }}>+</button>
        </div>
      );
    }

    return (
      <div className="monthly-view">
        <div className="cal-day-headers">
          {DAYS.map((d) => <div key={d} className="cal-day-header">{d}</div>)}
        </div>
        <div className="cal-grid">{cells}</div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return (
      <div className="weekly-view">
        {days.map((day) => {
          const key = dateKey(day);
          const entry = mealData[key];
          const isToday = dateKey(day) === dateKey(today);
          return (
            <div key={key} className={`week-col ${isToday ? "is-today" : ""}`}>
              <div className="week-col-header">
                <span className="week-day-name">{DAYS[day.getDay()]}</span>
                <span className="week-date-num">{day.getDate()}</span>
              </div>
              <div className="week-col-body">
                {entry?.meals.map((m, i) => (
                  <div key={i} className="week-meal-card" onClick={() => openEditModal(key, i)}>
                    <span className="wmc-type">{m.type}</span>
                    <span className="wmc-name">{m.recipe?.strMeal || ""}</span>
                    {entry.mood && <span className="wmc-mood">{entry.mood.emoji}</span>}
                  </div>
                ))}
                <button className="week-add-btn" onClick={() => openAddModal(day)}>+ Add</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDailyView = () => {
    const key = dateKey(currentDate);
    const entry = mealData[key];
    const nutrition = getDayNutrition(key);

    return (
      <div className="daily-view">
        <div className="daily-header">
          <h2 className="daily-title">
            {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h2>
          {entry?.mood && <span className="daily-mood">{entry.mood.emoji} {entry.mood.label}</span>}
        </div>

        <div className="daily-content">
          <div className="daily-meals">
            {MEAL_TYPES.map((type) => {
              const meal = entry?.meals.find((m) => m.type === type);
              const idx = entry?.meals.findIndex((m) => m.type === type);
              return (
                <div key={type} className="daily-meal-slot">
                  <div className="dms-type">
                    {type === "Breakfast" ? "🍳" : type === "Lunch" ? "🥗" : type === "Dinner" ? "🍝" : "🍎"} {type}
                  </div>
                  {meal ? (
                    <div className="dms-recipe" onClick={() => openEditModal(key, idx)}>
                      {meal.recipe?.strMealThumb && (
                        <img src={meal.recipe.strMealThumb} alt={meal.recipe.strMeal} className="dms-img" />
                      )}
                      <div className="dms-info">
                        <span className="dms-name">{meal.recipe?.strMeal}</span>
                        {meal.notes && <span className="dms-notes">{meal.notes}</span>}
                      </div>
                    </div>
                  ) : (
                    <button className="dms-add" onClick={() => openAddModal(currentDate)}>+ Add {type}</button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="daily-nutrition-card">
            <h3>Today's Nutrition</h3>
            <NutritionBar label="Calories" consumed={nutrition.calories} target={nutritionGoals.calories} unit=" kcal" color="#4caf50" />
            <NutritionBar label="Protein"  consumed={nutrition.protein}  target={nutritionGoals.protein}  unit="g"    color="#2196f3" />
            <NutritionBar label="Carbs"    consumed={nutrition.carbs}    target={nutritionGoals.carbs}    unit="g"    color="#ff9800" />
            <NutritionBar label="Fat"      consumed={nutrition.fat}      target={nutritionGoals.fat}      unit="g"    color="#f44336" />
          </div>
        </div>
      </div>
    );
  };

  const renderYearlyView = () => {
    const year = currentDate.getFullYear();
    return (
      <div className="yearly-view">
        {MONTHS.map((monthName, monthIdx) => {
          const daysInMonth = getDaysInMonth(year, monthIdx);
          const firstDay = getFirstDayOfMonth(year, monthIdx);
          const cells = [];
          for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="yr-cell empty" />);
          for (let d = 1; d <= daysInMonth; d++) {
            const cellDate = new Date(year, monthIdx, d);
            const key = dateKey(cellDate);
            const hasEntry = !!mealData[key];
            const isToday = dateKey(cellDate) === dateKey(today);
            cells.push(
              <div
                key={d}
                className={`yr-cell ${hasEntry ? "has-meal" : ""} ${isToday ? "is-today" : ""}`}
                title={`${monthName} ${d}`}
                onClick={() => { setSelectedDate(cellDate); setCurrentDate(cellDate); setView("Daily"); }}
              >
                {d}
              </div>
            );
          }
          return (
            <div key={monthName} className="yr-month">
              <div className="yr-month-name">{monthName}</div>
              <div className="yr-day-headers">{DAYS.map((d) => <div key={d}>{d[0]}</div>)}</div>
              <div className="yr-grid">{cells}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const getViewTitle = () => {
    if (view === "Daily")   return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    if (view === "Weekly") {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${end.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
    }
    if (view === "Monthly") return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    return `${currentDate.getFullYear()}`;
  };

  return (
    <div className="calendar-page">
      <Navbar username={username} />

      <div className="cal-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`cal-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>

          {sidebarOpen && (
            <>
              <div className="sidebar-section">
                <h3 className="sidebar-heading">Nutrition Today</h3>
                <NutritionBar label="Calories" consumed={todayNutrition.calories} target={nutritionGoals.calories} unit=" kcal" color="#4caf50" />
                <NutritionBar label="Protein"  consumed={todayNutrition.protein}  target={nutritionGoals.protein}  unit="g"    color="#2196f3" />
                <NutritionBar label="Carbs"    consumed={todayNutrition.carbs}    target={nutritionGoals.carbs}    unit="g"    color="#ff9800" />
                <NutritionBar label="Fat"      consumed={todayNutrition.fat}      target={nutritionGoals.fat}      unit="g"    color="#f44336" />
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-heading">Quick Actions</h3>
                <button className="qa-btn" onClick={() => openAddModal(selectedDate)}>➕ Add Meal</button>
                <button className="qa-btn" onClick={() => setShowCalcModal(true)}>🔥 Calculate Calories</button>
                <button className="qa-btn" onClick={() => {
                  const moods = MOODS[Math.floor(Math.random() * MOODS.length)];
                  openAddModal(selectedDate);
                  setTimeout(() => handleMoodSelect(moods), 100);
                }}>🎲 Generate Plan</button>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-heading">Selected Day</h3>
                <p className="sidebar-date">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                {mealData[dateKey(selectedDate)] ? (
                  <div className="sidebar-meals">
                    {mealData[dateKey(selectedDate)].meals.map((m, i) => (
                      <div key={i} className="sidebar-meal-item">
                        <span>{m.type === "Breakfast" ? "🍳" : m.type === "Lunch" ? "🥗" : m.type === "Dinner" ? "🍝" : "🍎"}</span>
                        <span>{m.recipe?.strMeal?.slice(0, 22) || ""}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sidebar-empty">No meals planned yet.</p>
                )}
              </div>
            </>
          )}
        </aside>

        {/* ── MAIN CALENDAR ── */}
        <main className="cal-main">
          {/* toolbar */}
          <div className="cal-toolbar">
            <div className="view-tabs">
              {VIEWS.map((v) => (
                <button key={v} className={`view-tab ${view === v ? "active" : ""}`} onClick={() => setView(v)}>{v}</button>
              ))}
            </div>

            <div className="cal-nav">
              <button className="nav-btn" onClick={() => navigate_(-1)}>❮</button>
              <button className="today-btn" onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}>Today</button>
              <button className="nav-btn" onClick={() => navigate_(1)}>❯</button>
            </div>

            <h2 className="cal-view-title">{getViewTitle()}</h2>
          </div>

          {/* calendar body */}
          <div className="cal-body">
            {view === "Monthly" && renderMonthlyView()}
            {view === "Weekly"  && renderWeeklyView()}
            {view === "Daily"   && renderDailyView()}
            {view === "Yearly"  && renderYearlyView()}
          </div>
        </main>
      </div>

      {/* ══ ADD MEAL MODAL ══ */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Meal</h2>
              <span className="modal-sub">{modalDate?.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className="modal-steps">
              {[1,2,3,4].map((s) => (
                <div key={s} className={`step-dot ${step >= s ? "done" : ""} ${step === s ? "active" : ""}`}>{s}</div>
              ))}
            </div>

            <div className="modal-body">
              {/* STEP 1 — MOOD */}
              {step === 1 && (
                <div className="step-content">
                  <h3 className="step-title">How are you feeling?</h3>
                  <div className="mood-grid">
                    {MOODS.map((m) => (
                      <div
                        key={m.value}
                        className={`mood-card ${selectedMood?.value === m.value ? "selected" : ""}`}
                        onClick={() => handleMoodSelect(m)}
                      >
                        <span className="mood-card-emoji">{m.emoji}</span>
                        <span className="mood-card-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <button className="modal-next" disabled={!selectedMood} onClick={() => setStep(2)}>Next →</button>
                </div>
              )}

              {/* STEP 2 — MEAL TYPE */}
              {step === 2 && (
                <div className="step-content">
                  <h3 className="step-title">Select meal type</h3>
                  <div className="meal-type-grid">
                    {MEAL_TYPES.map((t) => (
                      <div
                        key={t}
                        className={`meal-type-card ${selectedMealType === t ? "selected" : ""}`}
                        onClick={() => setSelectedMealType(t)}
                      >
                        <span className="mtc-icon">{t === "Breakfast" ? "🍳" : t === "Lunch" ? "🥗" : t === "Dinner" ? "🍝" : "🍎"}</span>
                        <span className="mtc-label">{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="step-nav">
                    <button className="modal-back" onClick={() => setStep(1)}>← Back</button>
                    <button className="modal-next" disabled={!selectedMealType} onClick={() => setStep(3)}>Next →</button>
                  </div>
                </div>
              )}

              {/* STEP 3 — RECIPE */}
              {step === 3 && (
                <div className="step-content">
                  <h3 className="step-title">Choose a recipe</h3>
                  <div className="recipe-search-bar">
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={recipeSearch}
                      onChange={(e) => setRecipeSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchRecipes(recipeSearch)}
                      className="recipe-search-input"
                    />
                    <button className="recipe-search-btn" onClick={() => searchRecipes(recipeSearch)}>Search</button>
                  </div>
                  {selectedMood && (
                    <p className="recipe-mood-hint">
                      Suggestions for {selectedMood.emoji} {selectedMood.label} mood
                    </p>
                  )}
                  {loadingRecipes ? (
                    <div className="modal-loading"><div className="loading-spinner" /></div>
                  ) : (
                    <div className="recipe-list">
                      {suggestedRecipes.map((r) => (
                        <div
                          key={r.idMeal}
                          className={`recipe-list-item ${selectedRecipe?.idMeal === r.idMeal ? "selected" : ""}`}
                          onClick={() => setSelectedRecipe(r)}
                        >
                          <img src={r.strMealThumb} alt={r.strMeal} className="rli-img" />
                          <span className="rli-name">{r.strMeal}</span>
                          {selectedRecipe?.idMeal === r.idMeal && <span className="rli-check">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="step-nav">
                    <button className="modal-back" onClick={() => setStep(2)}>← Back</button>
                    <button className="modal-next" disabled={!selectedRecipe} onClick={() => setStep(4)}>Next →</button>
                  </div>
                </div>
              )}

              {/* STEP 4 — CONFIRM */}
              {step === 4 && (
                <div className="step-content">
                  <h3 className="step-title">Confirm & Save</h3>
                  <div className="confirm-card">
                    {selectedRecipe?.strMealThumb && (
                      <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="confirm-img" />
                    )}
                    <div className="confirm-info">
                      <div className="confirm-row"><span>📅 Date</span><strong>{modalDate?.toLocaleDateString()}</strong></div>
                      <div className="confirm-row"><span>😊 Mood</span><strong>{selectedMood?.emoji} {selectedMood?.label}</strong></div>
                      <div className="confirm-row"><span>🍽 Type</span><strong>{selectedMealType}</strong></div>
                      <div className="confirm-row"><span>🥘 Recipe</span><strong>{selectedRecipe?.strMeal}</strong></div>
                    </div>
                  </div>
                  <div className="step-nav">
                    <button className="modal-back" onClick={() => setStep(3)}>← Back</button>
                    <button className="modal-save" onClick={saveMeal}>Save Meal ✓</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MEAL MODAL ══ */}
      {showEditModal && editTarget && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Meal</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="form-label">Mood</label>
              <div className="mood-grid small">
                {MOODS.map((m) => (
                  <div
                    key={m.value}
                    className={`mood-card ${editMood?.value === m.value ? "selected" : ""}`}
                    onClick={() => setEditMood(m)}
                  >
                    <span className="mood-card-emoji">{m.emoji}</span>
                    <span className="mood-card-label">{m.label}</span>
                  </div>
                ))}
              </div>

              <label className="form-label">Meal Type</label>
              <div className="meal-type-grid small">
                {MEAL_TYPES.map((t) => (
                  <div
                    key={t}
                    className={`meal-type-card ${editMealType === t ? "selected" : ""}`}
                    onClick={() => setEditMealType(t)}
                  >
                    <span className="mtc-icon">{t === "Breakfast" ? "🍳" : t === "Lunch" ? "🥗" : t === "Dinner" ? "🍝" : "🍎"}</span>
                    <span className="mtc-label">{t}</span>
                  </div>
                ))}
              </div>

              <label className="form-label">Notes</label>
              <textarea
                className="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes..."
                rows={3}
              />

              <div className="edit-actions">
                <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>🗑 Delete</button>
                <button className="modal-back" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="modal-save" onClick={updateMeal}>Update Meal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal confirm-modal">
            <h3 className="confirm-title">Delete Meal?</h3>
            <p className="confirm-text">Are you sure you want to remove this meal? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="modal-back" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={deleteMeal}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CALORIE CALCULATOR MODAL ══ */}
      {showCalcModal && (
        <div className="modal-backdrop" onClick={() => setShowCalcModal(false)}>
          <div className="modal calc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🔥 Calorie Calculator</h2>
              <button className="modal-close" onClick={() => setShowCalcModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="calc-form">
                <div className="calc-row">
                  <div className="calc-field">
                    <label className="form-label">Age</label>
                    <input type="number" className="calc-input" placeholder="25" value={calcForm.age} onChange={(e) => setCalcForm({ ...calcForm, age: e.target.value })} />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Gender</label>
                    <select className="calc-input" value={calcForm.gender} onChange={(e) => setCalcForm({ ...calcForm, gender: e.target.value })}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="calc-row">
                  <div className="calc-field">
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="calc-input" placeholder="70" value={calcForm.weight} onChange={(e) => setCalcForm({ ...calcForm, weight: e.target.value })} />
                  </div>
                  <div className="calc-field">
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="calc-input" placeholder="170" value={calcForm.height} onChange={(e) => setCalcForm({ ...calcForm, height: e.target.value })} />
                  </div>
                </div>
                <div className="calc-field full">
                  <label className="form-label">Activity Level</label>
                  <select className="calc-input" value={calcForm.activity} onChange={(e) => setCalcForm({ ...calcForm, activity: e.target.value })}>
                    {ACTIVITY_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <button className="modal-save full" onClick={calculateCalories}>Calculate →</button>
              </div>

              {calcResult && (
                <div className="calc-results">
                  <div className="calc-result-card maintenance">
                    <span className="cr-label">Maintenance</span>
                    <span className="cr-val">{calcResult.maintenance} kcal</span>
                  </div>
                  <div className="calc-result-card loss">
                    <span className="cr-label">Weight Loss</span>
                    <span className="cr-val">{calcResult.loss} kcal</span>
                  </div>
                  <div className="calc-result-card gain">
                    <span className="cr-label">Weight Gain</span>
                    <span className="cr-val">{calcResult.gain} kcal</span>
                  </div>
                  <button
                    className="modal-save full"
                    onClick={() => {
                      setNutritionGoals({ calories: calcResult.maintenance, protein: Math.round(calcResult.maintenance * 0.25 / 4), carbs: Math.round(calcResult.maintenance * 0.5 / 4), fat: Math.round(calcResult.maintenance * 0.25 / 9) });
                      setShowCalcModal(false);
                    }}
                  >
                    Save as Nutrition Goal ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
