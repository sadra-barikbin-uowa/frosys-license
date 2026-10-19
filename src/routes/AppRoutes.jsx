import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import EmployeeRoute from "./EmployeeRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoadingState from "../components/common/LoadingState";

// تحميل الصفحات عند الحاجة (Code Splitting) بدل حزمة JavaScript واحدة ضخمة
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Admin pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminBadges = lazy(() => import("../pages/admin/AdminBadges"));
const AdminBadgeDetails = lazy(() => import("../pages/admin/AdminBadgeDetails"));
const AdminDrivers = lazy(() => import("../pages/admin/AdminDrivers"));
const AdminDriverDetails = lazy(() => import("../pages/admin/AdminDriverDetails"));
const AdminVehicles = lazy(() => import("../pages/admin/AdminVehicles"));
const AdminEmployees = lazy(() => import("../pages/admin/AdminEmployees"));
const AdminEmployeeForm = lazy(() => import("../pages/admin/AdminEmployeeForm"));
const AdminReports = lazy(() => import("../pages/admin/AdminReports"));
const AdminSearch = lazy(() => import("../pages/admin/AdminSearch"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));

// Employee pages
const EmployeeDashboard = lazy(() => import("../pages/employee/EmployeeDashboard"));
const Drivers = lazy(() => import("../pages/employee/Drivers"));
const AddDriver = lazy(() => import("../pages/employee/AddDriver"));
const DriverDetails = lazy(() => import("../pages/employee/DriverDetails"));
const EditDriver = lazy(() => import("../pages/employee/EditDriver"));
const Vehicles = lazy(() => import("../pages/employee/Vehicles"));
const MyBadges = lazy(() => import("../pages/employee/MyBadges"));
const CreateBadge = lazy(() => import("../pages/employee/CreateBadge"));
const BadgeDetails = lazy(() => import("../pages/employee/BadgeDetails"));
const EmployeeSearch = lazy(() => import("../pages/employee/EmployeeSearch"));

const AppRoutes = () => {
	return (
		<Suspense fallback={<LoadingState className="min-h-dvh" />}>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<Login />} />

				{/* Admin */}
				<Route element={<AdminRoute />}>
					<Route element={<DashboardLayout role="admin" />}>
						<Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route path="/admin/badges" element={<AdminBadges />} />
						<Route path="/admin/badges/create" element={<CreateBadge role="admin" />} />
						<Route path="/admin/badges/:id" element={<AdminBadgeDetails />} />
						<Route path="/admin/drivers" element={<AdminDrivers />} />
						<Route path="/admin/drivers/add" element={<AddDriver role="admin" />} />
						<Route path="/admin/drivers/:id" element={<AdminDriverDetails />} />
						<Route path="/admin/drivers/:id/edit" element={<EditDriver role="admin" />} />
						<Route path="/admin/vehicles" element={<AdminVehicles />} />
						<Route path="/admin/employees" element={<AdminEmployees />} />
						<Route path="/admin/employees/add" element={<AdminEmployeeForm />} />
						<Route path="/admin/employees/:id/edit" element={<AdminEmployeeForm />} />
						<Route path="/admin/reports" element={<AdminReports />} />
						<Route path="/admin/search" element={<AdminSearch />} />
						<Route path="/admin/settings" element={<AdminSettings />} />
					</Route>
				</Route>

				{/* Employee */}
				<Route element={<EmployeeRoute />}>
					<Route element={<DashboardLayout role="employee" />}>
						<Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
						<Route path="/employee/dashboard" element={<EmployeeDashboard />} />
						<Route path="/employee/drivers" element={<Drivers />} />
						<Route path="/employee/drivers/add" element={<AddDriver />} />
						<Route path="/employee/drivers/:id" element={<DriverDetails />} />
						<Route path="/employee/drivers/:id/edit" element={<EditDriver />} />
						<Route path="/employee/vehicles" element={<Vehicles />} />
						<Route path="/employee/badges" element={<MyBadges />} />
						<Route path="/employee/badges/create" element={<CreateBadge />} />
						<Route path="/employee/badges/:id" element={<BadgeDetails />} />
						<Route path="/employee/search" element={<EmployeeSearch />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
};

export default AppRoutes;
