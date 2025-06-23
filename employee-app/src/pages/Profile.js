// src/pages/Profile.js
import { motion } from "framer-motion";
import "./Profile.css";

export default function Profile() {
  const employee = {
    name: "John Doe",
    position: "Software Engineer",
    joined: "2023-01-01",
    status: "Active Employee",
  };

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>👤 Employee Profile</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Joined:</strong> {new Date(employee.joined).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {employee.status}</p>
    </motion.div>
  );
}
