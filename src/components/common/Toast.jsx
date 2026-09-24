import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const STYLES = {
  success: "bg-white border-r-4 border-emerald-500",
  error: "bg-white border-r-4 border-rose-500",
  info: "bg-white border-r-4 border-sky-500",
};

const Toast = ({ message, type = "success", onClose }) => {
  const Icon = ICONS[type] || Info;
  return (
    <div className={`flex items-center gap-3 rounded-lg shadow-lg px-4 py-3 text-slate-800 ${STYLES[type]}`}>
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
