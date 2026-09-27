import { Link } from "react-router-dom";
import { Eye, Printer, Ban, Trash2, User, CreditCard } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { badgeStatusLabel, badgeStatusStyle } from "../../utils/badgeStatus";
import { vehicleTypeLabel } from "../../data/vehicleTypes";

const BadgeTable = ({
	badges,
	basePath = "/admin/badges",
	showEmployee = true,
	onSuspend,
	onDelete,
}) => {
	if (!badges.length) {
		return (
			<div className="flex flex-col items-center gap-2 py-14 text-slate-400 text-sm">
				<CreditCard size={28} className="text-slate-300" />
				<span>لا توجد بطاقات مسجلة</span>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto -mx-4 sm:mx-0">
			<table className="w-full text-sm min-w-[900px]">
				<thead>
					<tr className="text-right text-xs text-slate-400 border-b border-slate-100">
						<th className="py-3 px-3 font-medium">السائق</th>
						<th className="py-3 px-3 font-medium">رقم البطاقة</th>
						<th className="py-3 px-3 font-medium">نوع المركبة</th>
						<th className="py-3 px-3 font-medium">رقم المركبة</th>
						{showEmployee && <th className="py-3 px-3 font-medium">الموظف</th>}
						<th className="py-3 px-3 font-medium">تاريخ الإصدار</th>
						<th className="py-3 px-3 font-medium">تاريخ الانتهاء</th>
						<th className="py-3 px-3 font-medium">الحالة</th>
						<th className="py-3 px-3 font-medium">الإجراءات</th>
					</tr>
				</thead>
				<tbody>
					{badges.map((badge) => (
						<tr
							key={badge.id}
							className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
						>
							<td className="py-3 px-3">
								<div className="flex items-center gap-2.5">
									<div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
										{badge.driverPhoto ? (
											<img
												src={badge.driverPhoto}
												alt={badge.driverName}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-slate-300">
												<User size={16} />
											</div>
										)}
									</div>
									<span className="font-medium text-slate-700 whitespace-nowrap">
										{badge.driverName}
									</span>
								</div>
							</td>
							<td className="py-3 px-3 text-indigo-600 font-medium whitespace-nowrap">
								{badge.badgeNumber}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{vehicleTypeLabel(badge.vehicleType)}
							</td>
							<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
								{badge.vehicleNumber}
							</td>
							{showEmployee && (
								<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
									{badge.createdByName}
								</td>
							)}
							<td className="py-3 px-3 text-slate-500 whitespace-nowrap">
								{formatDate(badge.issueDate)}
							</td>
							<td className="py-3 px-3 text-slate-500 whitespace-nowrap">
								{formatDate(badge.expiryDate)}
							</td>
							<td className="py-3 px-3">
								<span
									className={`text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${badgeStatusStyle(badge)}`}
								>
									{badgeStatusLabel(badge)}
								</span>
							</td>
							<td className="py-3 px-3">
								<div className="flex items-center gap-1">
									<Link
										to={`${basePath}/${badge.id}`}
										title="عرض"
										className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
									>
										<Eye size={15} />
									</Link>
									<Link
										to={`${basePath}/${badge.id}?print=1`}
										title="طباعة"
										className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
									>
										<Printer size={15} />
									</Link>
									{onSuspend && (
										<button
											onClick={() => onSuspend(badge)}
											title="إيقاف"
											className="p-1.5 rounded-md hover:bg-amber-50 text-amber-500"
										>
											<Ban size={15} />
										</button>
									)}
									{onDelete && (
										<button
											onClick={() => onDelete(badge)}
											title="حذف"
											className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500"
										>
											<Trash2 size={15} />
										</button>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default BadgeTable;
