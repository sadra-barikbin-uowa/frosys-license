import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import Button from "../../components/common/Button";
import DriverTable from "../../components/drivers/DriverTable";
import { useAuth } from "../../context/AuthContext";
import { driverService } from "../../services/driverService";

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    driverService.getDriversByEmployee(user.id).then((data) => {
      setDrivers(data);
      setLoading(false);
    });
  }, [user.id]);

  const filtered = drivers.filter(
    (d) =>
      d.fullName.includes(query) ||
      d.nationalId.includes(query) ||
      d.phone.includes(query)
  );

  return (
    <DashboardLayout role="employee">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">السائقون</h1>
          <p className="text-sm text-slate-400 mt-1">قائمة السائقين الذين قمت بإضافتهم</p>
        </div>
        <Link to="/employee/drivers/add">
          <Button icon={UserPlus}>إضافة سائق</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث بالاسم أو رقم الهوية أو الهاتف..." className="max-w-sm mb-5" />
        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
        ) : (
          <DriverTable drivers={filtered} basePath="/employee/drivers" />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Drivers;
