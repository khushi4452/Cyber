

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardActivity from "./pages/DashboardActivity";
import DashboardFiles from "./pages/DashboardFiles";
import DashboardProfile from "./pages/DashboardProfile";

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

