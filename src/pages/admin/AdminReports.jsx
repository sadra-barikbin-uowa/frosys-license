import { BarChart3 } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { useAsyncData } from "../../hooks/useAsyncData";
import { badgeService } from "../../services/badgeService";
import { BADGE_STATUS_LABELS } from "../../utils/badgeStatus";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";

const STATUS_COLORS = {
	Active: "#10b981",
	Expired: "#f43f5e",
	ExpiringSoon: "#f59e0b",
	Suspended: "#94a3b8",
};

const TOOLTIP_STYLE = {
	borderRadius: 8,
	border: "1px solid #e2e8f0",
	fontFamily: "inherit",
	fontSize: 12,
	direction: "rtl",
};

const truncate = (text) => (text.length > 12 ? `${text.slice(0, 11)}…` : text);

const ChartCard = ({ title, className = "", children }) => (
	<Card className={className}>
		<h2 className="text-sm font-bold text-slate-800 mb-4">{title}</h2>
		{/* الرسوم البيانية تُرسم من اليسار لليمين، فنثبّت الاتجاه لتجنّب اختلال المحاور */}
		<div dir="ltr">{children}</div>
	</Card>
);

const AdminReports = () => {
	const {
		data: badges,
		loading,
		error,
		reload,
	} = useAsyncData(() => badgeService.getBadges(), [], []);

	// نجمّع حسب معرّف الموظف (وليس الاسم) حتى لا يُدمج موظفان يحملان الاسم نفسه
	const byEmployee = Object.values(
		badges.reduce((acc, b) => {
			const key = b.createdBy || b.createdByName || "—";
			acc[key] = acc[key] || { name: b.createdByName || key, count: 0 };
			acc[key].count += 1;
			return acc;
		}, {}),
	);

	const byStatus = Object.entries(BADGE_STATUS_LABELS).map(([value, label]) => {
		const count = badges.filter((b) => b.status === value).length;
		return { key: value, name: `${label} (${count})`, value: count };
	});

	const byVehicleType = VEHICLE_TYPES.map((v) => ({
		name: v.label,
		count: badges.filter((b) => b.vehicleType === v.value).length,
	}));

	return (
		<>
			<PageHeader title="التقارير" description="إحصائيات ورسوم بيانية حول أداء النظام" />

			{loading ? (
				<LoadingState />
			) : error ? (
				<ErrorState onRetry={reload} />
			) : badges.length === 0 ? (
				<Card>
					<EmptyState
						icon={BarChart3}
						title="لا توجد بيانات لعرض التقارير"
						description="ستظهر الرسوم البيانية هنا بمجرد إصدار أول بطاقة."
						action={
							<Button to="/admin/badges/create" size="sm">
								إصدار بطاقة
							</Button>
						}
					/>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ChartCard title="عدد البطاقات لكل موظف">
						<ResponsiveContainer width="100%" height={280}>
							<BarChart data={byEmployee}>
								<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
								<XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={truncate} />
								<YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
								<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, "البطاقات"]} />
								<Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</ChartCard>

					<ChartCard title="توزيع حالات البطاقات">
						<ResponsiveContainer width="100%" height={280}>
							<PieChart>
								<Pie
									data={byStatus}
									dataKey="value"
									nameKey="name"
									innerRadius={55}
									outerRadius={90}
									paddingAngle={2}
								>
									{byStatus.map((entry) => (
										<Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
									))}
								</Pie>
								<Legend wrapperStyle={{ fontSize: 12 }} />
								<Tooltip contentStyle={TOOLTIP_STYLE} />
							</PieChart>
						</ResponsiveContainer>
					</ChartCard>

					<ChartCard title="توزيع البطاقات حسب نوع المركبة" className="lg:col-span-2">
						<ResponsiveContainer width="100%" height={280}>
							<BarChart data={byVehicleType}>
								<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
								<XAxis dataKey="name" tick={{ fontSize: 11 }} />
								<YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
								<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, "البطاقات"]} />
								<Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</ChartCard>
				</div>
			)}
		</>
	);
};

export default AdminReports;
