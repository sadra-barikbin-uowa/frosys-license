import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import { findActiveLink, getNavLinks } from "./navigation";

const SidebarContent = ({ role, onCloseMobile, isDrawer }) => {
	const { user, logout } = useAuth();
	const { settings } = useSettings();
	const { pathname } = useLocation();
	const links = getNavLinks(role);
	const activeTo = findActiveLink(links, pathname)?.to;
	const closeRef = useRef(null);

	useEffect(() => {
		if (isDrawer) closeRef.current?.focus();
	}, [isDrawer]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
				<div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 overflow-hidden">
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
				<div className="min-w-0">
					<p className="text-sm font-bold text-slate-800 truncate" title={settings.systemName}>
						{settings.systemName}
					</p>
					<p className="text-[11px] text-slate-400">إدارة بطاقات السائقين</p>
				</div>
				{isDrawer && (
					<button
						ref={closeRef}
						type="button"
						onClick={onCloseMobile}
						aria-label="إغلاق القائمة"
						className="mr-auto text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
					>
						<X size={18} />
					</button>
				)}
			</div>

			<nav aria-label="القائمة الرئيسية" className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
				{links.map(({ to, label, icon: Icon }) => {
					const isActive = to === activeTo;
					return (
						<Link
							key={to}
							to={to}
							onClick={onCloseMobile}
							aria-current={isActive ? "page" : undefined}
							className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
								isActive
									? "bg-indigo-50 text-indigo-600"
									: "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
							}`}
						>
							<Icon size={18} />
							{label}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-slate-100 p-3">
				<button
					type="button"
					onClick={logout}
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
						<p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
						<p className="text-[11px] text-slate-400">
							{role === "admin" ? "مدير النظام" : "موظف"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Sidebar = ({ role, mobileOpen, onCloseMobile }) => {
	// القائمة الجانبية على الجوال: إغلاق بزر Escape، ومنع تمرير الصفحة خلفها،
	// وإغلاقها تلقائيًا عند تكبير الشاشة إلى حجم سطح المكتب
	useEffect(() => {
		if (!mobileOpen) return undefined;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onCloseMobile();
		};
		const media = window.matchMedia("(min-width: 1024px)");
		const handleMedia = (event) => {
			if (event.matches) onCloseMobile();
		};
		document.addEventListener("keydown", handleKeyDown);
		media.addEventListener("change", handleMedia);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
			media.removeEventListener("change", handleMedia);
		};
	}, [mobileOpen, onCloseMobile]);

	return (
		<>
			{/* Desktop sidebar - right side for RTL */}
			<aside className="hidden lg:flex flex-col w-64 h-dvh sticky top-0 bg-white border-l border-slate-100 shrink-0">
				<SidebarContent role={role} />
			</aside>

			{/* Mobile drawer */}
			{mobileOpen && (
				<div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة">
					<div
						className="absolute inset-0 bg-slate-900/50 animate-[fadeOnly_.15s_ease-out]"
						onClick={onCloseMobile}
						aria-hidden="true"
					/>
					<aside className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl animate-[slideInRight_.2s_ease-out]">
						<SidebarContent role={role} onCloseMobile={onCloseMobile} isDrawer />
					</aside>
				</div>
			)}
		</>
	);
};

export default Sidebar;
