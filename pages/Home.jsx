import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home">
      
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">Certification Tracker 🚀</h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login">Log in</Link>
          <Link to="/register" className="signup-btn">Sign up</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">

        <div className="hero-left">
          <p className="tag">✨ MANAGE CERTIFICATIONS EFFORTLESSLY</p>

          <h1>
            Never miss <span>certificate expiry</span> again
          </h1>

          <p className="desc">
            Certification Tracker is your all-in-one platform to manage, track,
            and renew all your professional certifications.
            Automated notifications, detailed analytics, and secure storage —
            all in one place.
          </p>

          <div className="buttons">
            <button className="primary">Start Free Trial</button>
            <button className="secondary">Watch Demo</button>
          </div>

          <p className="note">
            🎁 Free forever plan available • No credit card required
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="hero-card">
          <div className="card-content">
            📜
            <h3>Certificate Management</h3>
            <p>Made Simple</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;