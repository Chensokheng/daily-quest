import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";
import Challenger from "./Challenger";
import ChallengerQuestReview from "./ChallengerQuestReview";
export default function Header() {
	return (
		<div className="px-3  flex items-center justify-between">
			<Challenger />
			<ChallengerQuestReview />
		</div>
	);
}
