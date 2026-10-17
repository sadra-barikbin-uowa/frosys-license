import { useParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import BadgeDetailView from "../../components/badges/BadgeDetailView";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { badgeService } from "../../services/badgeService";
import { useAsyncData } from "../../hooks/useAsyncData";

const AdminBadgeDetails = () => {
	const { id } = useParams();
	const {
		data: badge,
		loading,
		error,
		reload,
	} = useAsyncData(() => badgeService.getBadgeById(id), [id]);

	if (loading) return <LoadingState />;
	if (error) return <ErrorState onRetry={reload} />;
	if (!badge) {
		return (
			<div className="bg-white rounded-xl ring-1 ring-slate-100">
				<EmptyState
					icon={CreditCard}
					title="لم يتم العثور على البطاقة"
					description="ربما حُذفت هذه البطاقة."
					action={
						<Button to="/admin/badges" variant="secondary" size="sm">
							العودة إلى جميع البطاقات
						</Button>
					}
				/>
			</div>
		);
	}

	return <BadgeDetailView badge={badge} backPath="/admin/badges" isAdmin />;
};

export default AdminBadgeDetails;
