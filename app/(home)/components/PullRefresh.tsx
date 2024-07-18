"use client";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function PullRefresh() {
	const [isPulling, setPulling] = useState(false);

	useEffect(() => {
		let startY = 0;
		let isAtTop = false;
		const contentContainer = document.getElementById("body");
		if (contentContainer) {
			contentContainer.addEventListener("touchstart", function (e) {
				startY = e.touches[0].clientY;
			});
			window.addEventListener("scroll", function () {
				// Check if the scrollbar is at the top of the content
				isAtTop = window.scrollY === 0;
				console.log(isAtTop);
			});

			contentContainer.addEventListener("touchmove", function (e) {
				const distance = e.touches[0].clientY - startY;

				// Check if the user has pulled down beyond a threshold (e.g., 50 pixels)
				if (distance > 500) {
					handleReload();
					startY = e.touches[0].clientY;
				} else {
					// Handle normal scrolling
					console.log("Normal scroll");
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
