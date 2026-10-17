import { Link } from "react-router-dom";
import { Phone, IdCard, UserCog } from "lucide-react";
import Avatar from "../common/Avatar";

const DriverCard = ({ driver, basePath = "/employee/drivers", showEmployee = false }) => (
	<Link
		to={`${basePath}/${driver.id}`}
		className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:ring-indigo-100 transition-all"
	>
		<Avatar src={driver.photo} alt={driver.fullName} size="md" />
		<div className="min-w-0 flex-1">
			<p className="text-sm font-bold text-slate-800 truncate">{driver.fullName}</p>
			<p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
				<IdCard size={12} className="shrink-0" /> <span className="truncate">{driver.nationalId}</span>
			</p>
			<p className="text-xs text-slate-500 flex items-center gap-1">
				<Phone size={12} className="shrink-0" /> <span className="truncate">{driver.phone}</span>
			</p>
			{showEmployee && driver.createdByName && (
				<p className="text-xs text-slate-400 flex items-center gap-1">
					<UserCog size={12} className="shrink-0" />
					<span className="truncate">{driver.createdByName}</span>
				</p>
			)}
		</div>
	</Link>
);

export default DriverCard;
