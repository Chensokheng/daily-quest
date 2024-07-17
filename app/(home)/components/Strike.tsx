"use client";
import useUser from "@/app/hook/useUser";
import React from "react";

export default function Strike() {
	const { data: user } = useUser();

	return (
		<div>
			<h1 className="text-sm text-gray-400">Strike</h1>
			<h1 className="text-xl font-bold">
				{user?.strike?.count} days in a row
			</h1>
		</div>
	);
}
