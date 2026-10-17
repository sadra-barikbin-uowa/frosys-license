import { useDeferredValue, useMemo, useState } from "react";
import { Car } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { useAuth } from "../../hooks/useAuth";
import { useAsyncData } from "../../hooks/useAsyncData";
import { vehicleService } from "../../services/vehicleService";
import { matchesQuery } from "../../utils/search";

const Vehicles = () => {
	const { user } = useAuth();
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const {
		data: vehicles,
		loading,
		error,
		reload,
	} = useAsyncData(
		async () => (await vehicleService.getVehicles()).filter((v) => v.createdBy === user.id),
		[user.id],
		[],
	);

	const filtered = useMemo(
		() =>
			vehicles.filter((v) => matchesQuery(deferredQuery, v.vehicleNumber, v.model, v.color)),
		[vehicles, deferredQuery],
	);

	return (
		<>
			<PageHeader title="المركبات" description="المركبات المرتبطة بالسائقين الذين أضفتهم" />

			<SearchInput
				value={query}
				onChange={setQuery}
				placeholder="ابحث برقم المركبة أو الموديل..."
				className="max-w-sm mb-5"
			/>

			{loading ? (
				<LoadingState />
			) : error ? (
				<ErrorState onRetry={reload} />
			) : filtered.length === 0 ? (
				<div className="bg-white rounded-xl ring-1 ring-slate-100">
					<EmptyState icon={Car} title={query ? "لا توجد مركبات مطابقة للبحث" : "لا توجد مركبات"} />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((v) => (
						<VehicleCard key={v.id} vehicle={v} />
					))}
				</div>
			)}
		</>
	);
};

export default Vehicles;
