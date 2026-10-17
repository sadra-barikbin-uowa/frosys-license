const pad = (value) => String(value).padStart(2, "0");

// يحوّل التاريخ إلى YYYY-MM-DD حسب التوقيت المحلي (toISOString يستخدم UTC
// فيعطي تاريخ اليوم السابق في بعض الساعات)
export const toISODate = (date) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// يقرأ YYYY-MM-DD كتاريخ محلي (وليس UTC) لتجنّب انزياح اليوم بحسب المنطقة الزمنية
const parseDate = (value) => {
	if (!value) return null;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	const date = match
		? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
		: new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (dateStr) => {
	const date = parseDate(dateStr);
	if (!date) return "—";
	return date.toLocaleDateString("ar-EG-u-nu-latn", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

export const todayISO = () => toISODate(new Date());

export const addYears = (dateStr, years = 1) => {
	const date = parseDate(dateStr) || new Date();
	const day = date.getDate();
	// نضبط اليوم على 1 أولًا حتى لا ينتقل 29 فبراير إلى مارس في السنوات غير الكبيسة
	date.setDate(1);
	date.setFullYear(date.getFullYear() + years);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	date.setDate(Math.min(day, lastDay));
	return toISODate(date);
};

export const daysUntil = (dateStr) => {
	const target = parseDate(dateStr);
	if (!target) return null;
	const now = new Date();
	target.setHours(0, 0, 0, 0);
	now.setHours(0, 0, 0, 0);
	return Math.round((target - now) / (1000 * 60 * 60 * 24));
};
