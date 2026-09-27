import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import BadgePreview from "../../components/badges/BadgePreview";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { addYears, todayISO } from "../../utils/formatDate";

const CreateBadge = ({ role = "employee" }) => {
	const { user } = useAuth();
	const { settings } = useSettings();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const [drivers, setDrivers] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [vehicle, setVehicle] = useState(null);
	const [issueDate, setIssueDate] = useState(todayISO());
	const [expiryDate, setExpiryDate] = useState(() =>
		addYears(todayISO(), Number(settings.badgeValidityYears) || 1),
	);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		(role === "admin"
			? driverService.getDrivers()
			: driverService.getDriversByEmployee(user.id)
		).then(setDrivers);
	}, [user.id, role]);

	useEffect(() => {
		const driver = drivers.find((d) => d.id === selectedId);
		if (driver?.vehicleId) {
			vehicleService.getVehicleById(driver.vehicleId).then(setVehicle);
		} else {
			setVehicle(null);
		}
	}, [selectedId, drivers]);

	const selectedDriver = drivers.find((d) => d.id === selectedId);

	const previewData = selectedDriver
		? {
				...selectedDriver,
				vehicleType: vehicle?.vehicleType,
				vehicleNumber: vehicle?.vehicleNumber,
				vehicleColor: vehicle?.color,
				issueDate,
				expiryDate,
			}
		: null;

	const handleSubmit = async () => {
		if (!selectedDriver) {
			showToast("الرجاء اختيار السائق أولًا", "error");
			return;
		}
		setSubmitting(true);
		try {
			const newBadge = await badgeService.createBadge({
				driverId: selectedDriver.id,
				vehicleId: vehicle?.id,
				driverName: selectedDriver.fullName,
				personType: selectedDriver.personType,
				driverPhoto: selectedDriver.photo,
				nationalId: selectedDriver.nationalId,
				licenseNumber: selectedDriver.licenseNumber,
				vehicleType: vehicle?.vehicleType,
				vehicleNumber: vehicle?.vehicleNumber,
				vehicleModel: vehicle?.model,
				vehicleColor: vehicle?.color,
				issueDate,
				expiryDate,
				createdBy: user.id,
				createdByName: user.name,
			});
			showToast("تم إنشاء البطاقة بنجاح", "success");
			navigate(`/${role}/badges/${newBadge.id}`);
		} catch (err) {
			console.error(err);
			showToast("حدث خطأ أثناء إنشاء البطاقة", "error");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<DashboardLayout role={role}>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-slate-800">
					إصدار بطاقة
				</h1>
				<p className="text-sm text-slate-400 mt-1">
					اختر سائقًا مسجّلاً مسبقًا لإصدار بطاقة تعريفية جديدة له
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
				<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5 flex flex-col gap-4">
					<div className="flex items-center gap-2 mb-1">
						<Search size={16} className="text-indigo-500" />
						<h3 className="text-sm font-bold text-slate-800">اختيار السائق</h3>
					</div>
					<Select
						label="السائق"
						required
						value={selectedId}
						onChange={(e) => setSelectedId(e.target.value)}
						placeholder="اختر سائقًا"
						options={drivers.map((d) => ({
							value: d.id,
							label: `${d.fullName} — ${d.nationalId}`,
						}))}
					/>

					{drivers.length === 0 && (
						<p className="text-xs text-slate-400">
							لا يوجد سائقون مسجّلون بعد. قم بإضافة سائق أولًا.
						</p>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<Input
							label="تاريخ الإصدار"
							type="date"
							value={issueDate}
							onChange={(e) => setIssueDate(e.target.value)}
						/>
						<Input
							label="تاريخ الانتهاء"
							type="date"
							value={expiryDate}
							onChange={(e) => setExpiryDate(e.target.value)}
						/>
					</div>
				</div>

				<div className="lg:sticky lg:top-6 flex flex-col gap-4">
					<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
						<div className="flex items-center gap-2 mb-4">
							<Sparkles size={16} className="text-indigo-500" />
							<h3 className="text-sm font-bold text-slate-800">
								معاينة البطاقة
							</h3>
						</div>
						{previewData ? (
							<BadgePreview data={previewData} />
						) : (
							<div className="aspect-[1.586/1] rounded-2xl bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center text-xs text-slate-400">
								اختر سائقًا لعرض معاينة البطاقة
							</div>
						)}
					</div>
					<Button
						onClick={handleSubmit}
						loading={submitting}
						disabled={!selectedDriver}
						size="lg"
						className="w-full"
					>
						إنشاء البطاقة
					</Button>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default CreateBadge;
