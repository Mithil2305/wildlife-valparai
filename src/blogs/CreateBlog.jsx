import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, userDoc, getDoc } from "../services/firebase.js";
import { createBlogPost } from "../services/uploadPost.js";
import toast from "react-hot-toast";
import {
	BiUndo,
	BiRedo,
	BiBold,
	BiItalic,
	BiUnderline,
	BiStrikethrough,
	BiLink,
	BiImage,
	BiVideo,
	BiAlignLeft,
	BiAlignMiddle,
	BiAlignRight,
	BiAlignJustify,
	BiListUl,
	BiListOl,
} from "react-icons/bi";
import { MdFormatQuote, MdFormatClear } from "react-icons/md";
import { AiOutlineEye, AiOutlineSend } from "react-icons/ai";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { FiFolder } from "react-icons/fi";

// --- Toolbar Component ---
const ToolbarButton = ({ onClick, icon: Icon, title, active = false }) => (
	<button
		type="button"
		onMouseDown={(e) => {
			e.preventDefault(); // Prevent focus loss from editor
			onClick(e);
		}}
		title={title}
		className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-base w-8 h-8 flex items-center justify-center ${
			active ? "bg-gray-300 font-bold shadow-inner" : ""
		}`}
	>
		<Icon size={18} />
	</button>
);

const Divider = () => (
	<div className="w-px h-5 bg-gray-300 mx-1 self-center opacity-50" />
);

// --- Sidebar Section Component ---
const SidebarSection = ({ title, children, isOpen, onToggle }) => {
	return (
		<div className="border-b border-gray-200 last:border-0">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex justify-between items-center py-3 px-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
			>
				<span>{title}</span>
				{isOpen ? (
					<IoChevronUp className="text-gray-400" size={14} />
				) : (
					<IoChevronDown className="text-gray-400" size={14} />
				)}
			</button>
			{isOpen && (
				<div className="pb-4 px-2 text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
					{children}
				</div>
			)}
		</div>
	);
};

const CreateBlog = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState(""); // Stores HTML string
	const [labels, setLabels] = useState("");
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [lastSaved, setLastSaved] = useState(null); // For Draft Status
	const [activeSection, setActiveSection] = useState("Labels");
	const navigate = useNavigate();
	const editorRef = useRef(null);

	// --- 1. User Auth ---
	useEffect(() => {
		// Using auth directly from services/firebase.js
		const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
			if (currentUser) {
				const userRef = userDoc(currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUser(userSnap.data());
				}
			} else {
				navigate("/login");
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	// --- 2. Draft System (Auto-Save & Load) ---
	// Load Draft on Mount
	useEffect(() => {
		const savedDraft = localStorage.getItem("blogDraft");
		if (savedDraft) {
			try {
				const { title: savedTitle, content: savedContent } =
					JSON.parse(savedDraft);
				if (savedTitle) setTitle(savedTitle);
				if (savedContent) {
					setContent(savedContent);
					if (editorRef.current) {
						editorRef.current.innerHTML = savedContent;
					}
				}
				if (savedTitle || savedContent) {
					toast("Draft restored", { icon: <FiFolder /> });
				}
			} catch (e) {
				console.error("Error parsing draft", e);
			}
		}
	}, []);

	// Save Draft on Change (Debounced)
	useEffect(() => {
		const saveTimer = setTimeout(() => {
			if (title || content) {
				localStorage.setItem("blogDraft", JSON.stringify({ title, content }));
				setLastSaved(new Date());
			}
		}, 1000); // Save after 1 second of inactivity

		return () => clearTimeout(saveTimer);
	}, [title, content]);

	// --- 3. Editor Commands ---
	const formatDoc = (cmd, value = null) => {
		document.execCommand(cmd, false, value);
		editorRef.current?.focus();
	};

	const handleLink = () => {
		const url = prompt("Enter the URL:");
		if (url) {
			formatDoc("createLink", url);
		}
	};

	const handleImage = () => {
		const url = prompt(
			"Enter Image URL (e.g., https://example.com/image.png):"
		);
		if (url) formatDoc("insertImage", url);
	};

	// Handle content changes
	const handleInput = () => {
		if (editorRef.current) {
			const html = editorRef.current.innerHTML;
			setContent(html);
		}
	};

	// --- 4. Submit Handler ---
	const handleSubmit = async () => {
		if (!title || !content || !user) {
			toast.error("Please add a title and some content.");
			return;
		}

		setLoading(true);

		// We pass the HTML content directly.
		// Note: In production, you should sanitize this HTML before displaying it
		// to prevent XSS, although React usually escapes content unless dangerouslySetInnerHTML is used.
		const blogPromise = createBlogPost({
			creatorId: auth.currentUser.uid,
			creatorUsername: user.username,
			creatorProfilePhoto: user.profilePhotoUrl || "",
			title,
			blogContent: content,
		});

		toast.promise(blogPromise, {
			loading: "Publishing post...",
			success: () => {
				setLoading(false);
				localStorage.removeItem("blogDraft"); // Clear draft on success
				navigate("/dashboard/creator");
				return <b>Published successfully!</b>;
			},
			error: (err) => {
				setLoading(false);
				return <b>Error: {err.message}</b>;
			},
		});
	};

	const toggleSection = (section) => {
		setActiveSection(activeSection === section ? null : section);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
			{/* --- Header --- */}
			<header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center shrink-0 z-20">
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="Post Title"
						className="w-5xl text-3xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 focus:outline-none bg-transparent mb-4"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					{lastSaved && (
						<span className="text-xs text-gray-400 transition-opacity duration-500">
							Draft Saved at{" "}
							{lastSaved.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					)}
				</div>
				<div className="flex items-center space-x-3">
					<button
						type="button"
						className="flex items-center gap-2 px-3 py-1.5 text-gray-600 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-all text-sm font-medium"
						onClick={() => toast("Preview feature coming soon!")}
					>
						<AiOutlineEye size={18} />
						Preview
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="flex items-center gap-2 px-4 py-1.5 bg-[#335833] text-white rounded hover:bg-opacity-90 transition-all text-sm font-bold shadow-sm disabled:opacity-50"
					>
						{loading ? "Publishing..." : "Publish"}
						{!loading && <AiOutlineSend size={16} />}
					</button>
				</div>
			</header>

			{/* --- Workspace (Editor + Sidebar) --- */}
			<div className="flex flex-grow overflow-hidden">
				{/* --- Main Editor Column --- */}
				<main className="flex-grow flex flex-col bg-white shadow-sm m-4 rounded-lg border border-gray-200 overflow-hidden relative">
					{/* Toolbar (Fixed at Top) */}
					<div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center gap-1 shrink-0 overflow-x-auto select-none">
						<ToolbarButton
							onClick={() => formatDoc("undo")}
							icon={BiUndo}
							title="Undo"
						/>
						<ToolbarButton
							onClick={() => formatDoc("redo")}
							icon={BiRedo}
							title="Redo"
						/>
						<Divider />
						<ToolbarButton
							onClick={() => formatDoc("bold")}
							icon={BiBold}
							title="Bold"
						/>
						<ToolbarButton
							onClick={() => formatDoc("italic")}
							icon={BiItalic}
							title="Italic"
						/>
						<ToolbarButton
							onClick={() => formatDoc("underline")}
							icon={BiUnderline}
							title="Underline"
						/>
						<ToolbarButton
							onClick={() => formatDoc("strikeThrough")}
							icon={BiStrikethrough}
							title="Strikethrough"
						/>
						<Divider />
						<ToolbarButton
							onClick={handleLink}
							icon={BiLink}
							title="Insert Link"
						/>
						<ToolbarButton
							onClick={handleImage}
							icon={BiImage}
							title="Insert Image"
						/>
						<ToolbarButton
							onClick={() => toast("Video upload coming soon")}
							icon={BiVideo}
							title="Insert Video"
						/>
						<Divider />
						<ToolbarButton
							onClick={() => formatDoc("justifyLeft")}
							icon={BiAlignLeft}
							title="Align Left"
						/>
						<ToolbarButton
							onClick={() => formatDoc("justifyCenter")}
							icon={BiAlignMiddle}
							title="Align Center"
						/>
						<ToolbarButton
							onClick={() => formatDoc("justifyRight")}
							icon={BiAlignRight}
							title="Align Right"
						/>
						<ToolbarButton
							onClick={() => formatDoc("justifyFull")}
							icon={BiAlignJustify}
							title="Justify"
						/>
						<Divider />
						<ToolbarButton
							onClick={() => formatDoc("insertUnorderedList")}
							icon={BiListUl}
							title="Bulleted List"
						/>
						<ToolbarButton
							onClick={() => formatDoc("insertOrderedList")}
							icon={BiListOl}
							title="Numbered List"
						/>
						<ToolbarButton
							onClick={() => formatDoc("formatBlock", "blockquote")}
							icon={MdFormatQuote}
							title="Quote"
						/>
						<Divider />
						<ToolbarButton
							onClick={() => formatDoc("removeFormat")}
							icon={MdFormatClear}
							title="Clear Formatting"
						/>
					</div>

					{/* Scrollable Edit Area */}
					<div className="grow overflow-y-auto">
						<div className="max-w-4xl mx-auto px-8 py-8 min-h-full">
							{/* Content Editor */}
							<div
								ref={editorRef}
								className="w-full outline-none text-lg text-gray-800 prose max-w-none pb-20 min-h-[300px]"
								contentEditable={true}
								onInput={handleInput}
								data-placeholder="Compose your story..."
								placeholder="Compose your story..."
								autoFocus={true}
								autoselect={true}
								style={{ whiteSpace: "pre-wrap" }}
							/>
						</div>
					</div>
				</main>

				{/* --- Right Sidebar --- */}
				<aside className="w-80 bg-white border-l border-gray-200 shrink-0 overflow-y-auto hidden md:block">
					<div className="p-4">
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
							Post Settings
						</h3>

						<SidebarSection
							title="Labels"
							isOpen={activeSection === "Labels"}
							onToggle={() => toggleSection("Labels")}
						>
							<input
								type="text"
								value={labels}
								onChange={(e) => setLabels(e.target.value)}
								placeholder="Separate labels with commas"
								className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#335833] focus:ring-1 focus:ring-[#335833] outline-none"
							/>
							<p className="text-xs text-gray-400 mt-1.5">
								e.g., Wildlife, Valparai, Elephants
							</p>
						</SidebarSection>

						<SidebarSection
							title="Published on"
							isOpen={activeSection === "Published"}
							onToggle={() => toggleSection("Published")}
						>
							<div className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
								<p className="mb-1 font-medium">Automatic</p>
								<p className="text-xs text-gray-500">
									{new Date().toLocaleString()}
								</p>
							</div>
						</SidebarSection>

						<SidebarSection
							title="Permalink"
							isOpen={activeSection === "Permalink"}
							onToggle={() => toggleSection("Permalink")}
						>
							<div className="text-gray-500 italic text-xs">
								Permalink will be generated automatically from the post title.
							</div>
						</SidebarSection>

						<SidebarSection
							title="Location"
							isOpen={activeSection === "Location"}
							onToggle={() => toggleSection("Location")}
						>
							<input
								type="text"
								placeholder="Search location"
								className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#335833] focus:ring-1 focus:ring-[#335833] outline-none"
							/>
						</SidebarSection>

						<SidebarSection
							title="Options"
							isOpen={activeSection === "Options"}
							onToggle={() => toggleSection("Options")}
						>
							<div className="space-y-2">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="comments"
										defaultChecked
										className="text-[#335833] focus:ring-[#335833]"
									/>
									<span>Allow comments</span>
								</label>
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="comments"
										className="text-[#335833] focus:ring-[#335833]"
									/>
									<span>Do not allow comments</span>
								</label>
							</div>
						</SidebarSection>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default CreateBlog;
