import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { badgeService } from "../../services/badgeService";
import { BADGE_STATUS_LABELS } from "../../utils/badgeStatus";
import { vehicleTypeLabel, VEHICLE_TYPES } from "../../data/vehicleTypes";

const STATUS_COLORS = {
  Active: "#10b981",
  Expired: "#f43f5e",
  ExpiringSoon: "#f59e0b",
  Suspended: "#94a3b8",
};

const AdminReports = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    badgeService.getBadges().then((data) => {
      setBadges(data);
      setLoading(false);
    });
  }, []);

  const byEmployee = Object.values(
    badges.reduce((acc, b) => {
      const key = b.createdByName || b.createdBy;
      acc[key] = acc[key] || { name: key, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {})
  );

  const byStatus = Object.entries(BADGE_STATUS_LABELS).map(([value, label]) => ({
    key: value,
    name: label,
    value: badges.filter((b) => b.status === value).length,
  }));

  const byVehicleType = VEHICLE_TYPES.map((v) => ({
    name: v.label,
    count: badges.filter((b) => b.vehicleType === v.value).length,
  }));

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">التقارير</h1>
        <p className="text-sm text-slate-400 mt-1">إحصائيات ورسوم بيانية حول أداء النظام</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">عدد البطاقات لكل موظف</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byEmployee}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">توزيع حالات البطاقات</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {byStatus.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4">توزيع البطاقات حسب نوع المركبة</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byVehicleType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;
