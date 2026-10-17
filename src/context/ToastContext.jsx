import { useCallback, useMemo, useState } from "react";
import Toast from "../components/common/Toast";
import { ToastContext } from "./contexts";

const DURATIONS = { success: 3500, info: 4000, error: 6000 };

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const showToast = useCallback(
		(message, type = "success") => {
			const id = Date.now() + Math.random();
			// نحدّ عدد الرسائل الظاهرة معًا حتى لا تغطي الشاشة
			setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
			setTimeout(() => removeToast(id), DURATIONS[type] ?? DURATIONS.success);
		},
		[removeToast],
	);

	const value = useMemo(() => ({ showToast }), [showToast]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div
				className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[92%] max-w-sm pointer-events-none no-print"
				aria-live="polite"
			>
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className="animate-[fadeIn_.2s_ease-out] pointer-events-auto"
					>
						<Toast
							message={toast.message}
							type={toast.type}
							onClose={() => removeToast(toast.id)}
						/>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};
