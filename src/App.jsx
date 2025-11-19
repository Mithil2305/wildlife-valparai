import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster

// --- Core Components ---
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import NotFound from "./components/NotFound.jsx";

// --- Auth Components ---
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

// --- Static Page Components ---
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Sponsor from "./components/Sponsor.jsx";
import Donation from "./components/Donation.jsx";

// --- Legal Documents ---
import Disclaimer from "./documents/Disclaimer.jsx";
import PrivacyPolicy from "./documents/PrivacyPolicy.jsx";
import TermsandConditions from "./documents/TermsandConditions.jsx";

// --- Main Feature Components ---
import Leaderboard from "./components/Leaderboard.jsx";
import Points from "./components/Points.jsx";
import PointsHistory from "./components/PointsHistory.jsx";

// --- Blog Components ---
import CreateBlog from "./blogs/CreateBlog.jsx";
import BlogDetail from "./blogs/BlogDetail.jsx";
import EditBlog from "./blogs/EditBlog.jsx";
import ManageBlogs from "./blogs/ManageBlogs.jsx";

// --- Socials Components ---
import Socials from "./socials/Socials.jsx";
import UploadContent from "./socials/UploadContent.jsx";
import ManageSocial from "./socials/ManageSocial.jsx";

// --- Dashboard Components ---
import CreatorDashboard from "./dashboard/CreatorDashboard.jsx";
import AdminDashboard from "./dashboard/AdminDashboard.jsx";
import Profile from "./components/Profile.jsx"; // Import the new Profile component

// --- Payment Components ---
import AdminPayments from "./payments/AdminPayments.jsx";
import PaymentHistory from "./payments/PaymentHistory.jsx";

// --- Auth Services ---
import { auth, onAuthStateChanged } from "./services/firebase.js";
import Favorites from "./socials/Favorites.jsx";

/**
 * A wrapper for routes that require a user to be logged in.
 * Redirects to the /login page if no user is found.
 */
const ProtectedRoute = ({ user, redirectPath = "/login" }) => {
	if (!user) {
		return <Navigate to={redirectPath} replace />;
	}
	// Renders the child route (e.g., <CreatorDashboard />)
	return <Outlet />;
};

const App = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Listen to auth state changes from firebase
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	// Show a loading spinner while firebase is checking auth
	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		// The <BrowserRouter> is in main.jsx, so this works
		<main className="flex flex-col min-h-screen">
			<Toaster position="top-center" reverseOrder={false} />{" "}
			{/* Add Toaster here */}
			<Navbar />
			<div className="grow">
				<Routes>
					{/* --- Public Routes --- */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/sponsor" element={<Sponsor />} />
					<Route path="/donate" element={<Donation />} />

					{/* Blog Routes */}
					<Route path="/blogs/manage" element={<ManageBlogs />} />
					<Route path="/blog/:postId" element={<BlogDetail />} />
					<Route path="/blog/edit/:postId" element={<EditBlog />} />

					{/* Socials Routes */}
					<Route path="/socials" element={<Socials />} />
					<Route path="/socials/favorites" element={<Favorites />} />

					{/* Legal Routes */}
					<Route path="/legal/disclaimer" element={<Disclaimer />} />
					<Route path="/legal/privacy" element={<PrivacyPolicy />} />
					<Route path="/legal/terms" element={<TermsandConditions />} />

					{/* --- Protected Routes (Require Login) --- */}
					<Route element={<ProtectedRoute user={currentUser} />}>
						<Route path="/profile" element={<Profile />} />{" "}
						{/* Add the Profile route */}
						{/* Creator Dashboard & Actions */}
						<Route path="/dashboard/creator" element={<CreatorDashboard />} />
						<Route path="/upload/content" element={<UploadContent />} />
						<Route path="/upload/blog" element={<CreateBlog />} />
						<Route path="/socials/manage" element={<ManageSocial />} />
						{/* General User Features */}
						<Route path="/points" element={<Points />} />
						<Route path="/points/history" element={<PointsHistory />} />
						<Route path="/payments/history" element={<PaymentHistory />} />
						{/* Admin Dashboard & Actions */}
						<Route path="/dashboard/admin" element={<AdminDashboard />} />
						<Route path="/admin/payments" element={<AdminPayments />} />
					</Route>

					{/* --- Not Found Route --- */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			<Footer />
		</main>
	);
};

export default App;
