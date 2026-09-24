import { Link } from "react-router-dom";
import { User, Phone, IdCard } from "lucide-react";

const DriverCard = ({ driver, basePath = "/employee/drivers" }) => (
  <Link
    to={`${basePath}/${driver.id}`}
    className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:ring-indigo-100 transition-all"
  >
    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
      {driver.photo ? (
        <img src={driver.photo} alt={driver.fullName} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300">
          <User size={18} />
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-slate-800 truncate">{driver.fullName}</p>
      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
        <IdCard size={12} /> {driver.nationalId}
      </p>
      <p className="text-xs text-slate-400 flex items-center gap-1">
        <Phone size={12} /> {driver.phone}
      </p>
    </div>
  </Link>
);

export default DriverCard;
