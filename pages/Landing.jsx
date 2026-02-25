import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="hero-card">
        <h1 className="fade-in">Certification Tracker</h1>

        <p className="fade-in delay">
          Track, manage, and renew your professional certifications effortlessly.
        </p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            className="start-btn"
            onClick={() => navigate("/register")}
          >
            Sign Up Free
          </button>
          
          <button
            className="start-btn"
            style={{ 
              background: "white", 
              color: "#00c6ff",
              border: "2px solid #00c6ff"
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;