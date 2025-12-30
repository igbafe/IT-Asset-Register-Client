import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LaptopDashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Assignments from "./pages/Assignment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LaptopAssignmentDetails from "./pages/AssignmentDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Navigate } from "react-router-dom";
import LaptopQRCodes from "./pages/LaptopQRCodes";
import LaptopQRScanPage from "./pages/QRScanPage";

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
          <Route path="/assignments" element={<Assignments />} />
          <Route
            path="/assignments/:serialNumber"
            element={<LaptopAssignmentDetails />}
          />
          <Route
            path="/laptops/qr/:serialNumber"
            element={<LaptopQRScanPage />}
          />
          <Route path="/laptopQrcodes" element={<LaptopQRCodes />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
