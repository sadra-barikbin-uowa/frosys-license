import { Link } from "react-router-dom";
import { CreditCard, CheckCircle2, XCircle, Clock, Users, Car, UserCog } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import BadgeTable from "../../components/badges/BadgeTable";
import { useAsyncData } from "../../hooks/useAsyncData";
import { badgeService } from "../../services/badgeService";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { employeeService } from "../../services/employeeService";
import { BADGE_STATUS } from "../../utils/badgeStatus";

const EMPTY = { badges: [], drivers: 0, vehicles: 0, employees: 0 };

const AdminDashboard = () => {
	const { data, loading, error, reload } = useAsyncData(
		async () => {
			const [badges, drivers, vehicles, employees] = await Promise.all([
				badgeService.getBadges(),
				driverService.getDrivers(),
				vehicleService.getVehicles(),
				employeeService.getEmployees(),
			]);
			return {
				badges,
				drivers: drivers.length,
				vehicles: vehicles.length,
				employees: employees.length,
			};
		},
		[],
		EMPTY,
	);

	const { badges } = data;
	const countBy = (status) => badges.filter((b) => b.status === status).length;
	const value = (number) => (loading ? "…" : number);

	const recent = [...badges]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 8);

	return (
		<>
			<PageHeader
				title="لوحة تحكم الإدارة"
				description="إدارة ومتابعة السائقين والمركبات والبطاقات التعريفية"
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<StatCard
					label="إجمالي البطاقات"
					value={value(badges.length)}
					icon={CreditCard}
					color="indigo"
					to="/admin/badges"
				/>
				<StatCard
					label="البطاقات الفعالة"
					value={value(countBy(BADGE_STATUS.ACTIVE))}
					icon={CheckCircle2}
					color="emerald"
					to={`/admin/badges?status=${BADGE_STATUS.ACTIVE}`}
				/>
				<StatCard
					label="البطاقات المنتهية"
					value={value(countBy(BADGE_STATUS.EXPIRED))}
					icon={XCircle}
					color="rose"
					to={`/admin/badges?status=${BADGE_STATUS.EXPIRED}`}
				/>
				<StatCard
					label="قريبة من الانتهاء"
					value={value(countBy(BADGE_STATUS.EXPIRING_SOON))}
					icon={Clock}
					color="amber"
					to={`/admin/badges?status=${BADGE_STATUS.EXPIRING_SOON}`}
				/>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				<StatCard
					label="إجمالي السائقين"
					value={value(data.drivers)}
					icon={Users}
					color="sky"
					to="/admin/drivers"
				/>
				<StatCard
					label="إجمالي المركبات"
					value={value(data.vehicles)}
					icon={Car}
					color="violet"
					to="/admin/vehicles"
				/>
				<StatCard
					label="إجمالي الموظفين"
					value={value(data.employees)}
					icon={UserCog}
					color="slate"
					to="/admin/employees"
				/>
			</div>

			<div className="flex items-center justify-between mb-4">
				<h2 className="text-base font-bold text-slate-800">آخر البطاقات المسجلة</h2>
				<Link to="/admin/badges" className="text-xs font-medium text-indigo-600 hover:underline">
					عرض الكل
				</Link>
			</div>

			<Card>
				{loading ? (
					<LoadingState />
				) : error ? (
					<ErrorState onRetry={reload} />
				) : (
					<BadgeTable badges={recent} basePath="/admin/badges" showEmployee />
				)}
			</Card>
		</>
	);
};

export default AdminDashboard;
