import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Reuse Login styles

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    // Save user data to localStorage
    const userData = {
      name: form.name,
      email: form.email,
      role: "user",
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", "user");

    // Add to all users list for admin to see
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    allUsers.push(userData);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    alert("✅ Registration Successful! Welcome " + form.name);
    navigate("/login");
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError(""); // Clear error on input
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(255, 0, 0, 0.2)",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            color: "#ff6b6b",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Register
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00c6ff", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;