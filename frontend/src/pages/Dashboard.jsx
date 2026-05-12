import moodMeals from "../utils/moodMeals";

export default function Dashboard() {
  return (
    <div>
      <h1>Mood Suggestions</h1>

      {Object.keys(moodMeals).map((mood) => (
        <div
          key={mood}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h2>{mood}</h2>

          <ul>
            {moodMeals[mood].map((meal, index) => (
              <li key={index}>{meal}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}