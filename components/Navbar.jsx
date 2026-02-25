import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <h2 style={styles.logo}>🎓 Certification Tracker</h2>
        <span style={styles.badge}>{userRole === "admin" ? "ADMIN" : "USER"}</span>
      </div>
      
      <div style={styles.links}>
        {userRole === "admin" ? (
          // Admin Menu
          <>
            <Link 
              to="/admin/dashboard" 
              style={{...styles.link, ...(isActive("/admin/dashboard") ? styles.activeLink : {})}}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              style={{...styles.link, ...(isActive("/admin/users") ? styles.activeLink : {})}}
            >
              👥 All Users
            </Link>
            <Link 
              to="/admin/all-certifications" 
              style={{...styles.link, ...(isActive("/admin/all-certifications") ? styles.activeLink : {})}}
            >
              📜 All Certifications
            </Link>
            <Link 
              to="/admin/expired" 
              style={{...styles.link, ...(isActive("/admin/expired") ? styles.activeLink : {})}}
            >
              ⚠️ Expired
            </Link>
          </>
        ) : (
          // User Menu
          <>
            <Link 
              to="/dashboard" 
              style={{...styles.link, ...(isActive("/dashboard") ? styles.activeLink : {})}}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/add" 
              style={{...styles.link, ...(isActive("/add") ? styles.activeLink : {})}}
            >
              ➕ Add Certification
            </Link>
          </>
        )}
        <button onClick={logout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  logo: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold"
  },
  badge: {
    background: "rgba(255,255,255,0.2)",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    border: "1px solid rgba(255,255,255,0.3)"
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s",
    fontWeight: "500",
    background: "rgba(255,255,255,0.1)",
    whiteSpace: "nowrap"
  },
  activeLink: {
    background: "rgba(255,255,255,0.3)",
    fontWeight: "bold"
  },
  logoutBtn: {
    padding: "8px 20px",
    border: "2px solid white",
    borderRadius: "8px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s",
    whiteSpace: "nowrap"
  }
};

export default Navbar;