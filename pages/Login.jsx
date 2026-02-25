import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Check if admin credentials
    if (credentials.email === "admin@gmail.com" && credentials.password === "admin@123") {
      // Admin login
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", credentials.email);
      alert("✅ Welcome Admin!");
      navigate("/admin/dashboard");
    } else {
      // Regular user login (you can add more validation here)
      localStorage.setItem("userRole", "user");
      localStorage.setItem("userEmail", credentials.email);
      alert("✅ Welcome User!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(255, 0, 0, 0.2)",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            color: "#ff6b6b",
            fontSize: "14px",
            border: "1px solid rgba(255, 0, 0, 0.3)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required 
          />

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#00c6ff", textDecoration: "none" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;