import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RenewalReminder() {
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReminders = () => {
    const allCerts = JSON.parse(localStorage.getItem("certs")) || [];
    
    const reminderList = [];

    allCerts.forEach(cert => {
      const days = getDaysUntilExpiry(cert.date);
      let priority = "";
      let color = "";
      
      if (days < 0) {
        priority = "URGENT - Expired";
        color = "#ff4757";
      } else if (days <= 7) {
        priority = "HIGH - 1 Week";
        color = "#ff6348";
      } else if (days <= 30) {
        priority = "MEDIUM - 1 Month";
        color = "#ffa502";
      } else if (days <= 60) {
        priority = "LOW - 2 Months";
        color = "#f39c12";
      }

      if (priority) {
        reminderList.push({...cert, daysLeft: days, priority, color});
      }
    });

    // Sort by urgency
    reminderList.sort((a, b) => a.daysLeft - b.daysLeft);

    setReminders(reminderList);
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

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Buttons */}
      <button 
        style={styles.backBtn} 
        onClick={() => navigate("/dashboard")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ← Back to Dashboard
      </button>
      <button 
        style={styles.logoutBtn} 
        onClick={logout}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(231, 76, 60, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🚪 Logout
      </button>

      <div style={styles.container}>
        <h1 style={styles.title}>🔔 Renewal Reminders</h1>
        <p style={styles.subtitle}>Stay on top of your certification renewals</p>

        {/* Stats */}
        <div style={styles.statsWrapper}>
          <div style={{...styles.statCard, background: "#9b59b6"}}>
            <h2 style={styles.statNumber}>{reminders.length}</h2>
            <p style={styles.statLabel}>Active Reminders</p>
          </div>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>✅ No renewal reminders at this time!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {reminders.map((cert, index) => (
              <div key={index} style={{...styles.card, borderLeft: `5px solid ${cert.color}`}}>
                <div style={{...styles.priorityBadge, background: cert.color}}>
                  {cert.priority}
                </div>
                <h3 style={styles.certName}>🎓 {cert.name}</h3>
                <div style={styles.certDetails}>
                  <p><strong>🏢 Issuer:</strong> {cert.issuer}</p>
                  <p><strong>📅 Expiry Date:</strong> {new Date(cert.date).toLocaleDateString()}</p>
                  <p><strong>⏰ Days Remaining:</strong> {cert.daysLeft < 0 ? `EXPIRED ${Math.abs(cert.daysLeft)} days ago` : `${cert.daysLeft} days`}</p>
                  {cert.file && <p><strong>📎 File:</strong> {cert.file}</p>}
                </div>
                <div style={{...styles.actionAlert, borderColor: cert.color, color: cert.color}}>
                  {cert.daysLeft < 0 ? "⚠️ Renew immediately!" : "📌 Schedule renewal"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a1929 0%, #1a2642 50%, #0f1c34 100%)',
    position: 'relative',
    overflow: 'auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '40px 20px'
  },
  backBtn: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s',
    zIndex: 1000
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
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px",
    paddingTop: "100px"
  },
  title: {
    fontSize: "32px",
    color: "#fff",
    marginBottom: "8px",
    textShadow: "0 2px 10px rgba(0, 150, 255, 0.3)"
  },
  subtitle: {
    color: "#cbd5e1",
    marginBottom: "30px"
  },
  statsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    padding: "30px",
    borderRadius: "15px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  statNumber: {
    fontSize: "48px",
    margin: "0 0 10px 0",
    fontWeight: "bold"
  },
  statLabel: {
    margin: 0,
    fontSize: "16px",
    opacity: 0.9
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "transform 0.2s"
  },
  priorityBadge: {
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    display: "inline-block",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
  },
  certName: {
    fontSize: "20px",
    color: "#fff",
    marginBottom: "15px"
  },
  certDetails: {
    color: "#cbd5e1",
    lineHeight: "1.8",
    marginBottom: "15px"
  },
  actionAlert: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    border: "2px solid"
  },
  emptyCard: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    color: "#26de81",
    fontSize: "18px",
    fontWeight: "600",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  }
};

export default RenewalReminder;
