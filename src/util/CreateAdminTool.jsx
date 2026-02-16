import React, { useState } from "react";
import {
	doc,
	updateDoc,
	getDoc,
	setDoc,
	serverTimestamp,
	getFirebaseAuth,
	getFirebaseDb,
	getUsersCollection,
} from "../services/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const CreateAdminTool = () => {
	// Mode: 'update' (existing user) or 'create' (new user)
	const [mode, setMode] = useState("update");
	const [targetUserId, setTargetUserId] = useState("");

	// New User Form Data
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");

	// 1. Promote Existing User
	const handlePromoteUser = async (e) => {
		e.preventDefault();
		if (!targetUserId) return toast.error("Enter a User ID");

		setLoading(true);
		setStatus("Checking user...");

		try {
			const usersCol = await getUsersCollection();
			const userRef = doc(usersCol, targetUserId);
			const userSnap = await getDoc(userRef);

			if (!userSnap.exists()) {
				setStatus("User not found!");
				toast.error("User ID not found in database");
				setLoading(false);
				return;
			}

			await updateDoc(userRef, {
				accountType: "admin",
			});

			setStatus(`Success! User ${targetUserId} is now an Admin.`);
			toast.success("User promoted to Admin!");
		} catch (error) {
			console.error(error);
			setStatus(`Error: ${error.message}`);
			toast.error("Failed to promote user");
		} finally {
			setLoading(false);
		}
	};

	// 2. Create New Admin User
	const handleCreateAdmin = async (e) => {
		e.preventDefault();
		if (!email || !password || !name) return toast.error("Fill all fields");

		setLoading(true);
		setStatus("Creating user...");

		try {
			const auth = await getFirebaseAuth();
			const db = await getFirebaseDb();

			// Create Auth User
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;

			// Create Firestore Document with 'admin' type
			await setDoc(doc(db, "users", user.uid), {
				name: name,
				email: email,
				accountType: "admin", // <--- THE KEY PART
				createdAt: serverTimestamp(),
				bio: "System Administrator",
				points: 0,
				username: "admin_" + Math.random().toString(36).substring(7),
				phone: "",
				profilePhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
					name,
				)}&background=335833&color=fff`,
			});

			setStatus(`Success! New Admin created with ID: ${user.uid}`);
			toast.success("New Admin Account Created!");

			// Clear form
			setEmail("");
			setPassword("");
			setName("");
		} catch (error) {
			console.error(error);
			setStatus(`Error: ${error.message}`);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-2 border-red-100">
				<div className="mb-6 text-center">
					<span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
						Internal Tool
					</span>
					<h1 className="text-2xl font-bold text-gray-900 mt-3">Admin Maker</h1>
					<p className="text-gray-500 text-sm mt-1">
						Use this to set up the initial admin account.
					</p>
				</div>

				{/* Tabs */}
				<div className="flex bg-gray-100 p-1 rounded-xl mb-6">
					<button
						onClick={() => setMode("update")}
						className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
							mode === "update"
								? "bg-white shadow-sm text-gray-900"
								: "text-gray-500"
						}`}
					>
						Promote Existing User
					</button>
					<button
						onClick={() => setMode("create")}
						className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
							mode === "create"
								? "bg-white shadow-sm text-gray-900"
								: "text-gray-500"
						}`}
					>
						Create New Admin
					</button>
				</div>

				{/* FORM 1: Promote Existing */}
				{mode === "update" && (
					<form onSubmit={handlePromoteUser} className="space-y-4">
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
								Target User ID (UID)
							</label>
							<input
								type="text"
								value={targetUserId}
								onChange={(e) => setTargetUserId(e.target.value)}
								className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
								placeholder="e.g., 7D8s9f87s9d87f..."
							/>
							<p className="text-xs text-gray-400 mt-1">
								Find this in Firestore Console {">"} Authentication or Database
							</p>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
						>
							{loading ? "Processing..." : "Promote to Admin"}
						</button>
					</form>
				)}

				{/* FORM 2: Create New */}
				{mode === "create" && (
					<form onSubmit={handleCreateAdmin} className="space-y-4">
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
								Full Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
								placeholder="Admin Name"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
								Email Address
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
								placeholder="admin@wildlife.com"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
								placeholder="Strong Password"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
						>
							{loading ? "Creating..." : "Create Admin Account"}
						</button>
					</form>
				)}

				{/* Status Box */}
				{status && (
					<div
						className={`mt-6 p-4 rounded-xl text-sm font-medium ${
							status.includes("Success")
								? "bg-green-50 text-green-700"
								: "bg-gray-100 text-gray-700"
						}`}
					>
						{status}
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateAdminTool;
