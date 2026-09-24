import { useEffect, useState } from "react";
import { UserPlus, Pencil, Ban, Trash2, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";
import { employeeService } from "../../services/employeeService";
import { badgeService } from "../../services/badgeService";

const emptyForm = { name: "", username: "", email: "", phone: "", password: "123456" };

const AdminEmployees = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [badgeCounts, setBadgeCounts] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    const [emps, badges] = await Promise.all([employeeService.getEmployees(), badgeService.getBadges()]);
    setEmployees(emps);
    const counts = {};
    badges.forEach((b) => {
      counts[b.createdBy] = (counts[b.createdBy] || 0) + 1;
    });
    setBadgeCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = employees.filter(
    (e) => e.name.includes(query) || e.username.includes(query) || (e.email || "").includes(query)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setEditingId(employee.id);
    setForm({ name: employee.name, username: employee.username, email: employee.email || "", phone: employee.phone || "", password: "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.username.trim()) {
      showToast("الاسم واسم المستخدم مطلوبان", "error");
      return;
    }
    if (editingId) {
      const payload = { name: form.name, username: form.username, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;
      await employeeService.updateEmployee(editingId, payload);
      showToast("تم تحديث بيانات الموظف بنجاح");
    } else {
      await employeeService.createEmployee({ ...form, password: form.password || "123456" });
      showToast("تمت إضافة الموظف بنجاح");
    }
    setModalOpen(false);
    load();
  };

  const handleToggle = async (employee) => {
    await employeeService.toggleEmployeeStatus(employee.id);
    load();
  };

  const handleDelete = async () => {
    await employeeService.deleteEmployee(confirmDelete.id);
    showToast("تم حذف الموظف");
    setConfirmDelete(null);
    load();
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">الموظفون</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة حسابات الموظفين وصلاحياتهم</p>
        </div>
        <Button icon={UserPlus} onClick={openAdd}>إضافة موظف</Button>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث بالاسم أو اسم المستخدم..." className="max-w-sm mb-5" />

        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-3 px-3 font-medium">الاسم</th>
                  <th className="py-3 px-3 font-medium">اسم المستخدم</th>
                  <th className="py-3 px-3 font-medium">البريد</th>
                  <th className="py-3 px-3 font-medium">الهاتف</th>
                  <th className="py-3 px-3 font-medium">عدد البطاقات</th>
                  <th className="py-3 px-3 font-medium">الحالة</th>
                  <th className="py-3 px-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">{emp.name}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.username}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.email || "—"}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.phone || "—"}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{badgeCounts[emp.id] || 0}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                          emp.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        {emp.status === "Active" ? "فعال" : "موقوف"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(emp)} title="تعديل" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleToggle(emp)} title={emp.status === "Active" ? "إيقاف" : "تفعيل"} className="p-1.5 rounded-md hover:bg-amber-50 text-amber-500">
                          {emp.status === "Active" ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                        </button>
                        <button onClick={() => setConfirmDelete(emp)} title="حذف" className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editingId ? "حفظ التعديلات" : "إضافة"}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="الاسم الكامل" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="اسم المستخدم" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input
            label={editingId ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="حذف الموظف"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
            <Button variant="danger" onClick={handleDelete}>حذف</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          هل أنت متأكد من حذف الموظف "{confirmDelete?.name}"؟ لن يتم حذف البطاقات التي أنشأها.
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminEmployees;
