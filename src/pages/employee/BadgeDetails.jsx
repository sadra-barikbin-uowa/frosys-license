import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import BadgeDetailView from "../../components/badges/BadgeDetailView";
import { badgeService } from "../../services/badgeService";
import { useAuth } from "../../context/AuthContext";

const BadgeDetails = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const [badge, setBadge] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		badgeService.getBadgeByIdForEmployee(id, user.id).then((data) => {
			setBadge(data);
			setLoading(false);
		});
	}, [id, user.id]);

	return (
		<DashboardLayout role="employee">
			{loading ? (
				<p className="text-sm text-slate-400">جارِ التحميل...</p>
			) : !badge ? (
				<p className="text-sm text-slate-400">لم يتم العثور على البطاقة</p>
			) : (
				<BadgeDetailView badge={badge} backPath="/employee/badges" />
			)}
		</DashboardLayout>
	);
};

export default BadgeDetails;
