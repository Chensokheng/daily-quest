import { Button } from "@/components/ui/button";
import React from "react";
import Profile from "./components/Profile";
import Quests from "./components/Quests";
import QuestLog from "./components/QuestLog";

export default function page() {
	return (
		<div className="w-full max-w-2xl mx-auto  h-screen pt-10 pb-20 bg-green-100 space-y-10">
			<Profile />
			<QuestLog />
			<Quests />
		</div>
	);
}
