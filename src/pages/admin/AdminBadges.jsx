import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import BadgeTable from "../../components/badges/BadgeTable";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import { badgeService } from "../../services/badgeService";
import { employeeService } from "../../services/employeeService";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";
import { BADGE_STATUS_LABELS } from "../../utils/badgeStatus";

const statusOptions = Object.entries(BADGE_STATUS_LABELS).map(([value, label]) => ({ value, label }));
const vehicleOptions = VEHICLE_TYPES.map((v) => ({ value: v.value, label: v.label }));

const AdminBadges = () => {
  const { showToast } = useToast();
  const [badges, setBadges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [status, setStatus] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null); // { badge, action }

  const load = async () => {
    const [b, e] = await Promise.all([badgeService.getBadges(), employeeService.getEmployees()]);
    setBadges(b);
    setEmployees(e);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = badges.filter((b) => {
    const matchesQuery =
      b.driverName.includes(query) ||
      b.badgeNumber.includes(query) ||
      (b.nationalId || "").includes(query) ||
      (b.vehicleNumber || "").includes(query);
    const matchesVehicle = !vehicleType || b.vehicleType === vehicleType;
    const matchesStatus = !status || b.status === status;
    const matchesEmployee = !employeeId || b.createdBy === employeeId;
    return matchesQuery && matchesVehicle && matchesStatus && matchesEmployee;
  });

  const handleConfirm = async () => {
    if (!confirmTarget) return;
    const { badge, action } = confirmTarget;
    if (action === "suspend") {
      await badgeService.setBadgeStatus(badge.id, "Suspended");
      showToast("تم إيقاف البطاقة");
    } else if (action === "delete") {
      await badgeService.deleteBadge(badge.id);
      showToast("تم حذف البطاقة");
    }
    setConfirmTarget(null);
    load();
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">جميع البطاقات</h1>
        <p className="text-sm text-slate-400 mt-1">عرض ومتابعة جميع البطاقات التي أنشأها الموظفون</p>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-3 mb-5">
          <SearchInput value={query} onChange={setQuery} placeholder="ابحث بالاسم، رقم البطاقة، رقم الهوية..." className="flex-1" />
          <Select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} options={vehicleOptions} placeholder="نوع المركبة" className="lg:w-40" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} placeholder="الحالة" className="lg:w-40" />
          <Select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            options={employees.map((e) => ({ value: e.id, label: e.name }))}
            placeholder="الموظف"
            className="lg:w-44"
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
        ) : (
          <BadgeTable
            badges={filtered}
            basePath="/admin/badges"
            showEmployee
            onSuspend={(badge) => setConfirmTarget({ badge, action: "suspend" })}
            onDelete={(badge) => setConfirmTarget({ badge, action: "delete" })}
          />
        )}
      </div>

      <Modal
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        title={confirmTarget?.action === "delete" ? "حذف البطاقة" : "إيقاف البطاقة"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmTarget(null)}>إلغاء</Button>
            <Button variant="danger" onClick={handleConfirm}>تأكيد</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {confirmTarget?.action === "delete"
            ? `هل أنت متأكد من حذف بطاقة "${confirmTarget?.badge?.driverName}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : `هل تريد إيقاف بطاقة "${confirmTarget?.badge?.driverName}"؟`}
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminBadges;
