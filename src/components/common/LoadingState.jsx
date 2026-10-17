const LoadingState = ({ label = "جارِ التحميل...", className = "py-16" }) => (
	<div
		role="status"
		className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${className}`}
	>
		<div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
		<span className="text-sm">{label}</span>
	</div>
);

export default LoadingState;
