import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";

// Sayfalar
import AdminClasses from "./pages/Admin/AdminCategories";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogs from "./pages/Admin/AdminLogs";
import AdminProcess from "./pages/Admin/AdminProcess";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminStatistics from "./pages/Admin/AdminStatistics";
import AdminUsers from "./pages/Admin/AdminUsers";
import AnnouncementsPage from "./pages/Admin/AnnouncementsPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ortak Rotalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/user/*" element={<LoginRoute />}>
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
          <Route
            path="logs"
            element={
              <AdminLayout>
                <AdminLogs />
              </AdminLayout>
            }
          />
          <Route
            path="statistics"
            element={
              <AdminLayout>
                <AdminStatistics />
              </AdminLayout>
            }
          />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
