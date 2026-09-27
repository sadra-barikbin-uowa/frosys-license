import { vehicleTypeLabel } from "../../data/vehicleTypes";
import { Car } from "lucide-react";

const VehicleTable = ({ vehicles }) => {
	if (!vehicles.length) {
		return (
			<div className="flex flex-col items-center gap-2 py-14 text-slate-400 text-sm">
				<Car size={28} className="text-slate-300" />
				<span>لا توجد مركبات مسجلة</span>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto -mx-4 sm:mx-0">
			<table className="w-full text-sm min-w-[700px]">
				<thead>
					<tr className="text-right text-xs text-slate-400 border-b border-slate-100">
						<th className="py-3 px-3 font-medium">رقم المركبة</th>
						<th className="py-3 px-3 font-medium">النوع</th>
						<th className="py-3 px-3 font-medium">الموديل</th>
						<th className="py-3 px-3 font-medium">سنة الصنع</th>
						<th className="py-3 px-3 font-medium">اللون</th>
					</tr>
				</thead>
				<tbody>
					{vehicles.map((vehicle) => (
						<tr
							key={vehicle.id}
							className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
						>
							<td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
								{vehicle.vehicleNumber}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{vehicleTypeLabel(vehicle.vehicleType)}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{vehicle.model || "—"}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{vehicle.year || "—"}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{vehicle.color || "—"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default VehicleTable;
