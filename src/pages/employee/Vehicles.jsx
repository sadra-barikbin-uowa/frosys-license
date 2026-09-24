import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../context/AuthContext";
import { vehicleService } from "../../services/vehicleService";

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicles().then((data) => {
      setVehicles(data.filter((v) => v.createdBy === user.id));
      setLoading(false);
    });
  }, [user.id]);

  const filtered = vehicles.filter(
    (v) => v.vehicleNumber.includes(query) || (v.model || "").includes(query)
  );

  return (
    <DashboardLayout role="employee">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">المركبات</h1>
        <p className="text-sm text-slate-400 mt-1">المركبات المرتبطة بالسائقين الذين أضفتهم</p>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="ابحث برقم المركبة أو الموديل..." className="max-w-sm mb-5" />

      {loading ? (
        <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl ring-1 ring-slate-100 p-10 text-center text-sm text-slate-400">لا توجد مركبات</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Vehicles;
