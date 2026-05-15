import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MealContext } from "../context/MealContext";

export default function Dashboard() {
  const { username, setSelectedMood } = useContext(MealContext);
  const navigate = useNavigate();

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const moods = ["Happy", "Stressed", "Lazy", "Energetic"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const openMoodModal = (day) => {
    setSelectedDate(day);
    setShowMoodModal(true);
  };

  const selectMood = (mood) => {
    setSelectedMood(mood);
    setShowMoodModal(false);
    navigate("/recipes");
  };

  return (
    <div>
      <Navbar username={username} />

      {/* HEADER */}
      <div style={{ padding: 20 }}>
        <button onClick={() => changeMonth(-1)}>Prev</button>

        <h2 style={{ display: "inline-block", margin: "0 20px" }}>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button onClick={() => changeMonth(1)}>Next</button>
      </div>

      {/* WEEKDAYS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          padding: "0 20px",
        }}
      >
        {weekdays.map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
          padding: 20,
        }}
      >
        {/* EMPTY CELLS BEFORE MONTH START */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* DAYS */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;

          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              style={{
                border: "1px solid #ccc",
                height: 80,
                position: "relative",
              }}
            >
              <button
                onClick={() => openMoodModal(day)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                }}
              >
                +
              </button>

              <div style={{ padding: 8, fontWeight: isToday ? "bold" : "normal" }}>
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {/* MOOD MODAL */}
      {showMoodModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowMoodModal(false)}
        >
          <div
            style={{
              padding: 20,
              border: "1px solid #ccc",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Select your mood</h3>

            {moods.map((m) => (
              <button
                key={m}
                onClick={() => selectMood(m)}
                style={{ display: "block", margin: 10 }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}