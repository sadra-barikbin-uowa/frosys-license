import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Lock, AlertCircle } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import { usePageTitle } from "../hooks/usePageTitle";
import { getErrorMessage } from "../utils/errors";

const homeFor = (user) => (user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");

// بعد الدخول نعيد المستخدم إلى الصفحة التي كان يحاول فتحها إن كانت تخص دوره
const targetFor = (user, from) => (from && from.startsWith(`/${user.role}/`) ? from : homeFor(user));

const Login = () => {
	const { user, login } = useAuth();
	const { settings } = useSettings();
	const navigate = useNavigate();
	const location = useLocation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	usePageTitle("تسجيل الدخول");

	if (user) {
		return <Navigate to={targetFor(user, location.state?.from)} replace />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!username.trim() || !password.trim()) {
			setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
			return;
		}
		setLoading(true);
		try {
			const loggedInUser = await login(username, password);
			navigate(targetFor(loggedInUser, location.state?.from), { replace: true });
		} catch (err) {
			setError(getErrorMessage(err, "تعذر تسجيل الدخول، حاول مرة أخرى"));
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-dvh bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-700 flex items-center justify-center p-4"
			dir="rtl"
		>
			<main className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
				{/* الجانب الترويجي */}
				<div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-indigo-700 to-violet-700 p-10 text-white relative overflow-hidden">
					<div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10" />
					<div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/5" />
					<div className="relative">
						<div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5 overflow-hidden">
							{settings.logo ? (
								<img
									src={settings.logo}
									alt=""
									className="w-full h-full object-contain bg-white p-1"
								/>
							) : (
								<ShieldCheck size={26} />
							)}
						</div>
						<h1 className="text-2xl font-bold leading-snug mb-3">{settings.systemName}</h1>
						<p className="text-indigo-100 text-sm leading-relaxed">
							إدارة بيانات السائقين والمركبات وإصدار بطاقات تعريفية احترافية
							بسهولة وسرعة، مع متابعة كاملة لجميع البطاقات الفعالة والمنتهية.
						</p>
					</div>
					<p className="relative text-xs text-indigo-200" dir="ltr">
						FLEET ID MANAGEMENT SYSTEM
					</p>
				</div>

				{/* نموذج تسجيل الدخول */}
				<div className="p-6 sm:p-10 flex flex-col justify-center">
					<div className="lg:hidden flex items-center gap-2.5 mb-8">
						<div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
							{settings.logo ? (
								<img
									src={settings.logo}
									alt=""
									className="w-full h-full object-contain bg-white p-0.5"
								/>
							) : (
								<ShieldCheck size={20} className="text-white" />
							)}
						</div>
						<h1 className="text-sm font-bold text-slate-800">{settings.systemName}</h1>
					</div>

					<h2 className="text-xl font-bold text-slate-800 mb-1">تسجيل الدخول</h2>
					<p className="text-sm text-slate-500 mb-6">أدخل بيانات حسابك للمتابعة</p>

					<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
						<Input
							label="اسم المستخدم"
							icon={User}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="أدخل اسم المستخدم"
							autoComplete="username"
							autoCapitalize="none"
							autoCorrect="off"
							spellCheck={false}
						/>
						<Input
							label="كلمة المرور"
							icon={Lock}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="أدخل كلمة المرور"
							autoComplete="current-password"
						/>

						{error && (
							<div
								role="alert"
								className="flex items-center gap-2 text-rose-600 bg-rose-50 rounded-lg px-3 py-2.5 text-xs"
							>
								<AlertCircle size={15} className="shrink-0" />
								{error}
							</div>
						)}

						<Button type="submit" loading={loading} className="w-full mt-1" size="lg">
							دخول
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Login;
