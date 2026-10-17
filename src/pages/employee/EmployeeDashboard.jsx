import { Link } from "react-router-dom";
import {
	Users,
	Car,
	CreditCard,
	CheckCircle2,
	XCircle,
	Clock,
	UserPlus,
	FilePlus2,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import BadgeCard from "../../components/badges/BadgeCard";
import { useAuth } from "../../hooks/useAuth";
import { useAsyncData } from "../../hooks/useAsyncData";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { BADGE_STATUS } from "../../utils/badgeStatus";

const EMPTY = { drivers: [], vehicles: [], badges: [] };

const EmployeeDashboard = () => {
	const { user } = useAuth();
	const { data, loading, error, reload } = useAsyncData(
		async () => {
			const [drivers, vehicles, badges] = await Promise.all([
				driverService.getDriversByEmployee(user.id),
				vehicleService.getVehicles(),
				badgeService.getBadgesByEmployee(user.id),
			]);
			const driverIds = new Set(drivers.map((d) => d.id));
			return {
				drivers,
				vehicles: vehicles.filter((v) => driverIds.has(v.driverId)),
				badges: [...badges].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
			};
		},
		[user.id],
		EMPTY,
	);

	const { drivers, vehicles, badges } = data;
	const countBy = (status) => badges.filter((b) => b.status === status).length;
	const value = (number) => (loading ? "…" : number);

	return (
		<>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-slate-800">مرحبًا، {user.name} 👋</h1>
				<p className="text-sm text-slate-500 mt-1">إليك ملخص نشاطك في النظام</p>
			</div>

			<div className="flex flex-wrap gap-3 mb-6">
				<Button to="/employee/drivers/add" icon={UserPlus}>
					إضافة سائق
				</Button>
				<Button to="/employee/badges/create" icon={FilePlus2} variant="secondary">
					إصدار بطاقة
				</Button>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
				<StatCard
					label="السائقون المضافون"
					value={value(drivers.length)}
					icon={Users}
					color="indigo"
					to="/employee/drivers"
				/>
				<StatCard
					label="المركبات"
					value={value(vehicles.length)}
					icon={Car}
					color="sky"
					to="/employee/vehicles"
				/>
				<StatCard
					label="البطاقات المُصدرة"
					value={value(badges.length)}
					icon={CreditCard}
					color="violet"
					to="/employee/badges"
				/>
				<StatCard
					label="البطاقات الفعالة"
					value={value(countBy(BADGE_STATUS.ACTIVE))}
					icon={CheckCircle2}
					color="emerald"
					to={`/employee/badges?status=${BADGE_STATUS.ACTIVE}`}
				/>
				<StatCard
					label="قريبة من الانتهاء"
					value={value(countBy(BADGE_STATUS.EXPIRING_SOON))}
					icon={Clock}
					color="amber"
					to={`/employee/badges?status=${BADGE_STATUS.EXPIRING_SOON}`}
				/>
				<StatCard
					label="البطاقات المنتهية"
					value={value(countBy(BADGE_STATUS.EXPIRED))}
					icon={XCircle}
					color="rose"
					to={`/employee/badges?status=${BADGE_STATUS.EXPIRED}`}
				/>
			</div>

			<div className="flex items-center justify-between mb-4">
				<h2 className="text-base font-bold text-slate-800">آخر البطاقات التي أنشأتها</h2>
				<Link to="/employee/badges" className="text-xs font-medium text-indigo-600 hover:underline">
					عرض الكل
				</Link>
			</div>

			{loading ? (
				<LoadingState />
			) : error ? (
				<ErrorState onRetry={reload} />
			) : badges.length === 0 ? (
				<div className="bg-white rounded-xl ring-1 ring-slate-100">
					<EmptyState
						icon={CreditCard}
						title="لم تقم بإنشاء أي بطاقة بعد"
						description="ابدأ بإضافة سائق جديد وسيتم إصدار بطاقته مباشرة."
						action={
							<Button to="/employee/drivers/add" icon={UserPlus} size="sm">
								إضافة سائق
							</Button>
						}
					/>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{badges.slice(0, 6).map((badge) => (
						<BadgeCard key={badge.id} badge={badge} />
					))}
				</div>
			)}
		</>
	);
};

export default EmployeeDashboard;
