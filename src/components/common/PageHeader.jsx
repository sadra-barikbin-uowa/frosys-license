const PageHeader = ({ title, description, actions }) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
		<div className="min-w-0 flex items-stretch gap-3">
			<span aria-hidden="true" className="w-1 rounded-full bg-linear-to-b from-indigo-500 to-violet-500 shrink-0" />
			<div className="min-w-0">
				<h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
				{description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
			</div>
		</div>
		{actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
	</div>
);

export default PageHeader;
