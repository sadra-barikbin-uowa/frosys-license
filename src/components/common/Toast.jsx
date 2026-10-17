import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const STYLES = {
	success: "border-emerald-500",
	error: "border-rose-500",
	info: "border-sky-500",
};
const ICON_COLORS = {
	success: "text-emerald-500",
	error: "text-rose-500",
	info: "text-sky-500",
};

const Toast = ({ message, type = "success", onClose }) => {
	const Icon = ICONS[type] || Info;
	return (
		<div
			role={type === "error" ? "alert" : "status"}
			className={`flex items-center gap-3 rounded-lg bg-white border-r-4 shadow-lg ring-1 ring-slate-100 px-4 py-3 text-slate-800 ${STYLES[type] || STYLES.info}`}
		>
			<Icon size={20} className={`shrink-0 ${ICON_COLORS[type] || ICON_COLORS.info}`} />
			<p className="text-sm font-medium flex-1">{message}</p>
			<button
				type="button"
				onClick={onClose}
				aria-label="إغلاق الإشعار"
				className="text-slate-400 hover:text-slate-600 rounded p-0.5"
			>
				<X size={16} />
			</button>
		</div>
	);
};

export default Toast;
