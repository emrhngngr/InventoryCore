import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CustomerRoute from "./routes/CustomerRoute";

// Sayfalar
import AdminClasses from "./pages/Admin/AdminCategories";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminProcess from "./pages/Admin/AdminProcess";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminUsers from "./pages/Admin/AdminUsers";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AnnouncementsPage from "./pages/Admin/AnnouncementsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ortak Rotalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Müşteri Rotaları */}
        <Route path="/user/*" element={<CustomerRoute />}>
          <Route
            path="dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="products"
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />
          <Route
            path="classes"
            element={
              <AdminLayout>
                <AdminClasses />
              </AdminLayout>
            }
          />
          <Route
            path="users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />
          <Route
            path="profile"
            element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            }
          />
          <Route
            path="process"
            element={
              <AdminLayout>
                <AdminProcess />
              </AdminLayout>
            }
          />
          <Route
            path="announcements"
            element={
              <AdminLayout>
                <AnnouncementsPage />
              </AdminLayout>
            }
          />

          {/* Diğer müşteri sayfaları buraya eklenebilir */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
