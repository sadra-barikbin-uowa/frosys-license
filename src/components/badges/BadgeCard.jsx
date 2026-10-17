import { Eye, Printer } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { formatDate } from "../../utils/formatDate";
import { badgeStatusLabel, badgeStatusStyle } from "../../utils/badgeStatus";
import { vehicleTypeLabel } from "../../data/vehicleTypes";

const BadgeCard = ({ badge, basePath = "/employee/badges" }) => {
	return (
		<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
			<div className="flex items-start gap-3">
				<Avatar src={badge.driverPhoto} alt={badge.driverName} size="lg" shape="lg" className="ring-1 ring-slate-100" />
				<div className="min-w-0 flex-1">
					<p className="text-sm font-bold text-slate-800 truncate">{badge.driverName}</p>
					<p className="text-xs text-indigo-600 font-medium">{badge.badgeNumber}</p>
					<p className="text-xs text-slate-500 mt-0.5 truncate">
						{[vehicleTypeLabel(badge.vehicleType), badge.vehicleNumber]
							.filter(Boolean)
							.join(" — ") || "بدون مركبة"}
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
					الإصدار: <span className="text-slate-700">{formatDate(badge.issueDate)}</span>
				</p>
				<p>
					الانتهاء: <span className="text-slate-700">{formatDate(badge.expiryDate)}</span>
				</p>
			</div>

			<div className="flex items-center gap-2 pt-1">
				<Button
					to={`${basePath}/${badge.id}`}
					variant="secondary"
					size="sm"
					icon={Eye}
					className="flex-1"
				>
					عرض
				</Button>
				<Button
					to={`${basePath}/${badge.id}?print=1`}
					variant="outline"
					size="sm"
					icon={Printer}
					className="flex-1"
				>
					طباعة
				</Button>
			</div>
		</div>
	);
};

export default BadgeCard;
