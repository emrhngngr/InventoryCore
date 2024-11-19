import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";
import CustomerRoute from "./routes/CustomerRoute";

// Sayfalar
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ortak Rotalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Rotaları */}
        <Route path="/admin/*" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Diğer admin sayfaları buraya eklenebilir */}
        </Route>

        {/* Müşteri Rotaları */}
        <Route path="/user/*" element={<CustomerRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
          {/* Diğer müşteri sayfaları buraya eklenebilir */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
