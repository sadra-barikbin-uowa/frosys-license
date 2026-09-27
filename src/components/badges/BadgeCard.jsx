import { Link } from "react-router-dom";
import { Eye, Printer, User } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { badgeStatusLabel, badgeStatusStyle } from "../../utils/badgeStatus";
import { vehicleTypeLabel } from "../../data/vehicleTypes";

const BadgeCard = ({ badge, basePath = "/employee/badges" }) => {
	return (
		<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
			<div className="flex items-start gap-3">
				<div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-100">
					{badge.driverPhoto ? (
						<img
							src={badge.driverPhoto}
							alt={badge.driverName}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-300">
							<User size={20} />
						</div>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-bold text-slate-800 truncate">
						{badge.driverName}
					</p>
					<p className="text-xs text-indigo-600 font-medium">
						{badge.badgeNumber}
					</p>
					<p className="text-xs text-slate-400 mt-0.5">
						{vehicleTypeLabel(badge.vehicleType)} — {badge.vehicleNumber}
					</p>
				</div>
				<span
					className={`text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${badgeStatusStyle(badge)}`}
				>
					{badgeStatusLabel(badge)}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
				<p>
					الإصدار:{" "}
					<span className="text-slate-700">{formatDate(badge.issueDate)}</span>
				</p>
				<p>
					الانتهاء:{" "}
					<span className="text-slate-700">{formatDate(badge.expiryDate)}</span>
				</p>
			</div>

			<div className="flex items-center gap-2 pt-1">
				<Link
					to={`${basePath}/${badge.id}`}
					className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
				>
					<Eye size={14} /> عرض
				</Link>
				<Link
					to={`${basePath}/${badge.id}?print=1`}
					className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
				>
					<Printer size={14} /> طباعة
				</Link>
			</div>
		</div>
	);
};

export default BadgeCard;
