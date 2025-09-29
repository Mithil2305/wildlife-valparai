import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";

// Loading Component
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

// Lazy-loaded Page Components - Updated paths to match your structure
const Home = lazy(() => import("./pages/public/Home.jsx"));
const About = lazy(() => import("./pages/public/About.jsx"));
const Contact = lazy(() => import("./pages/public/Contact.jsx"));
const Login = lazy(() => import("./pages/public/Login.jsx"));
const Register = lazy(() => import("./pages/public/Register.jsx"));
const NotFound = lazy(() => import("./pages/public/NotFound.jsx"));

const Sightings = lazy(() => import("./pages/content/Sightings.jsx"));
const SightingDetail = lazy(() => import("./pages/content/SightingDetail.jsx"));
const Blogs = lazy(() => import("./pages/content/Blogs.jsx"));
const BlogDetail = lazy(() => import("./pages/content/BlogDetail.jsx"));

const Profile = lazy(() => import("./pages/user/Profile.jsx"));
const LeaderboardPage = lazy(() => import("./pages/user/LeaderboardPage.jsx"));

const SubmitSighting = lazy(() => import("./pages/creator/SubmitSighting.jsx"));
const CreateBlog = lazy(() => import("./pages/creator/CreateBlog.jsx"));
const EditBlog = lazy(() => import("./pages/creator/EditBlog.jsx"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminSightings = lazy(() => import("./pages/admin/AdminSightings.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs.jsx"));

// Suspense wrapper component
const SuspenseWrapper = ({ children }) => (
	<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

const AppRoutes = () => {
	return (
		<Routes>
			{/* Public Routes with Main Layout */}
			<Route path="/" element={<MainLayout />}>
				<Route
					index
					element={
						<SuspenseWrapper>
							<Home />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="about"
					element={
						<SuspenseWrapper>
							<About />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="contact"
					element={
						<SuspenseWrapper>
							<Contact />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="sightings"
					element={
						<SuspenseWrapper>
							<Sightings />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="sightings/:id"
					element={
						<SuspenseWrapper>
							<SightingDetail />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="blogs"
					element={
						<SuspenseWrapper>
							<Blogs />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="blogs/:id"
					element={
						<SuspenseWrapper>
							<BlogDetail />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="leaderboard"
					element={
						<SuspenseWrapper>
							<LeaderboardPage />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="login"
					element={
						<SuspenseWrapper>
							<Login />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="register"
					element={
						<SuspenseWrapper>
							<Register />
						</SuspenseWrapper>
					}
				/>
			</Route>

			{/* Protected User Routes with Main Layout */}
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				<Route
					path="profile"
					element={
						<SuspenseWrapper>
							<Profile />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="submit-sighting"
					element={
						<SuspenseWrapper>
							<SubmitSighting />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="create-blog"
					element={
						<SuspenseWrapper>
							<CreateBlog />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="edit-blog/:id"
					element={
						<SuspenseWrapper>
							<EditBlog />
						</SuspenseWrapper>
					}
				/>
			</Route>

			{/* Protected Admin Routes with Admin Layout */}
			<Route
				path="/admin"
				element={
					<AdminRoute>
						<AdminLayout />
					</AdminRoute>
				}
			>
				<Route
					index
					element={
						<SuspenseWrapper>
							<AdminDashboard />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="sightings"
					element={
						<SuspenseWrapper>
							<AdminSightings />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="users"
					element={
						<SuspenseWrapper>
							<AdminUsers />
						</SuspenseWrapper>
					}
				/>

				<Route
					path="blogs"
					element={
						<SuspenseWrapper>
							<AdminBlogs />
						</SuspenseWrapper>
					}
				/>
			</Route>

			{/* Redirects */}
			<Route path="/home" element={<Navigate to="/" replace />} />
			<Route path="/signin" element={<Navigate to="/login" replace />} />
			<Route path="/signup" element={<Navigate to="/register" replace />} />
			<Route path="/dashboard" element={<Navigate to="/admin" replace />} />

			{/* 404 Not Found Route */}
			<Route
				path="*"
				element={
					<SuspenseWrapper>
						<NotFound />
					</SuspenseWrapper>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
