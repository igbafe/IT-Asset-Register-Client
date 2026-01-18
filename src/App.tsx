import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LaptopDashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Navigate } from "react-router-dom";

import LaptopQRScanPage from "./pages/QRScanPage";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* <Route path="/passkeyModal" element={<PasskeyModal />} /> */}

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<LaptopDashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route
            path="/laptops/qr/:serialNumber"
            element={<LaptopQRScanPage />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
