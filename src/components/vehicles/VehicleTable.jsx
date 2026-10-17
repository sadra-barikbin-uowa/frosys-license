import { Car } from "lucide-react";
import EmptyState from "../common/EmptyState";
import VehicleCard from "./VehicleCard";
import { vehicleTypeLabel } from "../../data/vehicleTypes";

// الجدول على الشاشات الكبيرة، وبطاقات المركبات على الجوال والأجهزة اللوحية
const VehicleTable = ({ vehicles, emptyText = "لا توجد مركبات مسجلة" }) => {
	if (!vehicles.length) {
		return <EmptyState icon={Car} title={emptyText} />;
	}

	return (
		<>
			<div className="hidden lg:block overflow-x-auto">
				<table className="w-full text-sm min-w-160">
					<thead>
						<tr className="text-right text-xs text-slate-500 border-b border-slate-100">
							<th scope="col" className="py-3 px-3 font-medium">رقم المركبة</th>
							<th scope="col" className="py-3 px-3 font-medium">النوع</th>
							<th scope="col" className="py-3 px-3 font-medium">الموديل</th>
							<th scope="col" className="py-3 px-3 font-medium">سنة الصنع</th>
							<th scope="col" className="py-3 px-3 font-medium">اللون</th>
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
								<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{vehicle.model || "—"}</td>
								<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{vehicle.year || "—"}</td>
								<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{vehicle.color || "—"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<ul className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
				{vehicles.map((vehicle) => (
					<li key={vehicle.id} className="contents">
						<VehicleCard vehicle={vehicle} />
					</li>
				))}
			</ul>
		</>
	);
};

export default VehicleTable;
