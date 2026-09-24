import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const EmployeeRoute = ({ children }) => {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user?.role === "employee" ? children : <Navigate to="/admin/dashboard" replace />}
    </ProtectedRoute>
  );
};

export default EmployeeRoute;
