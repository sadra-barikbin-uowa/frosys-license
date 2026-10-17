import { Component } from "react";
import ErrorState from "../common/ErrorState";

// يمنع انهيار الواجهة بالكامل (شاشة بيضاء) إذا حدث خطأ أثناء عرض صفحة واحدة.
// يُعاد إنشاؤه عند كل تنقل (عبر key) فيختفي الخطأ عند الانتقال لصفحة أخرى.
class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error("خطأ في عرض الصفحة", error, info);
	}

	render() {
		if (this.state.error) {
			return (
				<ErrorState
					message="حدث خطأ غير متوقع أثناء عرض هذه الصفحة"
					onRetry={() => window.location.reload()}
				/>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
