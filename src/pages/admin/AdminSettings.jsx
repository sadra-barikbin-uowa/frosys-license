import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import { settingsService } from "../../services/settingsService";

const AdminSettings = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then(setForm);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await settingsService.updateSettings(form);
    showToast("تم حفظ الإعدادات بنجاح");
    setSaving(false);
  };

  if (!form) {
    return (
      <DashboardLayout role="admin">
        <p className="text-sm text-slate-400">جارِ التحميل...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">الإعدادات</h1>
        <p className="text-sm text-slate-400 mt-1">تخصيص إعدادات النظام والبطاقات التعريفية</p>
      </div>

      <div className="max-w-xl bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <SettingsIcon size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">الإعدادات العامة</h3>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="اسم المؤسسة"
            value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          />
          <Input
            label="مدة صلاحية البطاقة (بالسنوات)"
            type="number"
            min={1}
            value={form.badgeValidityYears}
            onChange={(e) => setForm({ ...form, badgeValidityYears: Number(e.target.value) })}
          />
          <Input
            label="عدد الأيام لاعتبار البطاقة قريبة من الانتهاء"
            type="number"
            min={1}
            value={form.expiringSoonDays}
            onChange={(e) => setForm({ ...form, expiringSoonDays: Number(e.target.value) })}
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
