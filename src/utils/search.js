const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const EXTENDED_INDIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

// يحوّل الأرقام العربية/الفارسية إلى أرقام لاتينية (٠١٢ -> 012)
export const toLatinDigits = (value) =>
	String(value ?? "").replace(/[٠-٩۰-۹]/g, (digit) => {
		const arabic = ARABIC_INDIC_DIGITS.indexOf(digit);
		return arabic >= 0 ? arabic : EXTENDED_INDIC_DIGITS.indexOf(digit);
	});

// توحيد النص قبل المقارنة: حروف صغيرة، أرقام لاتينية، إزالة التشكيل
// وتوحيد صور الألف والياء والتاء المربوطة، حتى يطابق البحث "احمد" مع "أحمد"
export const normalizeText = (value) =>
	toLatinDigits(value)
		.toLowerCase()
		.replace(/[ً-ٰٟـ]/g, "")
		.replace(/[أإآٱ]/g, "ا")
		.replace(/ى/g, "ي")
		.replace(/ة/g, "ه")
		.replace(/\s+/g, " ")
		.trim();

// هل يوجد أي حقل يحتوي على نص البحث؟ (آمن مع القيم الفارغة/غير النصية)
export const matchesQuery = (query, ...fields) => {
	const needle = normalizeText(query);
	if (!needle) return true;
	return fields.some((field) => normalizeText(field).includes(needle));
};
