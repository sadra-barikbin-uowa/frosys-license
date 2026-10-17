import { useCallback, useEffect, useMemo, useState } from "react";
import { authService, CURRENT_USER_KEY } from "../services/authService";
import { AuthContext } from "./contexts";

const sameUser = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => authService.getCurrentUser());

	// مزامنة الجلسة بين التبويبات: تسجيل الخروج أو إيقاف الحساب ينعكس في كل التبويبات
	useEffect(() => {
		const handleStorage = (event) => {
			if (event.key === null || event.key === CURRENT_USER_KEY || event.key === "users")
				setUser(authService.getCurrentUser());
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const login = useCallback(async (username, password) => {
		const loggedInUser = await authService.login(username, password);
		setUser(loggedInUser);
		return loggedInUser;
	}, []);

	const logout = useCallback(async () => {
		await authService.logout();
		setUser(null);
	}, []);

	// يعيد التحقق من الحساب (يُستدعى عند التنقل) فيُخرج المستخدم إن حُذف حسابه أو أُوقف
	const revalidate = useCallback(() => {
		setUser((current) => {
			if (!current) return current;
			const fresh = authService.getCurrentUser();
			return fresh && sameUser(fresh, current) ? current : fresh;
		});
	}, []);

	const value = useMemo(
		() => ({ user, login, logout, revalidate, isAdmin: user?.role === "admin" }),
		[user, login, logout, revalidate],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
