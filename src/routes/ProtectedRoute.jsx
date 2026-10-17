import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// حارس المسارات: يتطلب تسجيل دخول، ويقيّد الدور عند تمرير `role`.
// يُستخدم كـ Layout Route (عبر Outlet) أو يغلّف children مباشرة.
const ProtectedRoute = ({ role, children }) => {
	const { user, revalidate } = useAuth();
	const { pathname } = useLocation();

	// عند كل تنقل نتأكد أن الحساب ما زال موجودًا وفعّالًا (لم يُحذف/يُوقف من المدير)
	useEffect(() => {
		revalidate();
	}, [pathname, revalidate]);

	if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;

	if (role && user.role !== role) {
		return (
			<Navigate
				to={user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
				replace
			/>
		);
	}

	return children ?? <Outlet />;
};

export default ProtectedRoute;
