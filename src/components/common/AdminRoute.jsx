import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
	const { user, isAdmin, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default AdminRoute;
