import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";
import Challenger from "./Challenger";
export default function Header() {
	return (
		<div className="px-3  flex items-center justify-between">
			<Challenger />
			<Bell />
		</div>
	);
}
