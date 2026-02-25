import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddCertification from "./pages/AddCertification.jsx";
import MyCertifications from "./pages/MyCertifications.jsx";
import ExpiringSoon from "./pages/ExpiringSoon.jsx";
import RenewalReminder from "./pages/RenewalReminder.jsx";
import DownloadCerts from "./pages/DownloadCerts.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import AllCertifications from "./pages/AllCertifications.jsx";
import ExpiredCertifications from "./pages/ExpiredCertifications.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddCertification />} />
        <Route path="/my-certifications" element={<MyCertifications />} />
        <Route path="/expiring-soon" element={<ExpiringSoon />} />
        <Route path="/renewal-reminder" element={<RenewalReminder />} />
        <Route path="/download-certs" element={<DownloadCerts />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AllUsers />} />
        <Route path="/admin/all-certifications" element={<AllCertifications />} />
        <Route path="/admin/expired" element={<ExpiredCertifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;