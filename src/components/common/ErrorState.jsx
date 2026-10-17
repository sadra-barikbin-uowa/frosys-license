import { AlertTriangle } from "lucide-react";
import Button from "./Button";

const ErrorState = ({ message = "تعذر تحميل البيانات", onRetry }) => (
	<div role="alert" className="flex flex-col items-center gap-3 py-14 text-center">
		<div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
			<AlertTriangle size={26} className="text-rose-400" />
		</div>
		<p className="text-sm text-slate-600">{message}</p>
		{onRetry && (
			<Button variant="secondary" size="sm" onClick={onRetry}>
				إعادة المحاولة
			</Button>
		)}
	</div>
);

export default ErrorState;
