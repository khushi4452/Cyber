// src/components/DashboardLayout.js
import { Outlet, Link } from "react-router-dom";
import { FaUser, FaFileAlt, FaHistory, FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext); 

  return (
    <div className={`dashboard ${theme}`}>
      <aside className="sidebar">
        <h1>BYOD Dashboard</h1>
        <nav>
          {/* ✅ Use Link so it doesn't reload the page */}
          <Link to="profile"><FaUser /> Profile</Link>
          <Link to="files"><FaFileAlt /> Files</Link>
          <Link to="activity"><FaHistory /> Activity</Link>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          <span>{theme === "dark" ? " Light Mode" : " Dark Mode"}</span>
        </button>
      </aside>

      <main className="main-content">
        <Outlet />  {/* ✅ This renders the nested route content */}
      </main>
    </div>
  );
}
