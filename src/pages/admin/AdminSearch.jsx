import { useState } from "react";
import { Search as SearchIcon, User, CreditCard, Car } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import DriverTable from "../../components/drivers/DriverTable";
import BadgeTable from "../../components/badges/BadgeTable";
import VehicleTable from "../../components/vehicles/VehicleTable";
import { driverService } from "../../services/driverService";
import { badgeService } from "../../services/badgeService";
import { vehicleService } from "../../services/vehicleService";

const AdminSearch = () => {
  const [query, setQuery] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searched, setSearched] = useState(false);

  const runSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setSearched(false);
      return;
    }
    const [allDrivers, allBadges, allVehicles] = await Promise.all([
      driverService.getDrivers(),
      badgeService.getBadges(),
      vehicleService.getVehicles(),
    ]);
    setDrivers(allDrivers.filter((d) => d.fullName.includes(value) || d.nationalId.includes(value) || d.phone.includes(value)));
    setBadges(allBadges.filter((b) => b.driverName.includes(value) || b.badgeNumber.includes(value) || (b.vehicleNumber || "").includes(value)));
    setVehicles(allVehicles.filter((v) => v.vehicleNumber.includes(value) || (v.model || "").includes(value)));
    setSearched(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">البحث</h1>
        <p className="text-sm text-slate-400 mt-1">ابحث في جميع بيانات السائقين والمركبات والبطاقات</p>
      </div>

      <SearchInput
        value={query}
        onChange={runSearch}
        placeholder="ابحث بالاسم، رقم الهوية، رقم البطاقة، رقم المركبة..."
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
              <DriverTable drivers={drivers} basePath="/admin/drivers" showEmployee />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">البطاقات ({badges.length})</h3>
            </div>
            <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
              <BadgeTable badges={badges} basePath="/admin/badges" showEmployee />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Car size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">المركبات ({vehicles.length})</h3>
            </div>
            <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
              <VehicleTable vehicles={vehicles} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSearch;
