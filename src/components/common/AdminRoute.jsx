import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
	const { currentUser } = useAuth();
	// Add admin check logic here
	return currentUser ? children : <Navigate to="/login" />;
};

export default AdminRoute;
