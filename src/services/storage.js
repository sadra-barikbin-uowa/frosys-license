import { AppError } from "../utils/errors";

// طبقة تجريد فوق LocalStorage
// الهدف: عندما نربط المشروع بـ Backend مستقبلاً، نستبدل محتوى هذا الملف فقط
// (أو الدوال داخل كل service) دون الحاجة لتعديل أي Component

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		// بيانات تالفة أو من شكل مختلف: نعود للقيمة الافتراضية بدل كسر الصفحة
		if (parsed === null || (Array.isArray(fallback) && !Array.isArray(parsed)))
			return fallback;
		return parsed;
	} catch (err) {
		console.error(`خطأ في قراءة ${key} من LocalStorage`, err);
		return fallback;
	}
};

const isQuotaError = (err) =>
	err?.name === "QuotaExceededError" ||
	err?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
	err?.code === 22 ||
	err?.code === 1014;

// يرمي AppError عند الفشل (مثل امتلاء المساحة) كي لا تظهر رسالة "تم الحفظ" كاذبة
const write = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (err) {
		console.error(`خطأ في حفظ ${key} في LocalStorage`, err);
		throw new AppError(
			isQuotaError(err)
				? "مساحة التخزين في المتصفح ممتلئة. احذف بعض السجلات أو استخدم صورًا أصغر ثم حاول مجددًا."
				: "تعذر حفظ البيانات في المتصفح.",
		);
	}
};

const remove = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error(`خطأ في حذف ${key} من LocalStorage`, err);
	}
};

// تقدير المساحة المستخدمة (بعدد المحارف) مقابل الحد التقريبي 5 مليون محرف
const STORAGE_LIMIT_CHARS = 5 * 1024 * 1024;
const usage = () => {
	try {
		let used = 0;
		for (let i = 0; i < localStorage.length; i += 1) {
			const key = localStorage.key(i);
			used += key.length + (localStorage.getItem(key) || "").length;
		}
		return { used, limit: STORAGE_LIMIT_CHARS };
	} catch {
		return { used: 0, limit: STORAGE_LIMIT_CHARS };
	}
};

// محاكاة تأخير الشبكة البسيط، يسهّل الانتقال لاحقًا إلى async API حقيقي
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const storage = { read, write, remove, usage, delay };
