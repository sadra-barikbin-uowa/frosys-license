import { useCallback, useEffect, useState } from "react";

// يجلب بيانات async مع حالات التحميل والخطأ، ويتجاهل نتائج الطلبات القديمة
// عند تغيّر المعاملات أو مغادرة الصفحة. `deps` يجب أن تكون قيمًا بسيطة (id مثلًا).
// - loading: صحيح حتى تصل نتيجة الطلب الخاص بالمعاملات الحالية
// - reload(): يعيد الجلب (بعد حذف/تعديل مثلًا) دون إظهار شاشة التحميل من جديد
export const useAsyncData = (fetcher, deps = [], initialData = null) => {
	const [version, setVersion] = useState(0);
	const [result, setResult] = useState({ key: null, data: initialData, error: null });
	const requestKey = deps.join("|");

	useEffect(() => {
		let cancelled = false;
		fetcher().then(
			(data) => {
				if (!cancelled) setResult({ key: requestKey, data, error: null });
			},
			(error) => {
				console.error(error);
				if (!cancelled) setResult({ key: requestKey, data: initialData, error });
			},
		);
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [requestKey, version]);

	const reload = useCallback(() => setVersion((v) => v + 1), []);

	return {
		data: result.data,
		error: result.key === requestKey ? result.error : null,
		loading: result.key !== requestKey,
		reload,
	};
};
