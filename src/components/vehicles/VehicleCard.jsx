import { vehicleTypeLabel, vehicleTypeIcon } from "../../data/vehicleTypes";

const VehicleCard = ({ vehicle }) => {
  const Icon = vehicleTypeIcon(vehicle.vehicleType);
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-slate-100 overflow-hidden">
        {vehicle.photo ? (
          <img src={vehicle.photo} alt={vehicle.model} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Icon size={32} />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-800">{vehicle.model || "—"}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
            <Icon size={12} /> {vehicleTypeLabel(vehicle.vehicleType)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500">
          <p>رقم المركبة: <span className="text-slate-700 font-medium">{vehicle.vehicleNumber}</span></p>
          <p>اللون: <span className="text-slate-700 font-medium">{vehicle.color || "—"}</span></p>
          <p>سنة الصنع: <span className="text-slate-700 font-medium">{vehicle.year || "—"}</span></p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
