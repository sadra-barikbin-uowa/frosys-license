const EmptyState = ({ icon: Icon, title, description, action, className = "py-14" }) => (
	<div className={`flex flex-col items-center gap-2 text-center text-slate-500 text-sm ${className}`}>
		{Icon && (
			<div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-1">
				<Icon size={26} className="text-slate-300" />
			</div>
		)}
		<p className="font-medium text-slate-600">{title}</p>
		{description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
		{action && <div className="mt-3">{action}</div>}
	</div>
);

export default EmptyState;
