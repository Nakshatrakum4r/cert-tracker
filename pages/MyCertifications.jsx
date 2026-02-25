import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyCertifications() {
  const [certs, setCerts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCertifications = () => {
    const stored = JSON.parse(localStorage.getItem("certs")) || [];
    setCerts(stored);
  };

  const deleteCert = (index) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      const updated = certs.filter((_, i) => i !== index);
      localStorage.setItem("certs", JSON.stringify(updated));
      setCerts(updated);
      alert("✅ Certification deleted!");
    }
  };

  const startEdit = (index) => {
    setEditingId(index);
    setEditForm(certs[index]);
  };

  const saveEdit = (index) => {
    const updated = [...certs];
    updated[index] = editForm;
    localStorage.setItem("certs", JSON.stringify(updated));
    setCerts(updated);
    setEditingId(null);
    alert("✅ Certification updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { text: "Expired", color: "#ff4757", bg: "rgba(255, 71, 87, 0.2)" };
    if (days <= 30) return { text: `${days} days left`, color: "#ffa502", bg: "rgba(255, 165, 2, 0.2)" };
    return { text: `${days} days left`, color: "#26de81", bg: "rgba(38, 222, 129, 0.2)" };
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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📜 My Certifications</h1>
            <p style={styles.subtitle}>View and manage your certifications</p>
          </div>
          <button style={styles.addBtn} onClick={() => navigate("/add")}>
            ➕ Add New
          </button>
        </div>

        {certs.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={{color: '#fff'}}>📋 No certifications yet</h2>
            <p style={{color: '#cbd5e1'}}>Start by adding your first certification!</p>
            <button style={styles.addBtn} onClick={() => navigate("/add")}>
              Add Certification
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {certs.map((cert, index) => {
              const status = getExpiryStatus(cert.date);
              const isEditing = editingId === index;

              return (
                <div key={index} style={styles.card}>
                  {isEditing ? (
                    // Edit Mode
                    <div>
                      <input
                        style={styles.input}
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Certification Name"
                      />
                      <input
                        style={styles.input}
                        value={editForm.issuer}
                        onChange={(e) => setEditForm({...editForm, issuer: e.target.value})}
                        placeholder="Issuer"
                      />
                      <input
                        style={styles.input}
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      />
                      <div style={styles.editActions}>
                        <button style={styles.saveBtn} onClick={() => saveEdit(index)}>
                          ✅ Save
                        </button>
                        <button style={styles.cancelBtn} onClick={cancelEdit}>
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div style={styles.cardHeader}>
                        <h3 style={styles.certName}>🎓 {cert.name}</h3>
                        <span style={{...styles.statusBadge, color: status.color, background: status.bg, border: `1px solid ${status.color}`}}>
                          {status.text}
                        </span>
                      </div>

                      <div style={styles.certDetails}>
                        <p><strong>🏢 Issuer:</strong> {cert.issuer}</p>
                        <p><strong>📅 Expiry Date:</strong> {new Date(cert.date).toLocaleDateString()}</p>
                        {cert.file && (
                          <p><strong>📎 File:</strong> {cert.file}</p>
                        )}
                      </div>

                      <div style={styles.actions}>
                        <button style={styles.editBtn} onClick={() => startEdit(index)}>
                          ✏️ Edit
                        </button>
                        <button style={styles.deleteBtn} onClick={() => deleteCert(index)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
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
    color: "#fff",
    fontSize: "32px",
    margin: 0,
    textShadow: "0 2px 10px rgba(0, 150, 255, 0.3)"
  },
  subtitle: {
    color: "#cbd5e1",
    margin: "5px 0 0 0"
  },
  addBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(0, 200, 255, 0.3)"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
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
    cursor: "default",
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
    marginBottom: "20px",
    lineHeight: "1.8",
    color: "#cbd5e1"
  },
  actions: {
    display: "flex",
    gap: "10px"
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s",
    boxShadow: "0 2px 10px rgba(52, 152, 219, 0.3)"
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s",
    boxShadow: "0 2px 10px rgba(231, 76, 60, 0.3)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    outline: "none"
  },
  editActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  saveBtn: {
    flex: 1,
    padding: "10px",
    background: "#26de81",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(38, 222, 129, 0.3)"
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(108, 117, 125, 0.3)"
  }
};

export default MyCertifications;
