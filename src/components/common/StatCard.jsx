const COLORS = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-600",
};

const StatCard = ({ label, value, icon: Icon, color = "indigo" }) => (
  <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-4 flex items-center gap-3">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${COLORS[color]}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-400 truncate">{label}</p>
    </div>
  </div>
);

export default StatCard;
