import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DownloadCerts() {
  const [certs, setCerts] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCertifications = () => {
    const stored = JSON.parse(localStorage.getItem("certs")) || [];
    setCerts(stored);
  };

  const toggleCertSelection = (index) => {
    if (selectedCerts.includes(index)) {
      setSelectedCerts(selectedCerts.filter(i => i !== index));
    } else {
      setSelectedCerts([...selectedCerts, index]);
    }
  };

  const selectAll = () => {
    if (selectedCerts.length === certs.length) {
      setSelectedCerts([]);
    } else {
      setSelectedCerts(certs.map((_, i) => i));
    }
  };

  const downloadSelected = () => {
    if (selectedCerts.length === 0) {
      alert("⚠️ Please select at least one certification to download");
      return;
    }

    const selectedData = selectedCerts.map(index => certs[index]);
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certifications_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ ${selectedCerts.length} certification(s) downloaded successfully!`);
  };

  const downloadAll = () => {
    if (certs.length === 0) {
      alert("⚠️ No certifications available to download");
      return;
    }

    const dataStr = JSON.stringify(certs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_certifications_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ All ${certs.length} certifications downloaded successfully!`);
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
        <h1 style={styles.title}>📥 Download Certificates</h1>
        <p style={styles.subtitle}>Select and download your certifications</p>

        {/* Action Buttons */}
        <div style={styles.actionBar}>
          <button style={styles.selectAllBtn} onClick={selectAll}>
            {selectedCerts.length === certs.length ? "✖️ Deselect All" : "✔️ Select All"}
          </button>
          <button style={styles.downloadBtn} onClick={downloadSelected}>
            📥 Download Selected ({selectedCerts.length})
          </button>
          <button style={styles.downloadAllBtn} onClick={downloadAll}>
            📥 Download All
          </button>
        </div>

        {/* Certifications List */}
        {certs.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>📋 No certifications available to download</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {certs.map((cert, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.card,
                  border: selectedCerts.includes(index) 
                    ? '2px solid #00c6ff' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedCerts.includes(index)
                    ? '0 0 20px rgba(0, 198, 255, 0.4)'
                    : '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => toggleCertSelection(index)}
              >
                <div style={styles.cardHeader}>
                  <input
                    type="checkbox"
                    checked={selectedCerts.includes(index)}
                    onChange={() => toggleCertSelection(index)}
                    style={styles.checkbox}
                  />
                  <h3 style={styles.certName}>🎓 {cert.name}</h3>
                </div>

                <div style={styles.certDetails}>
                  <p><strong>🏢 Issuer:</strong> {cert.issuer}</p>
                  <p><strong>📅 Expiry Date:</strong> {new Date(cert.date).toLocaleDateString()}</p>
                  {cert.file && (
                    <p><strong>📎 File:</strong> {cert.file}</p>
                  )}
                  {cert.addedOn && (
                    <p style={{fontSize: "12px", color: "#94a3b8", marginTop: "10px"}}>
                      Added: {new Date(cert.addedOn).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {selectedCerts.includes(index) && (
                  <div style={styles.selectedIndicator}>
                    ✅ Selected
                  </div>
                )}
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
  actionBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  selectAllBtn: {
    padding: "12px 24px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s",
    backdropFilter: "blur(10px)"
  },
  downloadBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(0, 200, 255, 0.3)"
  },
  downloadAllBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #16a085 0%, #27ae60 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(22, 160, 133, 0.3)"
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
    transition: "all 0.3s",
    cursor: "pointer",
    position: "relative"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px"
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer"
  },
  certName: {
    margin: 0,
    color: "#fff",
    fontSize: "20px",
    flex: 1
  },
  certDetails: {
    marginBottom: "15px",
    lineHeight: "1.8",
    color: "#cbd5e1"
  },
  selectedIndicator: {
    background: "rgba(0, 198, 255, 0.2)",
    color: "#00c6ff",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid rgba(0, 198, 255, 0.4)"
  },
  emptyCard: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    color: "#cbd5e1",
    fontSize: "18px",
    fontWeight: "600",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  }
};

export default DownloadCerts;
