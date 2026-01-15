import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaPlus, FaChevronDown } from "react-icons/fa";
import { HiDocumentText, HiPhotograph } from "react-icons/hi";

// Import auth functions
import {
	getAuthInstance,
	onAuthStateChanged,
	getUserDoc,
	getDoc,
} from "../services/firebase";
import { signOut } from "../services/authApi";
import Leaderboard from "./Leaderboard";

/**
 * ----------------------------------------------------------------
 * @component BlogSocialToggle
 * ----------------------------------------------------------------
 */
const BlogSocialToggle = ({ isSocials, onToggle }) => {
	return (
		<div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200/50 shadow-inner backdrop-blur-sm">
			<button
				onClick={() => isSocials && onToggle()}
				className={`px-4 py-1.5 rounded-full text-[14px] font-bold cursor-pointer transition-all duration-300 ${
					!isSocials
						? "bg-[#335833] text-white shadow-sm ring-1 ring-gray-900/5"
						: "text-gray-400 hover:text-gray-700"
				}`}
			>
				Blogs
			</button>
			<button
				onClick={() => !isSocials && onToggle()}
				className={`px-4 py-1.5 rounded-full text-[14px] cursor-pointer font-bold transition-all duration-300 ${
					isSocials
						? "bg-[#335833] text-white shadow-sm ring-1 ring-gray-900/5"
						: "text-gray-400 hover:text-gray-700"
				}`}
			>
				Socials
			</button>
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
		<div className="relative cursor-pointer">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex cursor-pointer items-center gap-2 bg-[#335833] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#2a4a2a] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ring-2 ring-offset-2 ring-[#335833]/20"
			>
				<FaPlus className="text-[10px]" />
				<span>Create</span>
				<FaChevronDown
					className={`text-[10px] transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ring-1 ring-black/5">
						<div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
							<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								Select Format
							</p>
						</div>
						<button
							onClick={() => handleNavigation("/upload/blog")}
							className="w-full flex cursor-pointer items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left group"
						>
							<div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors group-hover:scale-110 duration-200">
								<HiDocumentText className="text-lg" />
							</div>
							<div>
								<p className="font-bold  text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
									Write Article
								</p>
								<p className="text-[11px] text-gray-500">
									Long-form stories & guides
								</p>
							</div>
						</button>

						<button
							onClick={() => handleNavigation("/upload/content")}
							className="cursor-pointer w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left group"
						>
							<div className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors group-hover:scale-110 duration-200">
								<HiPhotograph className="text-lg" />
							</div>
							<div>
								<p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
									Wildlife Moment
								</p>
								<p className="text-[11px] text-gray-500">
									Photo + Audio experience
								</p>
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
	const [scrolled, setScrolled] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const isSocials = location.pathname.startsWith("/socials");

	const handleToggle = () => {
		if (isSocials) {
			navigate("/");
		} else {
			navigate("/socials");
		}
		closeMobileMenu();
	};

	useEffect(() => {
		const auth = getAuthInstance();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setCurrentUser(user);
			if (user) {
				try {
					const userRef = await getUserDoc(user.uid);
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

		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);

		return () => {
			unsubscribe();
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleLogout = () => {
		signOut();
		setIsOpen(false);
		setUserProfile(null);
	};

	const closeMobileMenu = () => setIsOpen(false);
	const isCreator = userProfile?.accountType === "creator";

	// Styles
	const activeLink =
		"text-[#335833] font-bold bg-green-50 px-3 py-1.5 rounded-lg";
	const inactiveLink =
		"text-gray-500 hover:text-gray-900 font-medium px-3 py-1.5 transition-colors";

	return (
		<nav
			className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
				scrolled
					? "bg-white/80 backdrop-blur-xl border-gray-200/60 shadow-sm py-2"
					: "bg-white border-transparent py-4"
			}`}
		>
			<div className="container mx-auto max-w-7xl px-4 md:px-6">
				{/* Desktop Layout */}
				<div className="flex justify-between items-center relative h-10">
					{/* Brand */}
					<Link
						to="/"
						className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-2 z-10 hover:opacity-80 transition-opacity"
					>
						<span className="text-[#335833]">Wildlife</span>Valparai
					</Link>

					{/* Centered Toggle (Absolute positioning maintained as requested) */}
					<div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
					</div>

					{/* Right Menu */}
					<div className="hidden md:flex items-center space-x-6 z-10">
						<div className="flex items-center space-x-2 text-sm">
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive && !isSocials ? activeLink : inactiveLink
								}
							>
								Home
							</NavLink>
							<NavLink
								to="/about"
								className={({ isActive }) =>
									isActive ? activeLink : inactiveLink
								}
							>
								About
							</NavLink>
							<NavLink
								to="/sponsor"
								className={({ isActive }) =>
									isActive ? activeLink : inactiveLink
								}
							>
								Sponsors
							</NavLink>
							<NavLink
								to="/leaderboard"
								className={({ isActive }) =>
									isActive ? activeLink : inactiveLink
								}
							>
								Leaderboard
							</NavLink>
						</div>

						<div className="h-6 w-px bg-gray-200 mx-2"></div>

						{currentUser ? (
							<div className="flex items-center gap-4">
								{/* Create Post Dropdown */}
								{isCreator && <CreatePostDropdown />}

								<Link to="/profile" className="flex items-center gap-2 group">
									<div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden group-hover:ring-2 group-hover:ring-[#335833] group-hover:ring-offset-2 transition-all">
										<img
											src={
												userProfile?.profilePhotoUrl ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													userProfile?.name || "User"
												)}`
											}
											alt=""
											className="w-full h-full object-cover"
										/>
									</div>
								</Link>
							</div>
						) : (
							<Link
								to="/login"
								className="bg-[#335833] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#5b925b] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
							>
								Join Community
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center gap-3">
						{/* Show Create button on mobile header if creator */}
						{currentUser && isCreator && !isOpen && (
							<button
								onClick={() => navigate("/upload/content")}
								className="w-8 h-8 bg-[#335833] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
							>
								<FaPlus size={12} />
							</button>
						)}

						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-gray-800 text-xl p-2 hover:bg-gray-100 rounded-xl transition-colors"
							aria-label="Toggle menu"
						>
							{isOpen ? <FaTimes /> : <FaBars />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu Panel */}
			<div
				className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
					isOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="flex flex-col p-4 space-y-4">
					{/* Mobile Toggle */}
					<div className="flex justify-center pb-4 border-b border-gray-100">
						<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
					</div>

					<NavLink
						to="/"
						className={({ isActive }) =>
							`block px-4 py-3 rounded-xl font-bold transition-all ${
								isActive && !isSocials
									? "bg-green-50 text-[#335833]"
									: "text-gray-600 hover:bg-gray-50"
							}`
						}
						onClick={closeMobileMenu}
					>
						Home
					</NavLink>
					<NavLink
						to="/about"
						className={({ isActive }) =>
							`block px-4 py-3 rounded-xl font-bold transition-all ${
								isActive
									? "bg-green-50 text-[#335833]"
									: "text-gray-600 hover:bg-gray-50"
							}`
						}
						onClick={closeMobileMenu}
					>
						About
					</NavLink>
					<NavLink
						to="/contact"
						className={({ isActive }) =>
							`block px-4 py-3 rounded-xl font-bold transition-all ${
								isActive
									? "bg-green-50 text-[#335833]"
									: "text-gray-600 hover:bg-gray-50"
							}`
						}
						onClick={closeMobileMenu}
					>
						Contact
					</NavLink>
					<NavLink
						to="/sponsor"
						className={({ isActive }) =>
							`block px-4 py-3 rounded-xl font-bold transition-all ${
								isActive
									? "bg-green-50 text-[#335833]"
									: "text-gray-600 hover:bg-gray-50"
							}`
						}
						onClick={closeMobileMenu}
					>
						Sponsors
					</NavLink>

					{/* Mobile User Actions */}
					<div className="pt-4 border-t border-gray-100">
						{currentUser ? (
							<div className="flex flex-col gap-3">
								<Link
									to="/profile"
									className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl"
									onClick={closeMobileMenu}
								>
									<div className="w-8 h-8 rounded-full bg-white overflow-hidden shadow-sm ring-1 ring-gray-200">
										<img
											src={
												userProfile?.profilePhotoUrl ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													userProfile?.name || "User"
												)}`
											}
											alt=""
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="font-bold text-gray-900">My Profile</span>
								</Link>

								{isCreator && (
									<div className="grid grid-cols-2 gap-3">
										<Link
											to="/upload/blog"
											onClick={closeMobileMenu}
											className="flex flex-col items-center justify-center p-4 bg-blue-50/50 border border-blue-100 text-blue-700 rounded-2xl font-bold text-xs gap-2 active:scale-95 transition-transform"
										>
											<HiDocumentText size={20} />
											Write Blog
										</Link>
										<Link
											to="/upload/content"
											onClick={closeMobileMenu}
											className="flex flex-col items-center justify-center p-4 bg-green-50/50 border border-green-100 text-green-700 rounded-2xl font-bold text-xs gap-2 active:scale-95 transition-transform"
										>
											<HiPhotograph size={20} />
											Upload Social
										</Link>
									</div>
								)}

								<button
									onClick={handleLogout}
									className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
								>
									Log Out
								</button>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								<Link
									to="/login"
									className="w-full py-3 text-center text-gray-700 font-bold hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
									onClick={closeMobileMenu}
								>
									Log In
								</Link>
								<Link
									to="/register"
									className="w-full py-3 text-center bg-[#335833] text-white font-bold rounded-xl shadow-md active:scale-95 transition-all"
									onClick={closeMobileMenu}
								>
									Sign Up
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
