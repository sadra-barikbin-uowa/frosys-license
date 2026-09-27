import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	ArrowRight,
	User,
	Phone,
	MapPin,
	IdCard,
	Calendar,
	Pencil,
	Eye,
	Printer,
	Trash2,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { formatDate } from "../../utils/formatDate";
import { vehicleTypeLabel } from "../../data/vehicleTypes";
import { badgeStatusLabel, badgeStatusStyle } from "../../utils/badgeStatus";

const InfoRow = ({ icon: Icon, label, value }) => (
	<div className="flex items-start gap-3">
		<div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
			<Icon size={15} />
		</div>
		<div>
			<p className="text-xs text-slate-400">{label}</p>
			<p className="text-sm font-medium text-slate-700">{value || "—"}</p>
		</div>
	</div>
);

const DriverDetails = ({
	basePath = "/employee/drivers",
	showAddedBy = false,
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { showToast } = useToast();
	const isAdmin = basePath.includes("admin");
	const [driver, setDriver] = useState(null);
	const [vehicle, setVehicle] = useState(null);
	const [badges, setBadges] = useState([]);
	const [loading, setLoading] = useState(true);
	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		const load = async () => {
			const d = isAdmin
				? await driverService.getDriverById(id)
				: await driverService.getDriverByIdForEmployee(id, user.id);
			setDriver(d);
			if (d?.vehicleId)
				setVehicle(await vehicleService.getVehicleById(d.vehicleId));
			const allBadges = isAdmin
				? await badgeService.getBadges()
				: await badgeService.getBadgesByEmployee(user.id);
			setBadges(allBadges.filter((b) => b.driverId === id));
			setLoading(false);
		};
		load();
	}, [id, isAdmin, user.id]);

	const handleDelete = async () => {
		await driverService.deleteDriver(id);
		showToast("تم حذف السائق بنجاح", "success");
		navigate(basePath);
	};

	if (loading) {
		return (
			<DashboardLayout role={basePath.includes("admin") ? "admin" : "employee"}>
				<p className="text-sm text-slate-400">جارِ التحميل...</p>
			</DashboardLayout>
		);
	}

	if (!driver) {
		return (
			<DashboardLayout role={basePath.includes("admin") ? "admin" : "employee"}>
				<p className="text-sm text-slate-400">لم يتم العثور على السائق</p>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role={basePath.includes("admin") ? "admin" : "employee"}>
			<Link
				to={basePath}
				className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
			>
				<ArrowRight size={16} /> رجوع
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
				<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
					<div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 ring-4 ring-slate-50">
						{driver.photo ? (
							<img
								src={driver.photo}
								alt={driver.fullName}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-slate-300">
								<User size={32} />
							</div>
						)}
					</div>
					<div>
						<p className="text-base font-bold text-slate-800">
							{driver.fullName}
						</p>
						<p className="text-xs text-slate-400 mt-0.5">{driver.nationalId}</p>
					</div>
					{isAdmin ? (
						<div className="flex w-full gap-2">
							<Link to={`${basePath}/${id}/edit`} className="flex-1">
								<Button variant="secondary" icon={Pencil} className="w-full">
									تعديل
								</Button>
							</Link>
							<Button
								variant="danger"
								icon={Trash2}
								onClick={() => setConfirmDelete(true)}
							>
								حذف
							</Button>
						</div>
					) : (
						<Link to={`/employee/drivers/${id}/edit`} className="w-full">
							<Button variant="secondary" icon={Pencil} className="w-full">
								تعديل البيانات
							</Button>
						</Link>
					)}
				</div>

				<div className="flex flex-col gap-6">
					<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
						<h3 className="text-sm font-bold text-slate-800 mb-4">
							المعلومات الشخصية
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<InfoRow icon={Phone} label="رقم الهاتف" value={driver.phone} />
							<InfoRow icon={MapPin} label="العنوان" value={driver.address} />
							<InfoRow
								icon={IdCard}
								label="رقم رخصة القيادة"
								value={driver.licenseNumber}
							/>
							<InfoRow
								icon={Calendar}
								label="تاريخ انتهاء الرخصة"
								value={formatDate(driver.licenseExpiry)}
							/>
							{showAddedBy && (
								<InfoRow
									icon={User}
									label="أُضيف بواسطة"
									value={driver.createdByName}
								/>
							)}
						</div>
					</div>

					{vehicle && (
						<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
							<h3 className="text-sm font-bold text-slate-800 mb-4">
								معلومات المركبة
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<InfoRow
									icon={IdCard}
									label="رقم المركبة"
									value={vehicle.vehicleNumber}
								/>
								<InfoRow
									icon={IdCard}
									label="نوع المركبة"
									value={vehicleTypeLabel(vehicle.vehicleType)}
								/>
								<InfoRow icon={IdCard} label="الموديل" value={vehicle.model} />
								<InfoRow icon={IdCard} label="اللون" value={vehicle.color} />
							</div>
						</div>
					)}

					<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
						<h3 className="text-sm font-bold text-slate-800 mb-4">
							البطاقة التعريفية
						</h3>
						{badges.length === 0 ? (
							<p className="text-sm text-slate-400">
								لا توجد بطاقة لهذا السائق بعد
							</p>
						) : (
							badges.map((badge) => (
								<div
									key={badge.id}
									className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3"
								>
									<div>
										<p className="text-sm font-medium text-slate-700">
											{badge.badgeNumber}
										</p>
										<span
											className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeStatusStyle(badge)}`}
										>
											{badgeStatusLabel(badge)}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Link
											to={`${basePath.includes("admin") ? "/admin" : "/employee"}/badges/${badge.id}`}
											className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
										>
											<Eye size={16} />
										</Link>
										<Link
											to={`${basePath.includes("admin") ? "/admin" : "/employee"}/badges/${badge.id}?print=1`}
											className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
										>
											<Printer size={16} />
										</Link>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{isAdmin && (
				<Modal
					open={confirmDelete}
					onClose={() => setConfirmDelete(false)}
					title="حذف السائق"
					footer={
						<>
							<Button
								variant="secondary"
								onClick={() => setConfirmDelete(false)}
							>
								إلغاء
							</Button>
							<Button variant="danger" onClick={handleDelete}>
								حذف
							</Button>
						</>
					}
				>
					<p className="text-sm text-slate-600">
						هل أنت متأكد من حذف هذه البيانات؟ سيتم حذف المركبة والبطاقات
						المرتبطة بهذا السائق أيضًا.
					</p>
				</Modal>
			)}
		</DashboardLayout>
	);
};

export default DriverDetails;
