import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AllCertifications() {
  const [certs, setCerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = () => {
    const storedCerts = JSON.parse(localStorage.getItem("certs")) || [];
    setCerts(storedCerts);
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { text: "Expired", color: "#ff4757", status: "expired" };
    if (days <= 30) return { text: `${days} days left`, color: "#ffa502", status: "expiring" };
    return { text: `${days} days left`, color: "#26de81", status: "valid" };
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  const filteredCerts = certs.filter(cert => {
    const status = getExpiryStatus(cert.date).status;
    if (filter === "all") return true;
    return status === filter;
  });

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Buttons */}
      <button 
        style={styles.backBtn} 
        onClick={() => navigate("/admin/dashboard")}
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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📊 All Certifications</h1>
            <p style={styles.subtitle}>View certifications from all users</p>
          </div>
          <div style={styles.certCount}>
            Total: <strong>{certs.length}</strong>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={styles.filterWrapper}>
          <button 
            style={filter === "all" ? {...styles.filterBtn, ...styles.activeFilter} : styles.filterBtn}
            onClick={() => setFilter("all")}
          >
            All ({certs.length})
          </button>
          <button 
            style={filter === "valid" ? {...styles.filterBtn, ...styles.activeFilter} : styles.filterBtn}
            onClick={() => setFilter("valid")}
          >
            Valid ({certs.filter(c => getExpiryStatus(c.date).status === "valid").length})
          </button>
          <button 
            style={filter === "expiring" ? {...styles.filterBtn, ...styles.activeFilter} : styles.filterBtn}
            onClick={() => setFilter("expiring")}
          >
            Expiring Soon ({certs.filter(c => getExpiryStatus(c.date).status === "expiring").length})
          </button>
          <button 
            style={filter === "expired" ? {...styles.filterBtn, ...styles.activeFilter} : styles.filterBtn}
            onClick={() => setFilter("expired")}
          >
            Expired ({certs.filter(c => getExpiryStatus(c.date).status === "expired").length})
          </button>
        </div>

        {/* Certifications Grid */}
        {filteredCerts.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={{color: '#fff'}}>📜 No certifications found</h2>
            <p style={{color: '#cbd5e1'}}>No certifications match your filter.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredCerts.map((cert, index) => {
              const status = getExpiryStatus(cert.date);
              return (
                <div key={index} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.certName}>🎓 {cert.name}</h3>
                    <span style={{...styles.statusBadge, color: "white", background: status.color}}>
                      {status.text}
                    </span>
                  </div>

                  <div style={styles.certDetails}>
                    <p><strong>🏢 Issuer:</strong> {cert.issuer}</p>
                    <p><strong>📅 Expiry Date:</strong> {new Date(cert.date).toLocaleDateString()}</p>
                    <p><strong>⏰ Days Left:</strong> {getDaysUntilExpiry(cert.date)} days</p>
                    {cert.file && (
                      <p><strong>📎 File:</strong> {cert.file}</p>
                    )}
                    {cert.addedOn && (
                      <p style={{fontSize: "12px", color: "#a4b0be", marginTop: "10px"}}>
                        Added: {new Date(cert.addedOn).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px"
  },
  title: {
    fontSize: "32px",
    color: "#fff",
    margin: 0,
    textShadow: "0 2px 10px rgba(0, 150, 255, 0.3)"
  },
  subtitle: {
    color: "#cbd5e1",
    margin: "5px 0 0 0"
  },
  certCount: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "15px 25px",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  filterWrapper: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  filterBtn: {
    padding: "12px 24px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s",
    color: "#cbd5e1"
  },
  activeFilter: {
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    color: "white",
    border: "2px solid transparent",
    boxShadow: "0 4px 15px rgba(0, 200, 255, 0.3)"
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
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "15px",
    gap: "10px"
  },
  certName: {
    margin: 0,
    color: "#fff",
    fontSize: "20px",
    flex: 1
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap"
  },
  certDetails: {
    lineHeight: "1.8",
    color: "#cbd5e1"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  }
};

export default AllCertifications;
