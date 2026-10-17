import ProtectedRoute from "./ProtectedRoute";

const EmployeeRoute = ({ children }) => <ProtectedRoute role="employee">{children}</ProtectedRoute>;

export default EmployeeRoute;
