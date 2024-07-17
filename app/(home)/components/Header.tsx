import React from "react";
import UserProfile from "@/components/supaauth/user-profile";
import { format } from "date-fns";
export default function Header() {
	return (
		<div className="px-3 flex items-center justify-between w-full">
			<div>
				<h1 className="text-gray-400">
					{format(new Date(), "EEEE, MMMM d")}{" "}
				</h1>
				<h1 className="text-3xl font-bold text-white">Summary</h1>
			</div>
			<div>
				<UserProfile />
			</div>
		</div>
	);
}
