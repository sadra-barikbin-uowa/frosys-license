import {
	LayoutDashboard,
	CreditCard,
	Users,
	Car,
	UserCog,
	BarChart3,
	Search,
	Settings,
	UserPlus,
	Wallet,
} from "lucide-react";

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

export const getNavLinks = (role) => (role === "admin" ? adminLinks : employeeLinks);

// أطول رابط يطابق المسار الحالي هو الرابط النشط، فمثلًا "/employee/drivers/add"
// يفعّل "إضافة سائق" فقط (وليس "السائقون" أيضًا)، و"/employee/drivers/DR-1" يفعّل "السائقون"
export const findActiveLink = (links, pathname) =>
	links
		.filter((link) => pathname === link.to || pathname.startsWith(`${link.to}/`))
		.sort((a, b) => b.to.length - a.to.length)[0];
