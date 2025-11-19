import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaPlus, FaChevronDown } from "react-icons/fa";
import { HiDocumentText, HiPhotograph } from "react-icons/hi";

// Import auth functions from your project's 'services' folder
import {
	auth,
	onAuthStateChanged,
	userDoc,
	getDoc,
} from "../services/firebase";
import { signOut } from "../services/authApi";

/**
 * ----------------------------------------------------------------
 * @component BlogSocialToggle
 * ----------------------------------------------------------------
 */
const BlogSocialToggle = ({ isSocials, onToggle }) => {
	return (
		<div className="flex items-center space-x-3">
			<span
				className={`font-medium ${
					!isSocials ? "text-black" : "text-gray-500"
				} transition-colors`}
			>
				Blogs
			</span>

			<button
				type="button"
				onClick={onToggle}
				className="relative inline-flex h-8 w-[52px] flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 p-1 transition-all duration-300 ease-in-out focus:outline-none"
				role="switch"
				aria-checked={isSocials}
			>
				<span
					aria-hidden="true"
					className={`${
						isSocials ? "translate-x-[22px]" : "translate-x-0"
					} inline-block h-6 w-6 transform rounded-full bg-[#335833] shadow-lg ring-0 transition-transform duration-300 ease-in-out`}
				/>
			</button>

			<span
				className={`font-medium ${
					isSocials ? "text-black" : "text-gray-500"
				} transition-colors`}
			>
				Socials
			</span>
		</div>
	);
};

/**
 * ----------------------------------------------------------------
 * @component CreatePostDropdown
 * ----------------------------------------------------------------
 */
const CreatePostDropdown = ({ onClose }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleNavigation = (path) => {
		navigate(path);
		setIsOpen(false);
		if (onClose) onClose();
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 bg-[#e7fbe7] cursor-pointer text-[#335833] font-semibold px-4 py-2 rounded-lg hover:bg-opacity-20 transition-all duration-200"
			>
				<FaPlus className="text-sm" />
				<span>Create Post</span>
				<FaChevronDown
					className={`text-xs transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop for closing */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>

					{/* Dropdown Content */}
					<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
						<button
							onClick={() => handleNavigation("/upload/blog")}
							className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
						>
							<div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
								<HiDocumentText className="text-blue-600 text-xl" />
							</div>
							<div>
								<p className="font-semibold text-gray-900">Write Blog</p>
								<p className="text-xs text-gray-500">Share your story</p>
							</div>
						</button>

						<button
							onClick={() => handleNavigation("/upload/content")}
							className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
						>
							<div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
								<HiPhotograph className="text-green-600 text-xl" />
							</div>
							<div>
								<p className="font-semibold text-gray-900">Upload Social</p>
								<p className="text-xs text-gray-500">Photo & Audio</p>
							</div>
						</button>
					</div>
				</>
			)}
		</div>
	);
};

/**
 * ----------------------------------------------------------------
 * @component Navbar
 * ----------------------------------------------------------------
 */
const Navbar = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	// Determine toggle state from the URL
	const isSocials = location.pathname.startsWith("/socials");

	// Handler for the toggle
	const handleToggle = () => {
		if (isSocials) {
			navigate("/");
		} else {
			navigate("/socials");
		}
		closeMobileMenu();
	};

	// Subscribe to auth changes and fetch user profile
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setCurrentUser(user);
			if (user) {
				try {
					const userRef = userDoc(user.uid);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						setUserProfile(userSnap.data());
					}
				} catch (error) {
					console.error("Error fetching user profile:", error);
				}
			} else {
				setUserProfile(null);
			}
		});
		return () => unsubscribe();
	}, []);

	const handleLogout = () => {
		signOut();
		setIsOpen(false);
		setUserProfile(null);
	};

	const closeMobileMenu = () => setIsOpen(false);

	// Check if user is a creator
	const isCreator = userProfile?.accountType === "creator";

	// Tailwind Classes
	const desktopLinkClasses = "text-gray-700 hover:text-black transition-colors";
	const mobileLinkClasses =
		"block py-4 text-lg text-center text-gray-700 hover:bg-gray-100";
	const loginButtonClasses =
		"bg-[#335833] text-white font-medium px-5 py-2 rounded-lg hover:bg-opacity-90 active:scale-95 transition-all duration-200";
	const profileLinkClasses =
		"text-black font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200";
	const logoutButtonClasses =
		"bg-[#e7fbe7]  text-[#335833] px-5 py-2 rounded-lg font-medium hover:cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200";

	return (
		<nav className="bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
			<div className="container mx-auto max-w-7xl px-4 md:px-6">
				{/* Desktop Layout */}
				<div className="flex justify-between items-center py-3">
					<Link to="/" className="text-2xl font-bold text-black tracking-tight">
						Wildlife Valparai
					</Link>

					<div className="hidden md:flex items-center space-x-6">
						<NavLink to="/" className={desktopLinkClasses}>
							Home
						</NavLink>
						<NavLink to="/about" className={desktopLinkClasses}>
							About
						</NavLink>
						<NavLink to="/contact" className={desktopLinkClasses}>
							Contact
						</NavLink>
						<NavLink to="/sponsor" className={desktopLinkClasses}>
							Become Sponsor
						</NavLink>

						{currentUser ? (
							<>
								{/* Create Post Dropdown - Only for Creators */}
								{isCreator && <CreatePostDropdown />}

								<Link to="/profile" className={profileLinkClasses}>
									Profile
								</Link>
								<button onClick={handleLogout} className={logoutButtonClasses}>
									Logout
								</button>
							</>
						) : (
							<Link to="/login" className={loginButtonClasses}>
								Login / Register
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-black text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
							aria-label="Toggle menu"
						>
							{isOpen ? <FaTimes /> : <FaBars />}
						</button>
					</div>
				</div>

				{/* Centered Toggle (Desktop) */}
				<div className="hidden md:flex justify-center pb-3">
					<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
				</div>
			</div>

			{/* Mobile Menu Panel */}
			<div
				className={`md:hidden absolute top-full left-0 w-full bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 ease-in-out ${
					isOpen
						? "max-h-screen opacity-100"
						: "max-h-0 opacity-0 overflow-hidden"
				}`}
			>
				<div className="flex flex-col divide-y divide-gray-200">
					<NavLink
						to="/"
						className={mobileLinkClasses}
						onClick={closeMobileMenu}
					>
						Home
					</NavLink>
					<NavLink
						to="/about"
						className={mobileLinkClasses}
						onClick={closeMobileMenu}
					>
						About
					</NavLink>
					<NavLink
						to="/contact"
						className={mobileLinkClasses}
						onClick={closeMobileMenu}
					>
						Contact
					</NavLink>
					<NavLink
						to="/sponsor"
						className={mobileLinkClasses}
						onClick={closeMobileMenu}
					>
						Become Sponsor
					</NavLink>

					{/* Mobile Toggle */}
					<div className="py-4 flex justify-center">
						<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
					</div>

					{/* Conditional Auth Buttons (Mobile) */}
					<div className="p-4">
						{currentUser ? (
							<div className="flex flex-col space-y-3">
								{/* Create Post Buttons - Mobile (Only for Creators) */}
								{isCreator && (
									<div className="space-y-2 pb-3 border-b border-gray-200">
										<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
											Create Content
										</p>
										<Link
											to="/upload/blog"
											onClick={closeMobileMenu}
											className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
										>
											<HiDocumentText className="text-blue-600 text-xl" />
											<div className="text-left">
												<p className="font-semibold text-gray-900 text-sm">
													Write Blog
												</p>
												<p className="text-xs text-gray-500">
													Share your story
												</p>
											</div>
										</Link>
										<Link
											to="/upload/content"
											onClick={closeMobileMenu}
											className="flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
										>
											<HiPhotograph className="text-green-600 text-xl" />
											<div className="text-left">
												<p className="font-semibold text-gray-900 text-sm">
													Upload Social
												</p>
												<p className="text-xs text-gray-500">Photo & Audio</p>
											</div>
										</Link>
									</div>
								)}

								<Link
									to="/profile"
									className="text-center font-medium py-3 hover:bg-gray-100 rounded-lg"
									onClick={closeMobileMenu}
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="flex flex-col space-y-3">
								<Link
									to="/login"
									className="text-center font-medium py-3 hover:bg-gray-100 rounded-lg"
									onClick={closeMobileMenu}
								>
									Login
								</Link>
								<Link
									to="/register"
									className="bg-[#335833] text-white font-medium px-4 py-3 rounded-lg hover:bg-opacity-90 text-center"
									onClick={closeMobileMenu}
								>
									Register
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
