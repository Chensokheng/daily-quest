"use client";
import React from "react";
import Image from "next/image";
import UserProfile from "@/components/supaauth/user-profile";
import useUser from "@/app/hook/useUser";

export default function Profile() {
	const { data } = useUser();

	return (
		<div className="flex items-center justify-center flex-col gap-3">
			<Image src={"/line.png"} alt="line" width={100} height={100} />
			<div className="flex items-center justify-center">
				<UserProfile />
			</div>

			<h1 className="text-3xl font-bold">Hi, {data?.display_name}</h1>
			<p className="text-zinc-600 font-medium">
				{data?.strike?.count} Days in a row
			</p>
		</div>
	);
}
