import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Car, CreditCard, CheckCircle2, XCircle, UserPlus, FilePlus2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import BadgeCard from "../../components/badges/BadgeCard";
import { useAuth } from "../../context/AuthContext";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { BADGE_STATUS } from "../../utils/badgeStatus";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [d, v, b] = await Promise.all([
        driverService.getDriversByEmployee(user.id),
        vehicleService.getVehicles(),
        badgeService.getBadgesByEmployee(user.id),
      ]);
      setDrivers(d);
      setVehicles(v.filter((veh) => d.some((dr) => dr.id === veh.driverId)));
      setBadges(b);
      setLoading(false);
    };
    load();
  }, [user.id]);

  const active = badges.filter((b) => b.status === BADGE_STATUS.ACTIVE).length;
  const expired = badges.filter((b) => b.status === BADGE_STATUS.EXPIRED).length;

  return (
    <DashboardLayout role="employee">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">مرحبًا، {user.name} 👋</h1>
        <p className="text-sm text-slate-400 mt-1">إليك ملخص نشاطك في النظام</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/employee/drivers/add">
          <button className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors">
            <UserPlus size={16} /> إضافة سائق
          </button>
        </Link>
        <Link to="/employee/badges/create">
          <button className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-white ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
            <FilePlus2 size={16} /> إصدار بطاقة
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="السائقون المضافون" value={loading ? "…" : drivers.length} icon={Users} color="indigo" />
        <StatCard label="المركبات" value={loading ? "…" : vehicles.length} icon={Car} color="sky" />
        <StatCard label="البطاقات المُصدرة" value={loading ? "…" : badges.length} icon={CreditCard} color="violet" />
        <StatCard label="البطاقات الفعالة" value={loading ? "…" : active} icon={CheckCircle2} color="emerald" />
        <StatCard label="البطاقات المنتهية" value={loading ? "…" : expired} icon={XCircle} color="rose" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">آخر البطاقات التي أنشأتها</h2>
        <Link to="/employee/badges" className="text-xs font-medium text-indigo-600 hover:underline">
          عرض الكل
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">جارِ التحميل...</p>
      ) : badges.length === 0 ? (
        <div className="bg-white rounded-xl ring-1 ring-slate-100 p-10 text-center text-sm text-slate-400">
          لم تقم بإنشاء أي بطاقة بعد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.slice(0, 6).map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
