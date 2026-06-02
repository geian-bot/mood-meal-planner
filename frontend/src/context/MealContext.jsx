import { createContext, useState, useEffect } from "react";

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  // ─────────────────────────────
  // MEALS (persisted locally)
  // ─────────────────────────────
  const [plannedMeals, setPlannedMeals] = useState(() => {
    const saved = localStorage.getItem("plannedMeals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("plannedMeals", JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const addMeal = (meal) => {
    setPlannedMeals((prev) => [...prev, meal]);
  };

  // ─────────────────────────────
  // USER STATE
  // ─────────────────────────────
  const [username, setUsername] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  // ─────────────────────────────
  // RESET (for logout / safety)
  // ─────────────────────────────
  const resetUser = () => {
    setUsername(null);
    setSelectedMood(null);
  };

  return (
    <MealContext.Provider
      value={{
        // meals
        plannedMeals,
        setPlannedMeals,
        addMeal,

        // user
        username,
        setUsername,
        selectedMood,
        setSelectedMood,

        // helper
        resetUser,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};