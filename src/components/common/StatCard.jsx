import { Link } from "react-router-dom";

const COLORS = {
	indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/30",
	emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
	rose: "from-rose-500 to-rose-600 shadow-rose-500/30",
	amber: "from-amber-400 to-amber-500 shadow-amber-500/30",
	sky: "from-sky-500 to-sky-600 shadow-sky-500/30",
	violet: "from-violet-500 to-violet-600 shadow-violet-500/30",
	slate: "from-slate-500 to-slate-600 shadow-slate-500/30",
};

// عند تمرير `to` تصبح البطاقة رابطًا (مثلًا إلى قائمة البطاقات مفلترة بالحالة)
const StatCard = ({ label, value, icon: Icon, color = "indigo", to }) => {
	const content = (
		<>
			<div
				className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br shadow-lg flex items-center justify-center shrink-0 text-white ${COLORS[color]}`}
			>
				<Icon size={20} />
			</div>
			<div className="min-w-0">
				<p className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-none tabular-nums">{value}</p>
				<p className="text-xs text-slate-500 mt-1.5 leading-snug">{label}</p>
			</div>
		</>
	);

	return to ? (
		<Link to={to} className="surface-link p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">
			{content}
		</Link>
	) : (
		<div className="surface p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">{content}</div>
	);
};

export default StatCard;
