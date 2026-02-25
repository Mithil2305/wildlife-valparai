import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAuthInstance } from "../services/firebase.js";
import {
	subscribeNotifications,
	markNotificationRead,
	markAllNotificationsRead,
	logAnalyticsEvent,
} from "../services/followApi.js";
import { FaBell, FaCheck, FaCheckDouble, FaTimes } from "react-icons/fa";

const NotificationBell = () => {
	const [notifications, setNotifications] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const auth = getAuthInstance();
	const currentUser = auth?.currentUser;

	const unreadCount = notifications.filter((n) => !n.read).length;

	// Subscribe to real-time notifications
	useEffect(() => {
		let unsub = () => {};
		const setup = async () => {
			if (!currentUser) return;
			try {
				unsub = await subscribeNotifications(currentUser.uid, (notifs) => {
					setNotifications(notifs);
				});
			} catch (err) {
				console.error("Notification subscription error:", err);
			}
		};
		setup();
		return () => unsub();
	}, [currentUser]);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClick = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		if (isOpen) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen]);

	const handleMarkRead = async (notifId) => {
		try {
			await markNotificationRead(currentUser.uid, notifId);
			logAnalyticsEvent("notification_clicked", { notifId });
		} catch (err) {
			console.error("Mark read error:", err);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await markAllNotificationsRead(currentUser.uid);
		} catch (err) {
			console.error("Mark all read error:", err);
		}
	};

	if (!currentUser) return null;

	const formatTime = (ts) => {
		if (!ts) return "";
		const date = ts.toDate ? ts.toDate() : new Date(ts);
		const now = new Date();
		const diff = (now - date) / 1000;

		if (diff < 60) return "Just now";
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Bell button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
				aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
			>
				<FaBell size={18} />
				{unreadCount > 0 && (
					<span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{/* Dropdown panel */}
			{isOpen && (
				<>
					{/* Mobile overlay */}
					<div
						className="fixed inset-0 z-40 md:hidden bg-black/20"
						onClick={() => setIsOpen(false)}
					/>

					<div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
						{/* Header */}
						<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
							<h3 className="font-black text-gray-900 text-sm">
								Notifications
							</h3>
							<div className="flex items-center gap-2">
								{unreadCount > 0 && (
									<button
										onClick={handleMarkAllRead}
										className="text-xs text-[#335833] font-bold hover:underline flex items-center gap-1"
									>
										<FaCheckDouble size={10} />
										Mark all read
									</button>
								)}
								<button
									onClick={() => setIsOpen(false)}
									className="p-1 text-gray-400 hover:text-gray-700 md:hidden"
								>
									<FaTimes size={14} />
								</button>
							</div>
						</div>

						{/* Notification list */}
						<div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
							{notifications.length === 0 ? (
								<div className="py-12 text-center">
									<FaBell className="mx-auto text-gray-300 text-3xl mb-3" />
									<p className="text-gray-400 text-sm font-medium">
										No notifications yet
									</p>
									<p className="text-gray-300 text-xs mt-1">
										Follow creators to get updates
									</p>
								</div>
							) : (
								notifications.map((notif) => {
									const Wrapper = notif.deepLink ? Link : "div";
									const wrapperProps = notif.deepLink
										? {
												to: notif.deepLink,
												onClick: () => {
													handleMarkRead(notif.id);
													setIsOpen(false);
												},
											}
										: {
												onClick: () => handleMarkRead(notif.id),
											};

									return (
										<Wrapper
											key={notif.id}
											{...wrapperProps}
											className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
												!notif.read ? "bg-green-50/40" : ""
											}`}
										>
											{/* Dot indicator */}
											<div className="mt-1.5 shrink-0">
												{!notif.read ? (
													<div className="w-2.5 h-2.5 rounded-full bg-[#335833]" />
												) : (
													<div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
												)}
											</div>

											{/* Content */}
											<div className="flex-1 min-w-0">
												<p
													className={`text-sm leading-snug ${!notif.read ? "font-semibold text-gray-900" : "text-gray-600"}`}
												>
													{notif.title}
												</p>
												{notif.body && (
													<p className="text-xs text-gray-400 mt-0.5 truncate">
														{notif.body}
													</p>
												)}
												<p className="text-[10px] text-gray-300 mt-1">
													{formatTime(notif.createdAt)}
												</p>
											</div>
										</Wrapper>
									);
								})
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default NotificationBell;
