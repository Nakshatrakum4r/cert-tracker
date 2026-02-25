import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCertification() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    issuer: "",
    date: "",
    file: null
  });

  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file: file });
      setFileName(file.name);
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const newCert = {
      name: form.name,
      issuer: form.issuer,
      date: form.date,
      file: fileName || "",
      addedOn: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("certs")) || [];
    existing.push(newCert);
    localStorage.setItem("certs", JSON.stringify(existing));

    alert("✅ Certification Added Successfully!");
    navigate("/dashboard");
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
        <div style={styles.card}>
          <h2 style={styles.title}>➕ Add New Certification</h2>
          <p style={styles.subtitle}>Fill in the details below to add your certification</p>

          <form onSubmit={submit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>🎓 Certification Name *</label>
              <input
                style={styles.input}
                placeholder="e.g., AWS Certified Solutions Architect"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🏢 Issuing Organization *</label>
              <input
                style={styles.input}
                placeholder="e.g., Amazon Web Services"
                required
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📅 Expiry Date *</label>
              <input
                type="date"
                style={styles.input}
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📎 Upload Certificate (Optional)</label>
              <div style={styles.fileInputWrapper}>
                <input
                  type="file"
                  style={styles.fileInput}
                  id="fileUpload"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="fileUpload" style={styles.fileLabel}>
                  {fileName ? `✅ ${fileName}` : "📁 Choose File"}
                </label>
              </div>
              <small style={styles.hint}>Accepted formats: PDF, JPG, PNG</small>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>
                ✅ Save Certification
              </button>
              <button 
                type="button" 
                style={styles.cancelBtn}
                onClick={() => navigate("/dashboard")}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
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
    padding: '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
    width: "100%"
  },
  card: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    marginBottom: "8px",
    textAlign: "center",
    textShadow: "0 2px 10px rgba(0, 150, 255, 0.3)"
  },
  subtitle: {
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: "30px"
  },
  formGroup: {
    marginBottom: "24px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s",
    boxSizing: "border-box",
    outline: "none",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff"
  },
  fileInputWrapper: {
    position: "relative"
  },
  fileInput: {
    opacity: 0,
    position: "absolute",
    zIndex: -1
  },
  fileLabel: {
    display: "block",
    padding: "12px 16px",
    border: "2px dashed rgba(0, 200, 255, 0.3)",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    color: "#cbd5e1",
    fontWeight: "500",
    background: "rgba(255, 255, 255, 0.05)"
  },
  hint: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "13px"
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "30px"
  },
  submitBtn: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(0, 200, 255, 0.3)"
  },
  cancelBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(108, 117, 125, 0.6)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s"
  }
};

export default AddCertification;