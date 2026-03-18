import React, { useCallback, useEffect, useState } from "react";
import { BookOpen, X, MousePointerClick } from "lucide-react";

const TutorialCoach = ({
	active,
	stepIndex,
	totalSteps,
	step,
	onStepClick,
	onSkip,
}) => {
	const [targetRect, setTargetRect] = useState(null);

	const findVisibleTarget = useCallback(() => {
		if (!step?.selector) return null;
		const candidates = Array.from(document.querySelectorAll(step.selector));
		return (
			candidates.find((el) => {
				const rect = el.getBoundingClientRect();
				const style = window.getComputedStyle(el);
				return (
					rect.width > 0 &&
					rect.height > 0 &&
					style.visibility !== "hidden" &&
					style.display !== "none"
				);
			}) || null
		);
	}, [step?.selector]);

	useEffect(() => {
		if (!active) return;

		const updateTarget = () => {
			const target = findVisibleTarget();
			if (!target) {
				setTargetRect(null);
				return;
			}
			setTargetRect(target.getBoundingClientRect());
		};

		const onDocumentClick = (event) => {
			const target = findVisibleTarget();
			if (!target) return;
			if (event.target.closest(step.selector)) {
				setTimeout(() => {
					onStepClick?.();
				}, 0);
			}
		};

		updateTarget();
		window.addEventListener("resize", updateTarget);
		window.addEventListener("scroll", updateTarget, true);
		document.addEventListener("click", onDocumentClick, true);

		return () => {
			window.removeEventListener("resize", updateTarget);
			window.removeEventListener("scroll", updateTarget, true);
			document.removeEventListener("click", onDocumentClick, true);
		};
	}, [active, step, onStepClick, findVisibleTarget]);

	if (!active || !step) return null;

	const bubblePosition = (() => {
		if (!targetRect) return null;
		const gap = 14;
		const width = 320;
		const height = 170;
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		const canPlaceRight = targetRect.right + gap + width < vw - 12;
		const canPlaceLeft = targetRect.left - gap - width > 12;
		const placeRight = canPlaceRight || !canPlaceLeft;

		let left = placeRight
			? targetRect.right + gap
			: targetRect.left - width - gap;
		let top = targetRect.top + targetRect.height / 2 - height / 2;

		top = Math.max(12, Math.min(top, vh - height - 12));
		left = Math.max(12, Math.min(left, vw - width - 12));

		return {
			left,
			top,
			arrow: placeRight ? "left" : "right",
		};
	})();

	const isLast = stepIndex === totalSteps - 1;

	return (
		<div className="fixed inset-0 z-70 pointer-events-none">
			{targetRect && (
				<div
					className="absolute rounded-xl border-2 border-[#7EE081] shadow-[0_0_0_9999px_rgba(2,8,23,0.58)]"
					style={{
						left: targetRect.left - 6,
						top: targetRect.top - 6,
						width: targetRect.width + 12,
						height: targetRect.height + 12,
					}}
				/>
			)}

			{bubblePosition && (
				<div
					className="absolute w-[320px] pointer-events-auto"
					style={{ left: bubblePosition.left, top: bubblePosition.top }}
				>
					<div className="relative bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
						<div className="px-4 py-3 bg-[#335833] text-white flex items-center justify-between">
							<div className="flex items-center gap-2">
								<BookOpen size={16} />
								<p className="text-sm font-bold">
									Step {stepIndex + 1} of {totalSteps}
								</p>
							</div>
							<button
								onClick={onSkip}
								className="p-1 rounded-md hover:bg-white/15 transition-colors"
								title="Close tutorial"
								aria-label="Close tutorial"
							>
								<X size={16} />
							</button>
						</div>

						<div className="p-4">
							<h3 className="text-base font-bold text-gray-900">
								{step.title}
							</h3>
							<p className="text-sm text-gray-600 mt-1 leading-relaxed">
								{step.description}
							</p>

							<div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100 flex items-start gap-2">
								<MousePointerClick
									size={16}
									className="text-[#335833] mt-0.5"
								/>
								<p className="text-xs text-[#335833] font-semibold leading-relaxed">
									Click the highlighted icon/text to continue.
									{isLast ? " This will finish the tutorial." : ""}
								</p>
							</div>

							<button
								onClick={onSkip}
								className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-700"
							>
								Skip Tutorial
							</button>
						</div>

						<div
							className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-gray-200 rotate-45 ${
								bubblePosition.arrow === "left"
									? "-left-1.5 border-l border-b"
									: "-right-1.5 border-r border-t"
							}`}
						/>
					</div>
				</div>
			)}

			{!targetRect && (
				<div className="absolute inset-0 bg-black/60 pointer-events-auto flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm w-full">
						<p className="font-bold text-gray-900">
							Tutorial target not visible
						</p>
						<p className="text-sm text-gray-600 mt-2">
							The highlighted control is not visible in this view. Resize screen
							or open the menu, or skip tutorial.
						</p>
						<button
							onClick={onSkip}
							className="mt-4 px-4 py-2 rounded-lg bg-[#335833] text-white font-semibold text-sm"
						>
							Close Tutorial
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TutorialCoach;
