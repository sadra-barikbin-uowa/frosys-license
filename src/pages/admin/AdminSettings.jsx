import { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ImageUpload from "../../components/common/ImageUpload";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";

const AdminSettings = () => {
	const { showToast } = useToast();
	const { settings, updateSettings } = useSettings();
	const [form, setForm] = useState(settings);
	const [saving, setSaving] = useState(false);

	const handleSave = async () => {
		setSaving(true);
		try {
			await updateSettings(form);
			showToast("تم حفظ الإعدادات بنجاح", "success");
		} finally {
			setSaving(false);
		}
	};

	return (
		<DashboardLayout role="admin">
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-slate-800">
					الإعدادات
				</h1>
				<p className="text-sm text-slate-400 mt-1">
					تخصيص إعدادات النظام والبطاقات التعريفية
				</p>
			</div>

			<div className="max-w-xl bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
				<div className="flex items-center gap-2 mb-5">
					<div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
						<SettingsIcon size={16} />
					</div>
					<h3 className="text-sm font-bold text-slate-800">الإعدادات العامة</h3>
				</div>

				<div className="flex flex-col gap-4">
					<ImageUpload
						label="شعار المؤسسة"
						value={form.logo}
						onChange={(value) => setForm({ ...form, logo: value || "" })}
					/>
					<Input
						label="اسم النظام / المؤسسة"
						value={form.systemName}
						onChange={(e) => setForm({ ...form, systemName: e.target.value })}
					/>
					<Input
						label="معلومات التواصل"
						value={form.contactInfo}
						onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
					/>
					<label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
						لون البطاقة الأساسي
						<input
							type="color"
							value={form.badgeColor}
							onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white p-1"
						/>
					</label>
					<Input
						label="مدة صلاحية البطاقة (بالسنوات)"
						type="number"
						min={1}
						value={form.badgeValidityYears}
						onChange={(e) =>
							setForm({ ...form, badgeValidityYears: Number(e.target.value) })
						}
					/>
					<Input
						label="عدد الأيام لاعتبار البطاقة قريبة من الانتهاء"
						type="number"
						min={1}
						value={form.expiringSoonDays}
						onChange={(e) =>
							setForm({ ...form, expiringSoonDays: Number(e.target.value) })
						}
					/>
				</div>

				<div className="mt-6 flex justify-end">
					<Button icon={Save} onClick={handleSave} loading={saving}>
						حفظ الإعدادات
					</Button>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default AdminSettings;
