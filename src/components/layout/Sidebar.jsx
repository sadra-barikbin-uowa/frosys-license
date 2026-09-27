import { NavLink } from "react-router-dom";
import {
	LayoutDashboard,
	CreditCard,
	Users,
	Car,
	UserCog,
	BarChart3,
	Search,
	Settings,
	LogOut,
	UserPlus,
	Wallet,
	X,
	ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const adminLinks = [
	{ to: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
	{ to: "/admin/badges", label: "جميع البطاقات", icon: CreditCard },
	{ to: "/admin/drivers", label: "السائقون", icon: Users },
	{ to: "/admin/vehicles", label: "المركبات", icon: Car },
	{ to: "/admin/employees", label: "الموظفون", icon: UserCog },
	{ to: "/admin/reports", label: "التقارير", icon: BarChart3 },
	{ to: "/admin/search", label: "البحث", icon: Search },
	{ to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

const employeeLinks = [
	{ to: "/employee/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
	{ to: "/employee/drivers", label: "السائقون", icon: Users },
	{ to: "/employee/drivers/add", label: "إضافة سائق", icon: UserPlus },
	{ to: "/employee/vehicles", label: "المركبات", icon: Car },
	{ to: "/employee/badges", label: "البطاقات الخاصة بي", icon: Wallet },
	{ to: "/employee/badges/create", label: "إصدار بطاقة", icon: CreditCard },
	{ to: "/employee/search", label: "البحث", icon: Search },
];

const Sidebar = ({ role, mobileOpen, onCloseMobile }) => {
	const { user, logout } = useAuth();
	const { settings } = useSettings();
	const links = role === "admin" ? adminLinks : employeeLinks;

	const handleLogout = async () => {
		await logout();
	};

	const content = (
		<div className="flex flex-col h-full">
			<div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
				<div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
					<ShieldCheck size={20} className="text-white" />
				</div>
				<div className="min-w-0">
					<p className="text-sm font-bold text-slate-800 truncate">
						{settings.systemName}
					</p>
					<p className="text-[11px] text-slate-400">إدارة بطاقات السائقين</p>
				</div>
				<button
					onClick={onCloseMobile}
					className="mr-auto lg:hidden text-slate-400 p-1"
				>
					<X size={18} />
				</button>
			</div>

			<nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
				{links.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={to}
						to={to}
						end={to === "/admin/dashboard" || to === "/employee/dashboard"}
						onClick={onCloseMobile}
						className={({ isActive }) =>
							`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
								isActive
									? "bg-indigo-50 text-indigo-600"
									: "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
							}`
						}
					>
						<Icon size={18} />
						{label}
					</NavLink>
				))}
			</nav>

			<div className="border-t border-slate-100 p-3">
				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mb-2"
				>
					<LogOut size={18} />
					تسجيل الخروج
				</button>
				<div className="flex items-center gap-3 px-3 py-2">
					<div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
						{user?.name?.charAt(0) || "؟"}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-slate-800 truncate">
							{user?.name}
						</p>
						<p className="text-[11px] text-slate-400">
							{role === "admin" ? "مدير النظام" : "موظف"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{/* Desktop sidebar - right side for RTL */}
			<aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-l border-slate-100 shrink-0">
				{content}
			</aside>

			{/* Mobile drawer */}
			{mobileOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div
						className="absolute inset-0 bg-slate-900/50"
						onClick={onCloseMobile}
					/>
					<aside className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl animate-[fadeIn_.15s_ease-out]">
						{content}
					</aside>
				</div>
			)}
		</>
	);
};

export default Sidebar;
