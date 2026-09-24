import { useState } from "react";
import { Search as SearchIcon, User, CreditCard } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import DriverTable from "../../components/drivers/DriverTable";
import BadgeTable from "../../components/badges/BadgeTable";
import { useAuth } from "../../context/AuthContext";
import { driverService } from "../../services/driverService";
import { badgeService } from "../../services/badgeService";

const EmployeeSearch = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [searched, setSearched] = useState(false);

  const runSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setSearched(false);
      return;
    }
    const [allDrivers, allBadges] = await Promise.all([
      driverService.getDriversByEmployee(user.id),
      badgeService.getBadgesByEmployee(user.id),
    ]);
    setDrivers(
      allDrivers.filter((d) => d.fullName.includes(value) || d.nationalId.includes(value) || d.phone.includes(value))
    );
    setBadges(
      allBadges.filter(
        (b) => b.driverName.includes(value) || b.badgeNumber.includes(value) || (b.vehicleNumber || "").includes(value)
      )
    );
    setSearched(true);
  };

  return (
    <DashboardLayout role="employee">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">البحث</h1>
        <p className="text-sm text-slate-400 mt-1">ابحث عن سائق أو بطاقة تعريفية ضمن بياناتك</p>
      </div>

      <SearchInput
        value={query}
        onChange={runSearch}
        placeholder="ابحث بالاسم، رقم الهوية، رقم البطاقة، أو رقم المركبة..."
        className="max-w-lg mb-8"
      />

      {!searched ? (
        <div className="text-center py-16 text-slate-300">
          <SearchIcon size={40} className="mx-auto mb-3" />
          <p className="text-sm text-slate-400">ابدأ بكتابة كلمة للبحث</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">السائقون ({drivers.length})</h3>
            </div>
            <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
              <DriverTable drivers={drivers} basePath="/employee/drivers" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">البطاقات ({badges.length})</h3>
            </div>
            <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
              <BadgeTable badges={badges} basePath="/employee/badges" showEmployee={false} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeSearch;
