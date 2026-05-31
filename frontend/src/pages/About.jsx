import Navbar from "../components/Navbar";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
        <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="hero-left">
          <p className="hero-eyebrow fade-up">About Cook Orbit</p>
          <h1 className="hero-title fade-up delay-1">
            Plan <em>Smarter.</em><br />Eat Better.<br />Feel Better.
          </h1>
          <p className="hero-desc fade-up delay-2">
            We believe food is more than fuel — it shapes how you feel, think, and live.
            Cook Orbit helps you find the right meal for the right moment.
          </p>
          <button className="hero-cta fade-up delay-3">Start Planning →</button>
        </div>

        <div className="hero-right fade-up delay-2">
          <div className="orbit-wrapper">
            <div className="orbit-ring orbit-ring-2"><div className="orbit-dot"></div></div>
            <div className="orbit-ring orbit-ring-1"><div className="orbit-dot accent-dot"></div></div>
            <div className="hero-visual"></div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-icon">😊</div>
          <div>
            <div className="stat-label">Mood-Based Meals</div>
            <div className="stat-sub">Recipes matched to how you feel</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🍽</div>
          <div>
            <div className="stat-label">Recipe Explorer</div>
            <div className="stat-sub">Browse hundreds of dishes</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div>
            <div className="stat-label">Nutrition Tracking</div>
            <div className="stat-sub">Calories, protein & more</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-label">Smart Planner</div>
            <div className="stat-sub">Plan daily, weekly, monthly</div>
          </div>
        </div>
      </div>

      {/* WHAT IS COOK ORBIT */}
      <section className="section what-is-section">
        <div className="what-is">
          <div className="what-is-left">
            <p className="section-tag">What is Cook Orbit?</p>
            <h2>A meal planner that <em>gets</em> you.</h2>
            <p>
              Cook Orbit is a personalized meal-planning platform designed to help you
              discover meals that match your mood, lifestyle, and daily needs.
            </p>
            <p>
              Whether you're energetic and craving something nutritious, stressed and
              reaching for comfort food, or simply unsure what to eat — Cook Orbit
              adapts to your moment.
            </p>
            <p>
              Our goal is to make meal planning simpler, more enjoyable, and less
              overwhelming by combining mood-based recommendations with an
              easy-to-use planning experience.
            </p>
          </div>

          <div className="what-is-right">
            <div className="belief-card dark-card">
              <div className="bc-icon">✨</div>
              <div className="bc-title light">What We Believe</div>
              <div className="bc-body light">
                Healthy eating should be simple and sustainable. Planning meals
                doesn't have to be complicated, expensive, or time-consuming.
              </div>
            </div>
            <div className="belief-card">
              <div className="bc-icon">🧠</div>
              <div className="bc-title">Mood & Food</div>
              <div className="bc-body">
                Our emotions influence our food choices. By acknowledging this
                connection, we help you make decisions that are both satisfying
                and balanced.
              </div>
            </div>
            <div className="belief-card">
              <div className="bc-icon">🌱</div>
              <div className="bc-title">Accessible to All</div>
              <div className="bc-body">
                Everyone deserves tools that make healthy choices easier
                and more enjoyable.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="mission-inner">
          <div className="mission-left">
            <p className="section-tag">Our Mission</p>
            <h2>Our Goal</h2>
            <div className="ml-line"></div>
          </div>
          <div className="mission-right">
            <blockquote>
              "Food is more than nutrition. It shapes emotions, energy, and daily life."
            </blockquote>
            <p>
              Our mission is to empower individuals to make informed food choices
              through personalized meal planning and mood-based recipe recommendations.
              We strive to provide an experience that encourages healthy eating habits,
              better organization, and a more enjoyable relationship with food.
            </p>
            <br />
            <p>
              We aim to help you spend less time worrying about what to eat and more
              time enjoying nutritious meals that fit your preferences and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section-header">
          <div>
            <p className="section-tag">Getting Started</p>
            <h2>How It Works</h2>
          </div>
        </div>
        <div className="steps-grid">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-icon">😊</div>
            <div className="step-title">Choose your mood</div>
            <div className="step-body">
              Select how you're feeling and let Cook Orbit find recipes that
              match your current energy and emotion.
            </div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-icon">🔍</div>
            <div className="step-title">Get meal suggestions</div>
            <div className="step-body">
              Browse a curated selection of recipes tailored to your mood,
              preferences, and nutritional needs.
            </div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-icon">📅</div>
            <div className="step-title">Plan your meals</div>
            <div className="step-body">
              Use the meal planner calendar to organize your meals and stay
              on track throughout the week or month.
            </div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-icon">❤️</div>
            <div className="step-title">Save your favorites</div>
            <div className="step-body">
              Build a personal collection of go-to recipes and track your
              nutrition journey over time.
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section className="team-section">
        <div className="team-header">
          <p className="section-tag">The People Behind It</p>
          <h2>Meet the Team</h2>
          <p>
            A small, passionate team brought Cook Orbit to life — driven by a love
            for food, design, and making everyday life a little easier.
          </p>
        </div>

        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-top tc-green">🧑‍💻</div>
            <div className="team-card-body">
              <div className="tc-name">Alex Reyes</div>
              <div className="tc-role">Lead Developer</div>
              <div className="tc-bio">
                Built the core platform and meal recommendation engine.
                Passionate about clean code and great food.
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-top tc-gold">🎨</div>
            <div className="team-card-body">
              <div className="tc-name">Jamie Cruz</div>
              <div className="tc-role">UI/UX Designer</div>
              <div className="tc-bio">
                Crafted the visual experience from the ground up, making every
                screen feel warm and intuitive.
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-top tc-sage">🥗</div>
            <div className="team-card-body">
              <div className="tc-name">Sam Lim</div>
              <div className="tc-role">Nutrition Researcher</div>
              <div className="tc-bio">
                Ensured every mood-to-meal pairing is backed by thoughtful
                nutritional insight and real science.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="final-cta">
        <div className="cta-left">
          <h2>Ready to start<br />planning?</h2>
          <p>Find meals that match your mood today. Happy planning and happy eating!</p>
        </div>
        <button className="cta-btn-dark">Start Planning →</button>
      </div>

    </div>
  );
}
