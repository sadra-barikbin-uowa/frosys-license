import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	ArrowRight,
	User,
	Users,
	Phone,
	MapPin,
	IdCard,
	Calendar,
	Pencil,
	Eye,
	Printer,
	Trash2,
	FilePlus2,
	UserX,
	Car,
	Palette,
	Tag,
} from "lucide-react";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useAsyncData } from "../../hooks/useAsyncData";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { formatDate } from "../../utils/formatDate";
import { vehicleTypeLabel } from "../../data/vehicleTypes";
import { personTypeLabel } from "../../data/personTypes";
import { badgeStatusLabel, badgeStatusStyle } from "../../utils/badgeStatus";

const InfoRow = ({ icon: Icon, label, value }) => (
	<div className="flex items-start gap-3 min-w-0">
		<div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
			<Icon size={15} />
		</div>
		<div className="min-w-0">
			<p className="text-xs text-slate-400">{label}</p>
			<p className="text-sm font-medium text-slate-700 wrap-break-word">{value || "—"}</p>
		</div>
	</div>
);

const DriverDetails = ({ role = "employee" }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { showToast } = useToast();
	const isAdmin = role === "admin";
	const basePath = `/${role}/drivers`;
	const [confirmDelete, setConfirmDelete] = useState(false);

	const { data, loading, error, reload } = useAsyncData(
		async () => {
			const driver = isAdmin
				? await driverService.getDriverById(id)
				: await driverService.getDriverByIdForEmployee(id, user.id);
			if (!driver) return null;
			const [vehicle, allBadges] = await Promise.all([
				driver.vehicleId ? vehicleService.getVehicleById(driver.vehicleId) : null,
				isAdmin ? badgeService.getBadges() : badgeService.getBadgesByEmployee(user.id),
			]);
			const badges = allBadges
				.filter((b) => b.driverId === id)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			return { driver, vehicle, badges };
		},
		[id, isAdmin, user.id],
	);

	const handleDelete = async () => {
		await driverService.deleteDriver(id);
		showToast("تم حذف السائق بنجاح", "success");
		navigate(basePath, { replace: true });
	};

	if (loading) return <LoadingState />;
	if (error) return <ErrorState onRetry={reload} />;
	if (!data) {
		return (
			<div className="bg-white rounded-xl ring-1 ring-slate-100">
				<EmptyState
					icon={UserX}
					title="لم يتم العثور على السائق"
					description="ربما حُذف هذا السائق أو لا تملك صلاحية عرضه."
					action={
						<Button to={basePath} variant="secondary" size="sm">
							العودة إلى السائقين
						</Button>
					}
				/>
			</div>
		);
	}

	const { driver, vehicle, badges } = data;

	return (
		<>
			<Link
				to={basePath}
				className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
			>
				<ArrowRight size={16} /> رجوع
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
				<Card padding="p-6" className="flex flex-col items-center text-center gap-3">
					<Avatar
						src={driver.photo}
						alt={driver.fullName}
						size="xl"
						className="ring-4 ring-slate-50"
					/>
					<div className="min-w-0 max-w-full">
						<h1 className="text-base font-bold text-slate-800 wrap-break-word">{driver.fullName}</h1>
						<p className="text-xs text-slate-500 mt-0.5">{driver.nationalId}</p>
						{driver.personType && (
							<span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
								{personTypeLabel(driver.personType)}
							</span>
						)}
					</div>
					<div className="flex w-full gap-2">
						<Button to={`${basePath}/${id}/edit`} variant="secondary" icon={Pencil} className="flex-1">
							تعديل
						</Button>
						{isAdmin && (
							<Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>
								حذف
							</Button>
						)}
					</div>
				</Card>

				<div className="flex flex-col gap-6 min-w-0">
					<Card padding="p-5 sm:p-6">
						<h2 className="text-sm font-bold text-slate-800 mb-4">المعلومات الشخصية</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<InfoRow icon={Phone} label="رقم الهاتف" value={driver.phone} />
							<InfoRow icon={MapPin} label="العنوان" value={driver.address} />
							<InfoRow icon={Users} label="اسم الأب" value={driver.fatherName} />
							<InfoRow icon={Users} label="اسم الأم" value={driver.motherName} />
							<InfoRow icon={Calendar} label="تاريخ الميلاد" value={driver.birthDate && formatDate(driver.birthDate)} />
							<InfoRow icon={IdCard} label="رقم رخصة القيادة" value={driver.licenseNumber} />
							<InfoRow
								icon={Calendar}
								label="تاريخ إصدار الرخصة"
								value={driver.licenseIssue && formatDate(driver.licenseIssue)}
							/>
							<InfoRow
								icon={Calendar}
								label="تاريخ انتهاء الرخصة"
								value={formatDate(driver.licenseExpiry)}
							/>
							{isAdmin && (
								<InfoRow icon={User} label="أُضيف بواسطة" value={driver.createdByName} />
							)}
						</div>
					</Card>

					{vehicle && (
						<Card padding="p-5 sm:p-6">
							<h2 className="text-sm font-bold text-slate-800 mb-4">معلومات المركبة</h2>
							<div className="flex flex-col sm:flex-row gap-5">
								{vehicle.photo && (
									<img
										src={vehicle.photo}
										alt="صورة المركبة"
										loading="lazy"
										className="w-full sm:w-44 h-32 object-cover rounded-lg ring-1 ring-slate-100 shrink-0"
									/>
								)}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 min-w-0">
									<InfoRow icon={Tag} label="رقم المركبة" value={vehicle.vehicleNumber} />
									<InfoRow icon={Car} label="نوع المركبة" value={vehicleTypeLabel(vehicle.vehicleType)} />
									<InfoRow icon={Car} label="الموديل" value={vehicle.model} />
									<InfoRow icon={Calendar} label="سنة الصنع" value={vehicle.year} />
									<InfoRow icon={Palette} label="اللون" value={vehicle.color} />
								</div>
							</div>
						</Card>
					)}

					<Card padding="p-5 sm:p-6">
						<div className="flex items-center justify-between gap-3 mb-4">
							<h2 className="text-sm font-bold text-slate-800">البطاقة التعريفية</h2>
							<Button
								to={`/${role}/badges/create?driver=${id}`}
								variant="outline"
								size="sm"
								icon={FilePlus2}
							>
								إصدار بطاقة جديدة
							</Button>
						</div>
						{badges.length === 0 ? (
							<p className="text-sm text-slate-500">لا توجد بطاقة لهذا السائق بعد</p>
						) : (
							<ul className="flex flex-col gap-2">
								{badges.map((badge) => (
									<li
										key={badge.id}
										className="flex items-center justify-between gap-3 border border-slate-100 rounded-lg px-4 py-3"
									>
										<div className="min-w-0">
											<p className="text-sm font-medium text-slate-700" dir="ltr">
												{badge.badgeNumber}
											</p>
											<div className="flex flex-wrap items-center gap-2 mt-1">
												<span
													className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeStatusStyle(badge)}`}
												>
													{badgeStatusLabel(badge)}
												</span>
												<span className="text-[11px] text-slate-400">
													تنتهي: {formatDate(badge.expiryDate)}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-1 shrink-0">
											<Link
												to={`/${role}/badges/${badge.id}`}
												title="عرض البطاقة"
												aria-label={`عرض البطاقة ${badge.badgeNumber}`}
												className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
											>
												<Eye size={16} />
											</Link>
											<Link
												to={`/${role}/badges/${badge.id}?print=1`}
												title="طباعة البطاقة"
												aria-label={`طباعة البطاقة ${badge.badgeNumber}`}
												className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
											>
												<Printer size={16} />
											</Link>
										</div>
									</li>
								))}
							</ul>
						)}
					</Card>
				</div>
			</div>

			{isAdmin && (
				<ConfirmDialog
					open={confirmDelete}
					onClose={() => setConfirmDelete(false)}
					title="حذف السائق"
					message="هل أنت متأكد من حذف هذا السائق؟ سيتم حذف المركبة والبطاقات المرتبطة به أيضًا، ولا يمكن التراجع عن ذلك."
					confirmLabel="حذف"
					onConfirm={handleDelete}
				/>
			)}
		</>
	);
};

export default DriverDetails;
