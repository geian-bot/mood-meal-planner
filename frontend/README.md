

# Cook Orbit / Mood Meal Planner

A personalized meal planning web application that helps users discover, plan, and organize meals based on their mood, lifestyle, and daily needs.

---

### Features

### Mood-Based Meal Suggestions

* Users can select their current mood
* The system recommends meals based on emotional state

### Meal Calendar Planner

* Plan meals daily, weekly, or monthly
* Add, edit, and view scheduled meals easily

### Recipe Management

* Save favorite recipes
* Create and manage custom recipes

### Search Function

* Search recipes quickly through the navbar and sidebar

### User Authentication

* Login system for personalized experience
* User-specific saved data

### Nutrition Tracking *(if included)*

* View basic nutritional breakdown per meal/day

---

## Tech Stack

### Frontend

* React.js
* React Router
* Context API
* CSS (custom styling)

### Backend

* PHP / Node.js
* REST API
* Railway

### Database

* MySQL (via phpMyAdmin / XAMPP)

---

## 📁 Project Structure

```
mood-meal-planner/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Calendar.jsx
│   │   ├── Recipes.jsx
│   │   └── About.jsx
│   ├── context/
│   │   └── MealContext.js
│   ├── styles/
│   └── App.jsx
│
├── backend/
│   └── (API files / PHP scripts)
│
├── database/
│   └── mood_meal_planner.sql
│
└── README.md
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mood-meal-planner.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

---

## Backend Setup (XAMPP / PHPMyAdmin) (optional)

1. Start **Apache** and **MySQL** in XAMPP

2. Import the database:

   * Open `phpMyAdmin`
   * Create a database (e.g. `mood_meal_planner`)
   * Import `mood_meal_planner.sql`

3. Configure backend connection in your API files:

```php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "mood_meal_planner";
```

---

## Purpose of the Project

This system is designed for:

* Students
* Busy individuals
* People who struggle with deciding what to eat daily
* Users who prefer personalized and mood-based meal suggestions

It aims to make meal planning simpler, more intuitive, and emotionally aware.

---

## Future Improvements

* AI-based meal recommendations
* Mobile app version
* Grocery list generator
* Advanced nutrition tracking
* Social sharing of recipes

---

##  Developers

* Ysabelle E. Estabaya
* Alliyah Myka G. Bibat
* Geian Patrick A. Natividad

---

## Note

This project was developed as part of an academic requirement for web development and full-stack system design.

