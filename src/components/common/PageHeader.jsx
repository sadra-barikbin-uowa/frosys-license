const PageHeader = ({ title, description, actions }) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
		<div className="min-w-0">
			<h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
			{description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
		</div>
		{actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
	</div>
);

export default PageHeader;
