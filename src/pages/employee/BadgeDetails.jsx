import { useParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import BadgeDetailView from "../../components/badges/BadgeDetailView";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { badgeService } from "../../services/badgeService";
import { useAuth } from "../../hooks/useAuth";
import { useAsyncData } from "../../hooks/useAsyncData";

const BadgeDetails = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const {
		data: badge,
		loading,
		error,
		reload,
	} = useAsyncData(() => badgeService.getBadgeByIdForEmployee(id, user.id), [id, user.id]);

	if (loading) return <LoadingState />;
	if (error) return <ErrorState onRetry={reload} />;
	if (!badge) {
		return (
			<div className="surface">
				<EmptyState
					icon={CreditCard}
					title="لم يتم العثور على البطاقة"
					description="ربما حُذفت هذه البطاقة أو لا تملك صلاحية عرضها."
					action={
						<Button to="/employee/badges" variant="secondary" size="sm">
							العودة إلى بطاقاتي
						</Button>
					}
				/>
			</div>
		);
	}

	return <BadgeDetailView badge={badge} backPath="/employee/badges" />;
};

export default BadgeDetails;
