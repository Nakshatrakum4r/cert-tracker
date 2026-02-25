import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCerts: 0,
    expiredCerts: 0,
    expiringSoon: 0,
    validCerts: 0
  });
  const [activeOption, setActiveOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateStats = () => {
    const certs = JSON.parse(localStorage.getItem("certs")) || [];
    
    let expired = 0;
    let expiringSoon = 0;
    let valid = 0;
    
    certs.forEach(cert => {
      const days = getDaysUntilExpiry(cert.date);
      if (days < 0) expired++;
      else if (days <= 30) expiringSoon++;
      else valid++;
    });

    setStats({
      totalCerts: certs.length,
      expiredCerts: expired,
      expiringSoon: expiringSoon,
      validCerts: valid
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  const menuOptions = [
    { id: 1, icon: "📜", label: "My Certifications", route: "/my-certifications", color: "#3498db" },
    { id: 2, icon: "➕", label: "Add Certification", route: "/add", color: "#27ae60" },
    { id: 3, icon: "⏰", label: "Expiring Soon", route: "/expiring-soon", color: "#f39c12" },
    { id: 4, icon: "🔔", label: "Renewal Reminder", route: "/renewal-reminder", color: "#9b59b6" },
    { id: 5, icon: "📥", label: "Download Certificates", route: "/download-certs", color: "#16a085" }
  ];

  const handleOptionClick = (option) => {
    setActiveOption(option.id);
    setTimeout(() => {
      navigate(option.route);
    }, 300);
  };

  // Calculate positions for circular layout
  const getCircularPosition = (index, total) => {
    const angle = (index * 360) / total - 90; // Start from top
    const radius = 220; // Distance from center
    const radians = (angle * Math.PI) / 180;
    
    return {
      left: `calc(50% + ${radius * Math.cos(radians)}px)`,
      top: `calc(50% + ${radius * Math.sin(radians)}px)`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div style={styles.container}>
      {/* Logout button */}
      <button style={styles.logoutBtn} onClick={logout}>
        🚪 Logout
      </button>

      {/* Central Dashboard Core */}
      <div style={styles.centerCircle}>
        <div style={styles.profileSection}>
          <div style={styles.userAvatar}>👤</div>
          <h2 style={styles.userName}>My Dashboard</h2>
          <div style={styles.statusIndicator}>
            <span style={styles.statusDot}></span>
            Active
          </div>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.totalCerts}</div>
            <div style={styles.statLabel}>Total Certs</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.validCerts}</div>
            <div style={styles.statLabel}>Valid</div>
          </div>
        </div>

        <div style={styles.quickStats}>
          <span style={{...styles.badge, background: '#e74c3c'}}>
            {stats.expiredCerts} Expired
          </span>
          <span style={{...styles.badge, background: '#f39c12'}}>
            {stats.expiringSoon} Expiring
          </span>
        </div>
      </div>

      {/* Radial Menu Options */}
      {menuOptions.map((option, index) => (
        <div
          key={option.id}
          style={{
            ...styles.menuOption,
            ...getCircularPosition(index, menuOptions.length),
            background: option.color,
            boxShadow: activeOption === option.id 
              ? `0 0 30px ${option.color}, 0 0 60px ${option.color}80` 
              : `0 8px 25px ${option.color}40`
          }}
          onClick={() => handleOptionClick(option)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
            e.currentTarget.style.boxShadow = `0 0 40px ${option.color}, 0 0 80px ${option.color}80`;
          }}
          onMouseLeave={(e) => {
            if (activeOption !== option.id) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${option.color}40`;
            }
          }}
        >
          <div style={styles.optionIcon}>{option.icon}</div>
          <div style={styles.optionLabel}>{option.label}</div>
        </div>
      ))}

      {/* Connecting lines (decorative) */}
      <svg style={styles.connectionSvg}>
        <defs>
          <radialGradient id="lineGradient">
            <stop offset="0%" stopColor="rgba(100, 200, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
          </radialGradient>
        </defs>
        {menuOptions.map((_, index) => {
          const pos = getCircularPosition(index, menuOptions.length);
          return (
            <line
              key={index}
              x1="50%"
              y1="50%"
              x2={`calc(${pos.left})`}
              y2={`calc(${pos.top})`}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              opacity="0.3"
            />
          );
        })}
      </svg>

      {/* Background animated circles */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      <div style={styles.bgCircle3}></div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a1929 0%, #1a2642 50%, #0f1c34 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  logoutBtn: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    padding: '12px 24px',
    background: 'rgba(231, 76, 60, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(231, 76, 60, 0.4)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s',
    zIndex: 1000
  },
  centerCircle: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.2), rgba(30, 60, 114, 0.6))',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(100, 200, 255, 0.3)',
    boxShadow: '0 0 60px rgba(30, 144, 255, 0.4), inset 0 0 30px rgba(100, 200, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 100,
    animation: 'pulse 3s ease-in-out infinite'
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  userAvatar: {
    fontSize: '40px',
    marginBottom: '8px'
  },
  userName: {
    color: 'white',
    fontSize: '20px',
    margin: '8px 0',
    fontWeight: '600'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#26de81',
    fontSize: '13px',
    fontWeight: '500'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#26de81',
    boxShadow: '0 0 10px #26de81',
    animation: 'blink 2s infinite'
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '12px'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px rgba(100, 200, 255, 0.8)'
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '4px'
  },
  quickStats: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'white'
  },
  menuOption: {
    position: 'absolute',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    zIndex: 50,
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  },
  optionIcon: {
    fontSize: '36px',
    marginBottom: '8px'
  },
  optionLabel: {
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1.2',
    padding: '0 10px'
  },
  connectionSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10
  },
  bgCircle1: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent)',
    animation: 'float 8s ease-in-out infinite',
    zIndex: 1
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(155, 89, 182, 0.15), transparent)',
    animation: 'float 10s ease-in-out infinite reverse',
    zIndex: 1
  },
  bgCircle3: {
    position: 'absolute',
    top: '50%',
    right: '20%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26, 188, 156, 0.15), transparent)',
    animation: 'float 12s ease-in-out infinite',
    zIndex: 1
  }
};

export default Dashboard;