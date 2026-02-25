import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    setUsers(storedUsers);
  };

  const deleteUser = (index) => {
    if (window.confirm(`Are you sure you want to delete ${users[index].name}?`)) {
      const updated = users.filter((_, i) => i !== index);
      localStorage.setItem("allUsers", JSON.stringify(updated));
      setUsers(updated);
      alert("✅ User deleted successfully!");
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 style={styles.title}>👥 All Users</h1>
            <p style={styles.subtitle}>Manage registered users</p>
          </div>
          <div style={styles.userCount}>
            Total Users: <strong>{users.length}</strong>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={{color: '#fff'}}>👤 No users found</h2>
            <p style={{color: '#cbd5e1'}}>There are no registered users yet.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Registered On</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}><strong>{user.name}</strong></td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={user.role === "admin" ? styles.adminBadge : styles.userBadge}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => deleteUser(index)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  userCount: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "15px 25px",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  searchWrapper: {
    marginBottom: "25px"
  },
  searchInput: {
    width: "100%",
    padding: "15px 20px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff"
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
  tableWrapper: {
    background: "rgba(26, 38, 66, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    color: "white"
  },
  th: {
    padding: "18px 15px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.5px"
  },
  tableRow: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "background 0.2s"
  },
  td: {
    padding: "18px 15px",
    color: "#cbd5e1"
  },
  adminBadge: {
    background: "#e74c3c",
    color: "white",
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(231, 76, 60, 0.3)"
  },
  userBadge: {
    background: "#3498db",
    color: "white",
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(52, 152, 219, 0.3)"
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    transition: "all 0.2s",
    boxShadow: "0 2px 10px rgba(231, 76, 60, 0.3)"
  }
};

export default AllUsers;
