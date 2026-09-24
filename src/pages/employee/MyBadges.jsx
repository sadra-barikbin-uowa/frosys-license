import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import BadgeCard from "../../components/badges/BadgeCard";
import { useAuth } from "../../context/AuthContext";
import { badgeService } from "../../services/badgeService";
import { BADGE_STATUS, BADGE_STATUS_LABELS } from "../../utils/badgeStatus";

const statusOptions = Object.entries(BADGE_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const MyBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    badgeService.getBadgesByEmployee(user.id).then((data) => {
      setBadges(data);
      setLoading(false);
    });
  }, [user.id]);

  const filtered = badges.filter((b) => {
    const matchesQuery =
      b.driverName.includes(query) || b.badgeNumber.includes(query) || (b.nationalId || "").includes(query);
    const matchesStatus = !status || b.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <DashboardLayout role="employee">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">البطاقات الخاصة بي</h1>
          <p className="text-sm text-slate-400 mt-1">جميع البطاقات التعريفية التي أنشأتها</p>
        </div>
        <Link to="/employee/badges/create">
          <Button icon={FilePlus2}>إصدار بطاقة</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث بالاسم أو رقم البطاقة..." className="max-w-sm" />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          placeholder="كل الحالات"
          className="max-w-[180px]"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl ring-1 ring-slate-100 p-10 text-center text-sm text-slate-400">لا توجد بطاقات مطابقة</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyBadges;
