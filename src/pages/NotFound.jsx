import { Compass } from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";

const NotFound = () => {
	const { user } = useAuth();
	usePageTitle("الصفحة غير موجودة");

	const home = user
		? user.role === "admin"
			? "/admin/dashboard"
			: "/employee/dashboard"
		: "/login";

	return (
		<div className="min-h-dvh bg-[#f4f6f9] flex items-center justify-center p-6" dir="rtl">
			<div className="text-center max-w-sm">
				<div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-5">
					<Compass size={30} />
				</div>
				<p className="text-5xl font-black text-slate-200 mb-2">404</p>
				<h1 className="text-xl font-bold text-slate-800 mb-2">الصفحة غير موجودة</h1>
				<p className="text-sm text-slate-500 mb-6">
					الرابط الذي فتحته غير صحيح أو تم نقل الصفحة.
				</p>
				<Button to={home} size="lg">
					{user ? "العودة إلى لوحة التحكم" : "الذهاب إلى تسجيل الدخول"}
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
