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
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminClasses from "./pages/Admin/AdminCategories";
import AdminUsers from "./pages/Admin/AdminUsers";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ortak Rotalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Müşteri Rotaları */}
        <Route path="/user/*" element={<CustomerRoute />}>
          <Route path="dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout> } />
          <Route path="products" element={<AdminLayout><AdminProducts /></AdminLayout> } />
          <Route path="classes" element={<AdminLayout><AdminClasses /></AdminLayout> } />
          <Route path="users" element={<AdminLayout><AdminUsers /></AdminLayout> } />

        {/* Diğer müşteri sayfaları buraya eklenebilir */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
