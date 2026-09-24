import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import VehicleTable from "../../components/vehicles/VehicleTable";
import { vehicleService } from "../../services/vehicleService";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";

const vehicleOptions = VEHICLE_TYPES.map((v) => ({ value: v.value, label: v.label }));

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicles().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const filtered = vehicles.filter((v) => {
    const matchesQuery = v.vehicleNumber.includes(query) || (v.model || "").includes(query);
    const matchesType = !type || v.vehicleType === type;
    return matchesQuery && matchesType;
  });

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">المركبات</h1>
        <p className="text-sm text-slate-400 mt-1">جميع المركبات المسجّلة في النظام</p>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchInput value={query} onChange={setQuery} placeholder="ابحث برقم المركبة أو الموديل..." className="max-w-sm" />
          <Select value={type} onChange={(e) => setType(e.target.value)} options={vehicleOptions} placeholder="نوع المركبة" className="max-w-[180px]" />
        </div>
        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">جارِ التحميل...</p>
        ) : (
          <VehicleTable vehicles={filtered} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminVehicles;
