import React, { useEffect, useRef } from "react";

const AdContainer = ({
	adSlot,
	adFormat = "auto",
	fullWidthResponsive = true,
}) => {
	const adRef = useRef(null);
	const isAdPushed = useRef(false);

	useEffect(() => {
		if (adRef.current && !isAdPushed.current) {
			try {
				(window.adsbygoogle = window.adsbygoogle || []).push({});
				isAdPushed.current = true;
			} catch (e) {
				console.error("AdSense error:", e);
			}
		}
	}, []);

	return (
		<div className="ad-container my-4 flex justify-center">
			<ins
				className="adsbygoogle"
				style={{ display: "block" }}
				data-ad-client="ca-pub-1626257094896050"
				data-ad-slot={adSlot}
				data-ad-format={adFormat}
				data-full-width-responsive={fullWidthResponsive.toString()}
				ref={adRef}
			/>
		</div>
	);
};

export default AdContainer;
