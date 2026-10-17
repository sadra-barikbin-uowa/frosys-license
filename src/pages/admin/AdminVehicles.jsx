import { useDeferredValue, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import VehicleTable from "../../components/vehicles/VehicleTable";
import { useAsyncData } from "../../hooks/useAsyncData";
import { vehicleService } from "../../services/vehicleService";
import { VEHICLE_TYPES } from "../../data/vehicleTypes";
import { matchesQuery } from "../../utils/search";

const vehicleOptions = VEHICLE_TYPES.map((v) => ({ value: v.value, label: v.label }));

const AdminVehicles = () => {
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const [type, setType] = useState("");
	const {
		data: vehicles,
		loading,
		error,
		reload,
	} = useAsyncData(() => vehicleService.getVehicles(), [], []);

	const filtered = useMemo(
		() =>
			vehicles.filter(
				(v) =>
					matchesQuery(deferredQuery, v.vehicleNumber, v.model, v.color) &&
					(!type || v.vehicleType === type),
			),
		[vehicles, deferredQuery, type],
	);

	return (
		<>
			<PageHeader title="المركبات" description="جميع المركبات المسجّلة في النظام" />

			<Card>
				<div className="flex flex-col sm:flex-row gap-3 mb-5">
					<SearchInput
						value={query}
						onChange={setQuery}
						placeholder="ابحث برقم المركبة أو الموديل..."
						className="sm:flex-1 sm:max-w-sm"
					/>
					<Select
						value={type}
						onChange={(e) => setType(e.target.value)}
						options={vehicleOptions}
						placeholder="نوع المركبة"
						className="sm:w-48"
					/>
				</div>
				{loading ? (
					<LoadingState />
				) : error ? (
					<ErrorState onRetry={reload} />
				) : (
					<VehicleTable
						vehicles={filtered}
						emptyText={query || type ? "لا توجد مركبات مطابقة" : "لا توجد مركبات مسجلة"}
					/>
				)}
			</Card>
		</>
	);
};

export default AdminVehicles;
