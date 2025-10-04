import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import { PasskeyModal } from "./components/PasskeyModal";
import SignUp from "./pages/auth/SignUp";
import LaptopDashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Assignments from "./pages/Assignment";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<LaptopDashboard />} />
         <Route path="/inventory" element={<Inventory />} />
          <Route path="/assignments" element={<Assignments />} />
        <Route path="/passkeyModal" element={<PasskeyModal />} />
      </Routes>
    </div>
  );
}

export default App;
