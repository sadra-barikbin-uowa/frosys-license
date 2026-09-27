import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Printer, ArrowRight, CreditCard, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import BadgePreview from "./BadgePreview";
import PrintBadge from "./PrintBadge";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import ImageUpload from "../common/ImageUpload";
import Modal from "../common/Modal";
import { formatDate } from "../../utils/formatDate";
import {
	BADGE_STATUS,
	badgeStatusLabel,
	badgeStatusStyle,
} from "../../utils/badgeStatus";
import { vehicleTypeLabel } from "../../data/vehicleTypes";
import { badgeService } from "../../services/badgeService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { printBadge } from "./PrintBadge";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";

const BadgeDetailView = ({ badge, backPath, showEmployee = false }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [searchParams] = useSearchParams();
	const { showToast } = useToast();
	const [currentBadge, setCurrentBadge] = useState(badge);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(null);
	const [saving, setSaving] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [previewSide, setPreviewSide] = useState("front");

	useEffect(() => {
		setCurrentBadge(badge);
	}, [badge]);

	useEffect(() => {
		if (searchParams.get("print") === "1" && badge) {
			const timer = setTimeout(() => printBadge(), 400);
			return () => clearTimeout(timer);
		}
	}, [searchParams, badge]);

	if (!currentBadge) return null;

	const startEditing = () => {
		setDraft({
			...currentBadge,
			photo: currentBadge.photo || currentBadge.driverPhoto || null,
		});
		setEditing(true);
	};

	const setDraftValue = (field) => (event) =>
		setDraft((current) => ({ ...current, [field]: event.target.value }));

	const saveChanges = async () => {
		setSaving(true);
		try {
			const updated = showEmployee
				? await badgeService.updateBadge(currentBadge.id, {
						...draft,
						driverName: draft.driverName || draft.fullName,
						driverPhoto: draft.photo || null,
						photo: draft.photo || null,
					})
				: await badgeService.updateBadgeForEmployee(currentBadge.id, user.id, {
						...draft,
						driverName: draft.driverName || draft.fullName,
						driverPhoto: draft.photo || null,
						photo: draft.photo || null,
					});
			if (!updated) throw new Error("Badge not found or access denied");
			setCurrentBadge(updated);
			setEditing(false);
			showToast("تم تحديث البطاقة بنجاح", "success");
		} catch (error) {
			console.error(error);
			showToast("تعذر حفظ تعديلات البطاقة", "error");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		await badgeService.deleteBadge(currentBadge.id);
		showToast("تم حذف البطاقة بنجاح", "success");
		navigate(backPath);
	};

	const rows = [
		["اسم السائق", currentBadge.driverName],
		["رقم الهوية", currentBadge.nationalId],
		["رقم رخصة القيادة", currentBadge.licenseNumber],
		["نوع المركبة", vehicleTypeLabel(currentBadge.vehicleType)],
		["رقم المركبة", currentBadge.vehicleNumber],
		["موديل المركبة", currentBadge.vehicleModel || "—"],
		["لون المركبة", currentBadge.vehicleColor || "—"],
		["تاريخ الإصدار", formatDate(currentBadge.issueDate)],
		["رقم البطاقة", currentBadge.badgeNumber],
		["الحالة", badgeStatusLabel(currentBadge)],
		["تاريخ الانتهاء", formatDate(currentBadge.expiryDate)],
	];
	if (showEmployee)
		rows.push([
			"تم الإنشاء بواسطة",
			`${currentBadge.createdByName} (${currentBadge.createdBy})`,
		]);

	return (
		<div>
			<div className="flex items-center justify-between mb-6 no-print">
				<Link
					to={backPath}
					className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
				>
					<ArrowRight size={16} /> رجوع
				</Link>
				<div className="flex items-center gap-2">
					{showEmployee && (
						<Button
							icon={Trash2}
							variant="danger"
							onClick={() => setConfirmDelete(true)}
						>
							حذف
						</Button>
					)}
					<Button icon={Pencil} variant="secondary" onClick={startEditing}>
						تعديل بيانات البطاقة
					</Button>
					<Button icon={Printer} onClick={() => printBadge()}>
						طباعة البطاقة
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
				<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
					<div className="screen-badge-preview">
						<BadgePreview data={currentBadge} side={previewSide} />
					</div>
					<div
						className="flex gap-1 rounded-lg bg-slate-100 p-1 no-print"
						role="tablist"
						aria-label="وجه البطاقة"
					>
						{[
							["front", "الوجه الأمامي"],
							["back", "الوجه الخلفي"],
						].map(([side, label]) => (
							<button
								key={side}
								type="button"
								role="tab"
								aria-selected={previewSide === side}
								onClick={() => setPreviewSide(side)}
								className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${previewSide === side ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
							>
								{label}
							</button>
						))}
					</div>
					<span
						className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badgeStatusStyle(currentBadge)}`}
					>
						بطاقة {badgeStatusLabel(currentBadge)}
					</span>
					<p className="text-xs text-slate-400 font-medium">
						{currentBadge.badgeNumber}
					</p>
				</div>

				<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
					<div className="flex items-center gap-2 mb-5">
						<div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
							<CreditCard size={16} />
						</div>
						<h3 className="text-sm font-bold text-slate-800">تفاصيل البطاقة</h3>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
						{rows.map(([label, value]) => (
							<div key={label}>
								<p className="text-xs text-slate-400 mb-0.5">{label}</p>
								<p className="text-sm font-medium text-slate-700">{value}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<PrintBadge data={currentBadge} />

			<Modal
				open={editing}
				onClose={() => setEditing(false)}
				title="تعديل بيانات البطاقة"
				size="xl"
				footer={
					<>
						<Button variant="secondary" onClick={() => setEditing(false)}>
							إلغاء
						</Button>
						<Button loading={saving} onClick={saveChanges}>
							حفظ التعديلات
						</Button>
					</>
				}
			>
				{draft && (
					<EditBadgeForm
						data={draft}
						onChange={(field, value) =>
							setDraft((current) => ({ ...current, [field]: value }))
						}
						setDraftValue={setDraftValue}
					/>
				)}
			</Modal>

			<Modal
				open={confirmDelete}
				onClose={() => setConfirmDelete(false)}
				title="حذف البطاقة"
				footer={
					<>
						<Button variant="secondary" onClick={() => setConfirmDelete(false)}>
							إلغاء
						</Button>
						<Button variant="danger" onClick={handleDelete}>
							حذف
						</Button>
					</>
				}
			>
				<p className="text-sm text-slate-600">
					هل أنت متأكد من حذف هذه البيانات؟ لا يمكن التراجع عن هذا الإجراء.
				</p>
			</Modal>
		</div>
	);
};

const EditBadgeForm = ({ data, onChange, setDraftValue }) => (
	<div className="grid grid-cols-1 lg:grid-cols-[1fr_342px] gap-6 items-start">
		<div className="flex flex-col gap-5">
			<ImageUpload
				label="صورة السائق"
				value={data.photo || data.driverPhoto}
				onChange={(value) => onChange("photo", value)}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					label="اسم السائق"
					value={data.driverName || data.fullName || ""}
					onChange={setDraftValue("driverName")}
				/>
				<Input
					label="الرقم الوطني"
					value={data.nationalId || ""}
					onChange={setDraftValue("nationalId")}
				/>
				<Input
					label="رقم البطاقة"
					value={data.badgeNumber || ""}
					onChange={setDraftValue("badgeNumber")}
				/>
				<Input
					label="رقم إجازة السوق"
					value={data.licenseNumber || ""}
					onChange={setDraftValue("licenseNumber")}
				/>
				<Select
					label="نوع المركبة"
					value={data.vehicleType || ""}
					onChange={setDraftValue("vehicleType")}
					options={VEHICLE_TYPES.map(({ value, label }) => ({ value, label }))}
				/>
				<Input
					label="رقم المركبة"
					value={data.vehicleNumber || ""}
					onChange={setDraftValue("vehicleNumber")}
				/>
				<Input
					label="موديل المركبة"
					value={data.vehicleModel || ""}
					onChange={setDraftValue("vehicleModel")}
				/>
				<Input
					label="لون المركبة"
					value={data.vehicleColor || data.color || ""}
					onChange={setDraftValue("vehicleColor")}
				/>
				<Input
					label="تاريخ الإصدار"
					type="date"
					value={data.issueDate || ""}
					onChange={setDraftValue("issueDate")}
				/>
				<Input
					label="تاريخ الانتهاء"
					type="date"
					value={data.expiryDate || ""}
					onChange={setDraftValue("expiryDate")}
				/>
				<Select
					label="حالة البطاقة"
					value={data.status || BADGE_STATUS.ACTIVE}
					onChange={setDraftValue("status")}
					options={[
						{ value: BADGE_STATUS.ACTIVE, label: "فعال" },
						{ value: BADGE_STATUS.SUSPENDED, label: "موقوف" },
					]}
				/>
			</div>
		</div>
		<div className="lg:sticky lg:top-0 flex flex-col items-center gap-2">
			<p className="text-xs font-semibold text-slate-500">معاينة مباشرة</p>
			<BadgePreview data={data} />
		</div>
	</div>
);

export default BadgeDetailView;
