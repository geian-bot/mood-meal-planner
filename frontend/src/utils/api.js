const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost/MOOD-MEAL-PLANNER/backend";

export const API = {
  login:        `${BASE_URL}/login.php`,
  register:     `${BASE_URL}/register.php`,
  checkSession: `${BASE_URL}/check_session.php`,
  saveRecipe:   `${BASE_URL}/save_recipe.php`,
  getRecipes:   `${BASE_URL}/get_recipes.php`,
  editRecipe:   `${BASE_URL}/edit_recipe.php`,
  deleteRecipe: `${BASE_URL}/delete_recipe.php`,
};

export default BASE_URL;