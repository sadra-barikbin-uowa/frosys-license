import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, User } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import {
	badgeStatusLabel,
	computeBadgeStatus,
	BADGE_STATUS,
} from "../../utils/badgeStatus";
import { VEHICLE_TYPES, vehicleTypeLabel } from "../../data/vehicleTypes";

// البطاقة بنسبة ID Card حقيقية 85.6mm x 54mm (1.586 : 1)
// معروضة هنا بحجم مكبّر مناسب للشاشة، لكن بنفس النسبة تمامًا لضمان طباعة دقيقة
const STATUS_DOT = {
	[BADGE_STATUS.ACTIVE]: "bg-emerald-400",
	[BADGE_STATUS.EXPIRED]: "bg-rose-400",
	[BADGE_STATUS.EXPIRING_SOON]: "bg-amber-400",
	[BADGE_STATUS.SUSPENDED]: "bg-slate-400",
};

const BadgePreview = ({ data, id = "badge-preview", side = "front" }) => {
	const status = computeBadgeStatus(data);
	const photo = data.photo || data.driverPhoto;
	if (side === "back") return <BadgeBack data={data} id={id} />;
	const qrValue = JSON.stringify({
		badgeNumber: data.badgeNumber || "—",
		driverName: data.driverName || data.fullName || "—",
		vehicleNumber: data.vehicleNumber || "—",
		issueDate: data.issueDate || "—",
		expiryDate: data.expiryDate || "—",
	});

	return (
		<div
			id={id}
			className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 mx-auto select-none"
			style={{ width: "342px", aspectRatio: "1.586 / 1" }}
			dir="rtl"
		>
			{/* شريط علوي */}
			<div className="relative bg-gradient-to-l from-indigo-700 via-indigo-600 to-indigo-500 px-4 pt-3 pb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center backdrop-blur-sm">
							<ShieldCheck size={16} className="text-white" />
						</div>
						<div>
							<p className="text-[9px] font-bold text-white leading-tight">
								نظام إدارة السائقين والمركبات
							</p>
							<p className="text-[8px] text-indigo-100 leading-tight">
								FLEET ID SYSTEM
							</p>
						</div>
					</div>
					<div className="text-left">
						<p className="text-[9px] font-bold text-white">بطاقة تعريف سائق</p>
						<p className="text-[7px] text-indigo-100 tracking-wide">
							DRIVER ID CARD
						</p>
					</div>
				</div>
				{/* زخرفة دائرية */}
				<div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />
				<div className="absolute -bottom-10 left-10 w-16 h-16 rounded-full bg-white/5" />
			</div>

			{/* المحتوى */}
			<div className="relative -mt-6 px-4 flex gap-3">
				<div className="w-[68px] h-[82px] rounded-lg overflow-hidden ring-4 ring-white bg-slate-100 shrink-0 shadow-md">
					{photo ? (
						<img
							src={photo}
							alt="صورة السائق"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-300">
							<User size={28} />
						</div>
					)}
				</div>

				<div className="flex-1 min-w-0 pt-6">
					<p className="text-[12px] font-bold text-slate-800 truncate">
						{data.fullName || data.driverName || "اسم السائق الثلاثي"}
					</p>
					<div className="mt-1 grid grid-cols-1 gap-0.5">
						<p className="text-[8px] text-slate-500">
							رقم الهوية:{" "}
							<span className="font-semibold text-slate-700">
								{data.nationalId || "—"}
							</span>
						</p>
						<p className="text-[8px] text-slate-500">
							رقم البطاقة:{" "}
							<span className="font-semibold text-indigo-600">
								{data.badgeNumber || "سيتم توليده تلقائيًا"}
							</span>
						</p>
					</div>
				</div>
			</div>

			{/* معلومات المركبة */}
			<div className="px-4 mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
				<InfoCell
					label="نوع المركبة"
					value={data.vehicleType ? vehicleTypeLabel(data.vehicleType) : "—"}
				/>
				<InfoCell label="رقم المركبة" value={data.vehicleNumber || "—"} />
				<InfoCell label="رخصة القيادة" value={data.licenseNumber || "—"} />
				<InfoCell
					label="لون المركبة"
					value={data.vehicleColor || data.color || "—"}
				/>
				<InfoCell
					label="موديل المركبة"
					value={data.vehicleModel || data.model || "—"}
				/>
			</div>

			{/* الأسفل: تواريخ + QR + حالة */}
			<div className="absolute bottom-0 inset-x-0 px-4 py-2.5 flex items-end justify-between bg-slate-50 border-t border-slate-100">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<span
							className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`}
						/>
						<span className="text-[8px] font-bold text-slate-700">
							بطاقة {badgeStatusLabel(data)}
						</span>
					</div>
					<p className="text-[7px] text-slate-500">
						إصدار: {formatDate(data.issueDate)}
					</p>
					<p className="text-[7px] text-slate-500">
						انتهاء: {formatDate(data.expiryDate)}
					</p>
				</div>
				<div className="bg-white p-1 rounded-md ring-1 ring-slate-200">
					<QRCodeSVG value={qrValue} size={44} level="M" />
				</div>
				<div className="text-center min-w-[70px]">
					<p className="text-[7px] text-slate-400">توقيع المدير</p>
					<div className="mt-2 border-b border-slate-400 w-[70px]" />
				</div>
			</div>
		</div>
	);
};

const BadgeBack = ({ data, id }) => {
	const selectedType = data.vehicleType;

	return (
		<div
			id={id}
			className="relative overflow-hidden rounded-2xl bg-slate-50 shadow-xl ring-1 ring-slate-200 mx-auto select-none"
			style={{ width: "342px", aspectRatio: "1.586 / 1" }}
			dir="rtl"
		>
			<div className="relative bg-gradient-to-l from-indigo-700 via-indigo-600 to-indigo-500 px-4 py-3 text-white">
				<p className="text-[10px] font-bold">أنواع المركبات المعتمدة</p>
				<p className="text-[7px] text-indigo-100">VEHICLE TYPE REFERENCE</p>
			</div>
			<div className="p-4">
				<div className="grid grid-cols-2 gap-2">
					{VEHICLE_TYPES.map(({ value, label, icon: Icon }) => {
						const selected = value === selectedType;
						return (
							<div
								key={value}
								className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
									selected
										? "border-indigo-500 bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300"
										: "border-slate-200 bg-white text-slate-500"
								}`}
							>
								<Icon size={15} />
								<div className="min-w-0">
									<p className="text-[8px] font-bold truncate">{label}</p>
									<p className="text-[7px] truncate">
										{selected
											? `رقم المركبة: ${data.vehicleNumber || "—"}`
											: "غير مسجل"}
									</p>
								</div>
							</div>
						);
					})}
				</div>
				<div className="mt-3 border-t border-slate-200 pt-2 text-center">
					<p className="text-[7px] text-slate-400">النوع المسجل في البطاقة</p>
					<p className="text-[9px] font-bold text-indigo-700">
						{selectedType ? vehicleTypeLabel(selectedType) : "—"} -{" "}
						{data.vehicleNumber || "—"}
					</p>
				</div>
			</div>
		</div>
	);
};

const InfoCell = ({ label, value }) => (
	<div className="leading-tight">
		<p className="text-[7px] text-slate-400">{label}</p>
		<p className="text-[9px] font-semibold text-slate-700 truncate">{value}</p>
	</div>
);

export default BadgePreview;
