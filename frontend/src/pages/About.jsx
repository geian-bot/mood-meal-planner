import Navbar from "../components/Navbar";
import "./about.css";
import logo from "../assets/cook-orbit.png";
import geian from "../assets/geian.jpg";
import ysabelle from "../assets/ysabelle.jpg";
import alliyah from "../assets/alliyah.png";
import { useNavigate } from "react-router-dom";
export default function About() {

  const navigate = useNavigate();
  const handleStartPlanning = () => {
    const savedUser = localStorage.getItem("username");
    navigate(savedUser ? "/calendar" : "/login");
  };

  return (
    <div className="about-page">
        <Navbar />

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
            <div className="step-title">Choose your mood</div>
            <div className="step-body">
              Select how you're feeling and let Cook Orbit find recipes that
              match your current energy and emotion.
            </div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Get meal suggestions</div>
            <div className="step-body">
              Browse a curated selection of recipes tailored to your mood,
              preferences, and nutritional needs.
            </div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">Plan your meals</div>
            <div className="step-body">
              Use the meal planner calendar to organize your meals and stay
              on track throughout the week or month.
            </div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
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
            <div className="team-card-top tc-green">
              <img src={geian} alt="Geian Natividad" className="tc-photo" />
            </div>
            <div className="team-card-body">
              <div className="tc-name">Geian Natividad</div>
              <div className="tc-role">Backend Developer</div>
              <div className="tc-bio">
                Built the core platform and meal recommendation engine.
                Passionate about clean code and great food.
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-top tc-gold">
              <img src={ysabelle} alt="Ysabelle Estabaya" className="tc-photo" />
            </div>
            <div className="team-card-body">
              <div className="tc-name">Ysabelle Estabaya</div>
              <div className="tc-role">UI/UX Designer</div>
              <div className="tc-bio">
                Crafted the visual experience from the ground up, making every
                screen feel warm and intuitive.
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-top tc-sage">
              <img src={alliyah} alt="Alliyah Bibat" className="tc-photo" />
            </div>
            <div className="team-card-body">
              <div className="tc-name">Alliyah Bibat</div>
              <div className="tc-role">Backend Developer</div>
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
        <button className="cta-btn-dark" onClick={handleStartPlanning}>Start Planning →</button>
      </div>

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
