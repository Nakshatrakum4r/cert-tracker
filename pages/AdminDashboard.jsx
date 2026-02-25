import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCerts: 0,
    expiredCerts: 0,
    expiringSoon: 0
  });
  const [activeOption, setActiveOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateStats = () => {
    const users = JSON.parse(localStorage.getItem("allUsers")) || [];
    const certs = JSON.parse(localStorage.getItem("certs")) || [];
    
    let expired = 0;
    let expiringSoon = 0;
    
    certs.forEach(cert => {
      const days = getDaysUntilExpiry(cert.date);
      if (days < 0) expired++;
      else if (days <= 30) expiringSoon++;
    });

    setStats({
      totalUsers: users.length,
      totalCerts: certs.length,
      expiredCerts: expired,
      expiringSoon: expiringSoon
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
    { id: 1, icon: "👥", label: "Manage Users", route: "/admin/users", color: "#3498db" },
    { id: 2, icon: "📊", label: "All Certifications", route: "/admin/all-certifications", color: "#9b59b6" },
    { id: 3, icon: "❌", label: "Expired Certs", route: "/admin/expired", color: "#e74c3c" },
    { id: 4, icon: "⏰", label: "Expiring Soon", route: "/admin/expired", color: "#f39c12" },
    { id: 5, icon: "✅", label: "Renewal Approvals", route: "/admin/all-certifications", color: "#27ae60" },
    { id: 6, icon: "📈", label: "Reports & Analytics", route: "/admin/all-certifications", color: "#16a085" }
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
          <div style={styles.adminAvatar}>👨‍💼</div>
          <h2 style={styles.adminName}>Admin Panel</h2>
          <div style={styles.statusIndicator}>
            <span style={styles.statusDot}></span>
            Online
          </div>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.totalCerts}</div>
            <div style={styles.statLabel}>Certifications</div>
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
    border: '2px solid #e74c3c',
    borderRadius: '25px',
    color: '#e74c3c',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
    zIndex: 1000
  },
  centerCircle: {
    position: 'absolute',
    width: '280px',
    height: '280px',
    background: 'linear-gradient(135deg, rgba(26, 38, 66, 0.95) 0%, rgba(15, 28, 52, 0.95) 100%)',
    borderRadius: '50%',
    border: '3px solid rgba(100, 200, 255, 0.3)',
    boxShadow: '0 0 60px rgba(0, 150, 255, 0.4), inset 0 0 60px rgba(0, 150, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    animation: 'pulse 3s infinite',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  adminAvatar: {
    fontSize: '48px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 150, 255, 0.5))'
  },
  adminName: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 10px rgba(0, 150, 255, 0.5)'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#26de81',
    fontWeight: '600'
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
    color: '#00d4ff',
    textShadow: '0 0 20px rgba(0, 212, 255, 0.8)'
  },
  statLabel: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
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
    fontSize: '10px',
    fontWeight: 'bold',
    color: 'white'
  },
  menuOption: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    zIndex: 5
  },
  optionIcon: {
    fontSize: '42px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
  },
  optionLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    lineHeight: '1.2'
  },
  connectionSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 1
  },
  bgCircle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 150, 255, 0.1) 0%, transparent 70%)',
    animation: 'rotate 20s linear infinite',
    zIndex: 0
  },
  bgCircle2: {
    position: 'absolute',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
    animation: 'rotate 30s linear infinite reverse',
    zIndex: 0
  },
  bgCircle3: {
    position: 'absolute',
    width: '1000px',
    height: '1000px',
    borderRadius: '50%',
    border: '1px solid rgba(100, 200, 255, 0.1)',
    animation: 'rotate 40s linear infinite',
    zIndex: 0
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 60px rgba(0, 150, 255, 0.4), inset 0 0 60px rgba(0, 150, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 80px rgba(0, 150, 255, 0.6), inset 0 0 80px rgba(0, 150, 255, 0.2);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;
