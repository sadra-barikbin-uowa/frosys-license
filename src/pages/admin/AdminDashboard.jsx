import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, CheckCircle2, XCircle, Clock, Users, Car, UserCog } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import BadgeTable from "../../components/badges/BadgeTable";
import { badgeService } from "../../services/badgeService";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { employeeService } from "../../services/employeeService";
import { BADGE_STATUS } from "../../utils/badgeStatus";

const AdminDashboard = () => {
  const [badges, setBadges] = useState([]);
  const [driversCount, setDriversCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [b, d, v, e] = await Promise.all([
        badgeService.getBadges(),
        driverService.getDrivers(),
        vehicleService.getVehicles(),
        employeeService.getEmployees(),
      ]);
      setBadges(b);
      setDriversCount(d.length);
      setVehiclesCount(v.length);
      setEmployeesCount(e.length);
      setLoading(false);
    };
    load();
  }, []);

  const stats = {
    total: badges.length,
    active: badges.filter((b) => b.status === BADGE_STATUS.ACTIVE).length,
    expired: badges.filter((b) => b.status === BADGE_STATUS.EXPIRED).length,
    expiringSoon: badges.filter((b) => b.status === BADGE_STATUS.EXPIRING_SOON).length,
  };

  const recent = [...badges]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">لوحة تحكم الإدارة</h1>
        <p className="text-sm text-slate-400 mt-1">إدارة ومتابعة السائقين والمركبات والبطاقات التعريفية</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="إجمالي البطاقات" value={loading ? "…" : stats.total} icon={CreditCard} color="indigo" />
        <StatCard label="البطاقات الفعالة" value={loading ? "…" : stats.active} icon={CheckCircle2} color="emerald" />
        <StatCard label="البطاقات المنتهية" value={loading ? "…" : stats.expired} icon={XCircle} color="rose" />
        <StatCard label="قريبة من الانتهاء" value={loading ? "…" : stats.expiringSoon} icon={Clock} color="amber" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="إجمالي السائقين" value={loading ? "…" : driversCount} icon={Users} color="sky" />
        <StatCard label="إجمالي المركبات" value={loading ? "…" : vehiclesCount} icon={Car} color="violet" />
        <StatCard label="إجمالي الموظفين" value={loading ? "…" : employeesCount} icon={UserCog} color="slate" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">آخر البطاقات المسجلة</h2>
        <Link to="/admin/badges" className="text-xs font-medium text-indigo-600 hover:underline">
          عرض الكل
        </Link>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
        ) : (
          <BadgeTable badges={recent} basePath="/admin/badges" showEmployee />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
