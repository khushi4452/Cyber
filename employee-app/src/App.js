// employee-app/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Theme provider
import LoginPage from "./pages/LoginPage";
import DeviceCheckPage from "./pages/DeviceCheckPage";
import DashboardLayout from "./components/DashboardLayout"; 
import Profile from "./pages/Profile";       // ✅ NEW
import Files from "./pages/Files";           // ✅ Example page
import Activity from "./pages/Activity";     // ✅ Example page



function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/device-check" element={<DeviceCheckPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Nested routes inside DashboardLayout */}
            <Route path="profile" element={<Profile />} />
            <Route path="files" element={<Files />} />
            <Route path="activity" element={<Activity />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
