import { createContext, useState, useEffect } from "react";

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [plannedMeals, setPlannedMeals] = useState(() => {
    const saved = localStorage.getItem("plannedMeals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("plannedMeals", JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const addMeal = (meal) => {
    setPlannedMeals([...plannedMeals, meal]);
  };

  return (
    <MealContext.Provider value={{
      plannedMeals,
      setPlannedMeals, // ✅ added for delete feature
      addMeal
    }}>
      {children}
    </MealContext.Provider>
  );
};