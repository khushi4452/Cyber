import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardFiles from "./pages/DashboardFiles";
import DashboardActivity from "./pages/DashboardActivity";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="files" element={<DashboardFiles />} />
          <Route path="activity" element={<DashboardActivity />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

