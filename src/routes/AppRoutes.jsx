import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminRoute from "./AdminRoute";
import EmployeeRoute from "./EmployeeRoute";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBadges from "../pages/admin/AdminBadges";
import AdminBadgeDetails from "../pages/admin/AdminBadgeDetails";
import AdminDrivers from "../pages/admin/AdminDrivers";
import AdminDriverDetails from "../pages/admin/AdminDriverDetails";
import AdminVehicles from "../pages/admin/AdminVehicles";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminReports from "../pages/admin/AdminReports";
import AdminSearch from "../pages/admin/AdminSearch";
import AdminSettings from "../pages/admin/AdminSettings";

// Employee pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Drivers from "../pages/employee/Drivers";
import AddDriver from "../pages/employee/AddDriver";
import DriverDetails from "../pages/employee/DriverDetails";
import EditDriver from "../pages/employee/EditDriver";
import Vehicles from "../pages/employee/Vehicles";
import MyBadges from "../pages/employee/MyBadges";
import CreateBadge from "../pages/employee/CreateBadge";
import BadgeDetails from "../pages/employee/BadgeDetails";
import EmployeeSearch from "../pages/employee/EmployeeSearch";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/badges" element={<AdminRoute><AdminBadges /></AdminRoute>} />
      <Route path="/admin/badges/:id" element={<AdminRoute><AdminBadgeDetails /></AdminRoute>} />
      <Route path="/admin/drivers" element={<AdminRoute><AdminDrivers /></AdminRoute>} />
      <Route path="/admin/drivers/:id" element={<AdminRoute><AdminDriverDetails /></AdminRoute>} />
      <Route path="/admin/vehicles" element={<AdminRoute><AdminVehicles /></AdminRoute>} />
      <Route path="/admin/employees" element={<AdminRoute><AdminEmployees /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path="/admin/search" element={<AdminRoute><AdminSearch /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

      {/* Employee */}
      <Route path="/employee/dashboard" element={<EmployeeRoute><EmployeeDashboard /></EmployeeRoute>} />
      <Route path="/employee/drivers" element={<EmployeeRoute><Drivers /></EmployeeRoute>} />
      <Route path="/employee/drivers/add" element={<EmployeeRoute><AddDriver /></EmployeeRoute>} />
      <Route path="/employee/drivers/:id" element={<EmployeeRoute><DriverDetails /></EmployeeRoute>} />
      <Route path="/employee/drivers/:id/edit" element={<EmployeeRoute><EditDriver /></EmployeeRoute>} />
      <Route path="/employee/vehicles" element={<EmployeeRoute><Vehicles /></EmployeeRoute>} />
      <Route path="/employee/badges" element={<EmployeeRoute><MyBadges /></EmployeeRoute>} />
      <Route path="/employee/badges/create" element={<EmployeeRoute><CreateBadge /></EmployeeRoute>} />
      <Route path="/employee/badges/:id" element={<EmployeeRoute><BadgeDetails /></EmployeeRoute>} />
      <Route path="/employee/search" element={<EmployeeRoute><EmployeeSearch /></EmployeeRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
