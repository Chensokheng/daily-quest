"use client";
import React from "react";
import SignUp from "./signup";
import Social from "./social";
import Image from "next/image";

export default function Register() {
	const queryString =
		typeof window !== "undefined" ? window?.location.search : "";
	const urlParams = new URLSearchParams(queryString);

	// Get the value of the 'next' parameter
	const next = urlParams.get("next");

	return (
		<div className="w-full sm:w-[32rem] sm:p-5   dark:border-zinc-800 rounded-md">
			<div className="p-5 space-y-5">
				<div className="text-center space-y-3">
					<Image
						src={"/line.png"}
						alt="supabase logo"
						width={100}
						height={100}
						className=" rounded-full mx-auto"
					/>

					<p className="text-2xl font-bold">
						Welcome to Daily Quest 🚀
					</p>
				</div>
				<Social redirectTo={next || "/"} />
			</div>
		</div>
	);
}
