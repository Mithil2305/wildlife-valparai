import React, { useState, useEffect } from "react";
// --- UPDATED IMPORTS ---
// We now need useLocation and useNavigate to control the toggle
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

// Import auth functions from your project's 'services' folder
import { auth, onAuthStateChanged } from "../services/firebase";
import { signOut } from "../services/authApi";

/**
 * ----------------------------------------------------------------
 * @component BlogSocialToggle
 * ----------------------------------------------------------------
 * --- UPDATED ---
 * This is now a "controlled" component. It receives its state
 * ('isSocials') and its click handler ('onToggle') from the Navbar.
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
				onClick={onToggle} // Use the onToggle prop
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
 * @component Navbar
 * ----------------------------------------------------------------
 */
const Navbar = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	// --- NEW: React Router hooks ---
	const location = useLocation();
	const navigate = useNavigate();

	// Determine toggle state from the URL.
	// We check if the pathname starts with /socials.
	const isSocials = location.pathname.startsWith("/socials");

	// --- NEW: Handler for the toggle ---
	const handleToggle = () => {
		if (isSocials) {
			navigate("/"); // Toggle to Home/Blogs
		} else {
			navigate("/socials"); // Toggle to Socials
		}
		closeMobileMenu(); // Close mobile menu on toggle
	};

	// Subscribe to auth changes from your services/firebase.js
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});
		return () => unsubscribe();
	}, []);

	const handleLogout = () => {
		signOut();
		setIsOpen(false);
	};

	const closeMobileMenu = () => setIsOpen(false);

	// --- Tailwind Classes (unchanged) ---
	const desktopLinkClasses = "text-gray-700 hover:text-black transition-colors";
	const mobileLinkClasses =
		"block py-4 text-lg text-center text-gray-700 hover:bg-gray-100";
	const loginButtonClasses =
		"bg-[#335833] text-white font-medium px-5 py-2 rounded-lg hover:bg-opacity-90 active:scale-95 transition-all duration-200";
	const profileLinkClasses =
		"text-black font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200";
	const logoutButtonClasses =
		"bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all duration-200";

	return (
		<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
			<div className="container mx-auto max-w-7xl px-4 md:px-6">
				{/* --- UPDATED: Desktop Layout --- */}
				{/* Row 1: Logo, Links, Auth */}
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
							Become Sponser
						</NavLink>

						{currentUser ? (
							<>
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

					{/* Mobile Menu Button (unchanged) */}
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

				{/* --- NEW: Row 2: Centered Toggle (Desktop) --- */}
				<div className="hidden md:flex justify-center pb-3">
					<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
				</div>
			</div>

			{/* --- Mobile Menu Panel --- */}
			<div
				className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${
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
						Become Sponser
					</NavLink>

					{/* Mobile Toggle (already centered, now functional) */}
					<div className="py-4 flex justify-center">
						<BlogSocialToggle isSocials={isSocials} onToggle={handleToggle} />
					</div>

					{/* Conditional Auth Buttons (Mobile) */}
					<div className="p-4">
						{currentUser ? (
							<div className="flex flex-col space-y-3">
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
