"use client";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function PullRefresh() {
	const [isPulling, setPulling] = useState(false);

	useEffect(() => {
		let startY = 0;
		const contentContainer = document.getElementById("body");
		if (contentContainer) {
			contentContainer.addEventListener("touchstart", function (e) {
				startY = e.touches[0].clientY;
			});

			contentContainer.addEventListener("touchmove", function (e) {
				const distance = e.touches[0].clientY - startY;

				// Check if the user has pulled down beyond a threshold (e.g., 50 pixels)
				if (distance > 500) {
					handleReload();
					startY = e.touches[0].clientY;
				}
			});
		}
	}, []);
	const handleReload = () => {
		setPulling(true);
		setTimeout(() => {
			location.reload();
		}, 1000);
	};

	return (
		<>
			{isPulling && (
				<span className=" fixed top-0 w-full text-black flex items-center justify-center h-10 bg-[#8fff70]">
					<Loader className=" animate-spin" />
				</span>
			)}
		</>
	);
}
