import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNotifications from "../pages/Admin/AdminNotifications";
import Report from "../pages/Report/Report";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminReportDetail from "../pages/Admin/AdminReportdetail";
import Profile from "../pages/Profile/Profile";
import Home from "../pages/Home/Home";
import LandingPage from "../pages/Home/LandingPage";
import AdminSettings from "../pages/Admin/AdminSettings";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Statistics from "../pages/Admin/Statistics";
import Dashboard from "../pages/Admin/Dashboard";
import AdminReports from "../pages/Admin/AdminReports";
import Staff from "../pages/Staff";
import MyReports from "../pages/MyReports/MyReports";
import ReportDetail from "../pages/Report/ReportDetail";
import EditReport from "../pages/Report/EditReport";
import Notifications from "../pages/Notifications/Notifications";
import NearbyReports from "../pages/NearbyReports/NearbyReports";
import CreateStaff from "../pages/Admin/CreateStaff";
import { useAuth } from "../context/AuthContext";
import AdminRoute from "../components/AdminRoute";
import EditStaff from "../pages/Admin/EditStaff";
import Messages from "../pages/Admin/Messages";
import VeterinarianLayout from "../layouts/VeterinarianLayout";
import VeterinarianDashboard from "../pages/Admin/VeterinarianDashboard";
import VeterinarianStatistics from "../pages/Admin/VeterinarianStatistics";
import VeterinarianReports from "../pages/Admin/VeterinarianReports";
import VeterinarianReportDetail from "../pages/Admin/VeterinarianReportDetail";
import VeterinarianNotifications from "../pages/Admin/VeterinarianNotifications";
import Vets from "../pages/Vets/Vets";
import VeterinarianSettings from "../pages/Admin/VeterinarianSettings";

function AppRouter() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
  <Routes>

  {/* Veteriner Paneli */}

  <Route
    path="/veterinarian"
    element={<VeterinarianLayout />}
  >
    <Route
      index
      element={<VeterinarianDashboard />}
    />

    <Route
      path="statistics"
      element={<VeterinarianStatistics />}
    />
    <Route
    path="reports"
    element={<VeterinarianReports />}
/>
<Route
    path="reports/:id"
    element={<VeterinarianReportDetail />}
/>
<Route
    path="notifications"
    element={<VeterinarianNotifications />}
/>
<Route
    path="messages"
    element={<Messages />}
/>
<Route
    path="settings"
    element={<VeterinarianSettings />}
/>
  </Route>
  

    {/* Admin Paneli */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route path="/admin/statistics" element={<Statistics />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route index element={<Dashboard />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="reports/:id" element={<AdminReportDetail />} />
      <Route path="notifications" element={<AdminNotifications />} />
      <Route path="messages" element={<Messages />} />
      <Route path="staff" element={<Staff />} />
      <Route path="create-staff" element={<CreateStaff />} />
      <Route
    path="edit-staff/:id"
    element={<EditStaff />}
/>
    </Route>

    {/* Kullanıcı Paneli */}
    <Route
      path="*"
      element={
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={token ? <Home /> : <LandingPage />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myreports" element={<MyReports />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/report/edit/:id" element={<EditReport />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/nearby-reports" element={<NearbyReports />} />
            <Route path="/vets" element={<Vets />} />
          </Routes>
        </MainLayout>
      }
    />

  </Routes>
</BrowserRouter>
  );
}

export default AppRouter;