import Input from "../common/Input";
import ImageUpload from "../common/ImageUpload";
import Select from "../common/Select";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";
import { PERSON_TYPES } from "../../data/personTypes";
import { User, IdCard, Car as CarIcon } from "lucide-react";

// نموذج شامل لبيانات السائق + الرخصة + المركبة، يُستخدم في صفحتي
// إضافة سائق وتعديل سائق. البيانات تُدار بالكامل من الصفحة الأب (Controlled)
const Section = ({ title, icon: Icon, children }) => (
	<div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5 flex flex-col gap-4">
		<div className="flex items-center gap-2">
			<div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
				<Icon size={16} />
			</div>
			<h3 className="text-sm font-bold text-slate-800">{title}</h3>
		</div>
		{children}
	</div>
);

const DriverForm = ({ data, errors, onChange }) => {
	const set = (field) => (e) => onChange(field, e.target.value);

	return (
		<div className="flex flex-col gap-5">
			<Section title="المعلومات الشخصية" icon={User}>
				<ImageUpload
					label="صورة السائق"
					value={data.photo}
					onChange={(val) => onChange("photo", val)}
					error={errors.photo}
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						label="الاسم الكامل"
						required
						value={data.fullName}
						onChange={set("fullName")}
						error={errors.fullName}
						placeholder="مثال: محمد أحمد الغامدي"
					/>
					<Select
						label="صفة حامل البطاقة"
						required
						value={data.personType}
						onChange={set("personType")}
						error={errors.personType}
						placeholder="اختر الصفة"
						options={PERSON_TYPES}
					/>
					<Input
						label="رقم الهوية الوطنية"
						required
						value={data.nationalId}
						onChange={set("nationalId")}
						error={errors.nationalId}
						placeholder="10XXXXXXXX"
					/>
					<Input
						label="اسم الأب"
						value={data.fatherName}
						onChange={set("fatherName")}
					/>
					<Input
						label="اسم الأم"
						value={data.motherName}
						onChange={set("motherName")}
					/>
					<Input
						label="تاريخ الميلاد"
						type="date"
						value={data.birthDate}
						onChange={set("birthDate")}
					/>
					<Input
						label="رقم الهاتف"
						required
						value={data.phone}
						onChange={set("phone")}
						error={errors.phone}
						placeholder="05XXXXXXXX"
					/>
					<Input
						label="العنوان"
						containerClassName="sm:col-span-2"
						value={data.address}
						onChange={set("address")}
						placeholder="المدينة - الحي - الشارع"
					/>
				</div>
			</Section>

			<Section title="معلومات رخصة القيادة" icon={IdCard}>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Input
						label="رقم رخصة القيادة"
						required
						value={data.licenseNumber}
						onChange={set("licenseNumber")}
						error={errors.licenseNumber}
					/>
					<Input
						label="تاريخ الإصدار"
						type="date"
						value={data.licenseIssue}
						onChange={set("licenseIssue")}
					/>
					<Input
						label="تاريخ الانتهاء"
						required
						type="date"
						value={data.licenseExpiry}
						onChange={set("licenseExpiry")}
						error={errors.licenseExpiry}
					/>
				</div>
			</Section>

			<Section title="معلومات المركبة" icon={CarIcon}>
				<div>
					<label className="text-sm font-medium text-slate-700 mb-2 block">
						نوع المركبة <span className="text-rose-500">*</span>
					</label>
					<div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
						{VEHICLE_TYPES.map(({ value, label, icon: Icon }) => {
							const selected = data.vehicleType === value;
							return (
								<button
									type="button"
									key={value}
									onClick={() => onChange("vehicleType", value)}
									className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-xs font-medium transition-all border-2 ${
										selected
											? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
											: "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
									}`}
								>
									<Icon size={20} />
									{label}
								</button>
							);
						})}
					</div>
					{errors.vehicleType && (
						<p className="text-xs text-rose-500 mt-1.5">{errors.vehicleType}</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						label="رقم المركبة"
						required
						value={data.vehicleNumber}
						onChange={set("vehicleNumber")}
						error={errors.vehicleNumber}
					/>
					<Input
						label="الموديل"
						value={data.model}
						onChange={set("model")}
						placeholder="مثال: تويوتا كامري"
					/>
					<Input
						label="سنة الصنع"
						value={data.year}
						onChange={set("year")}
						placeholder="مثال: 2023"
					/>
					<Input
						label="اللون"
						value={data.color}
						onChange={set("color")}
						placeholder="مثال: أبيض"
					/>
				</div>

				<ImageUpload
					label="صورة المركبة"
					value={data.vehiclePhoto}
					onChange={(val) => onChange("vehiclePhoto", val)}
				/>
			</Section>
		</div>
	);
};

export default DriverForm;
