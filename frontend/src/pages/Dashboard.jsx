import moodMeals from "../utils/moodMeals";

export default function Dashboard() {
  return (
    <div>
      <h1>Mood-Based Suggestions</h1>

      {Object.keys(moodMeals).map((mood) => (
        <div key={mood}>
          <h3>{mood}</h3>
          <ul>
            {moodMeals[mood].map((meal, i) => (
              <li key={i}>{meal}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}