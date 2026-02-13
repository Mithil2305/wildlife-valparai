import {
	getTicketsCollection,
	getTicketDoc,
	getUserDoc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	serverTimestamp,
	query,
	where,
	orderBy,
} from "./firebase.js";

export const TICKET_STATUS = {
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
};

/**
 * Submit a creator upgrade request ticket.
 * Prevents duplicate pending tickets.
 */
export const submitUpgradeTicket = async (userId, message = "") => {
	if (!userId) throw new Error("User ID is required");

	// Check for existing pending ticket
	const existing = await getUserTicketStatus(userId);
	if (existing && existing.status === TICKET_STATUS.PENDING) {
		throw new Error("You already have a pending upgrade request");
	}

	// Get user info to store in ticket
	const userRef = await getUserDoc(userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) throw new Error("User not found");

	const userData = userSnap.data();

	const ticketsCol = await getTicketsCollection();
	const ticketData = {
		userId,
		userName: userData.name || "",
		userEmail: userData.email || "",
		username: userData.username || "",
		profilePhotoUrl: userData.profilePhotoUrl || "",
		message: message.slice(0, 1000),
		status: TICKET_STATUS.PENDING,
		createdAt: serverTimestamp(),
		resolvedAt: null,
		resolvedBy: null,
		rejectionReason: null,
	};

	const docRef = await addDoc(ticketsCol, ticketData);
	return docRef.id;
};

/**
 * Get the latest ticket status for a user.
 * Returns the most recent ticket or null.
 */
export const getUserTicketStatus = async (userId) => {
	const ticketsCol = await getTicketsCollection();
	const q = query(ticketsCol, where("userId", "==", userId));
	const snapshot = await getDocs(q);
	if (snapshot.empty) return null;

	// Sort client-side to avoid requiring a composite index
	const tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	tickets.sort(
		(a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
	);
	return tickets[0];
};

/**
 * Admin: Get all pending upgrade tickets.
 */
export const getPendingTickets = async () => {
	const ticketsCol = await getTicketsCollection();
	const q = query(
		ticketsCol,
		where("status", "==", TICKET_STATUS.PENDING),
		orderBy("createdAt", "asc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

/**
 * Admin: Get all tickets (for history view).
 */
export const getAllTickets = async () => {
	const ticketsCol = await getTicketsCollection();
	const q = query(ticketsCol, orderBy("createdAt", "desc"));
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

/**
 * Admin: Approve a creator upgrade ticket.
 * Updates the user's accountType to "creator".
 */
export const approveTicket = async (ticketId, adminId) => {
	if (!ticketId || !adminId) throw new Error("Ticket ID and Admin ID required");

	const ticketRef = await getTicketDoc(ticketId);
	const ticketSnap = await getDoc(ticketRef);
	if (!ticketSnap.exists()) throw new Error("Ticket not found");

	const ticketData = ticketSnap.data();
	if (ticketData.status !== TICKET_STATUS.PENDING) {
		throw new Error("Ticket is no longer pending");
	}

	// Update the user's accountType to "creator"
	const userRef = await getUserDoc(ticketData.userId);
	await updateDoc(userRef, { accountType: "creator" });

	// Update the ticket status
	await updateDoc(ticketRef, {
		status: TICKET_STATUS.APPROVED,
		resolvedAt: serverTimestamp(),
		resolvedBy: adminId,
	});

	return true;
};

/**
 * Admin: Reject a creator upgrade ticket.
 */
export const rejectTicket = async (ticketId, adminId, reason = "") => {
	if (!ticketId || !adminId) throw new Error("Ticket ID and Admin ID required");

	const ticketRef = await getTicketDoc(ticketId);
	const ticketSnap = await getDoc(ticketRef);
	if (!ticketSnap.exists()) throw new Error("Ticket not found");

	const ticketData = ticketSnap.data();
	if (ticketData.status !== TICKET_STATUS.PENDING) {
		throw new Error("Ticket is no longer pending");
	}

	await updateDoc(ticketRef, {
		status: TICKET_STATUS.REJECTED,
		resolvedAt: serverTimestamp(),
		resolvedBy: adminId,
		rejectionReason: reason.slice(0, 500),
	});

	return true;
};
