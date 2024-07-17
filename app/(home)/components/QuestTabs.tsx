"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import NewQuest from "./NewQuest";
import UserQuests from "./UserQuests";
import FriendQuest from "./FriendQuest";
export default function QuestTabs() {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className=" space-y-5">
			<div className=" px-3 flex">
				<div className="space-y-2">
					<div className="flex gap-5">
						<h1
							className={cn(
								" font-semibold text-xl text-gray-400 transition-all cursor-pointer",
								activeTab === 0
									? "text-green-500"
									: "hover:text-white"
							)}
							onClick={() => {
								setActiveTab(0);
							}}
						>
							Your Quests
						</h1>

						<h1
							onClick={() => {
								setActiveTab(1);
							}}
							className={cn(
								" font-semibold text-xl text-gray-400  transition-all cursor-pointer",
								activeTab === 1
									? "text-green-500"
									: "hover:text-white"
							)}
						>
							Friend Quests
						</h1>
					</div>
					<div className="w-full h-1 bg-gray-500 relative">
						<div
							className={cn(
								" absolute w-[50%] bg-green-500 h-1 transition-all",
								{
									"translate-x-full": activeTab === 1,
								}
							)}
						></div>
					</div>
				</div>
			</div>
			{activeTab === 0 && <UserQuests />}
			{activeTab === 1 && (
				<div className="px-3">
					<FriendQuest />
				</div>
			)}
		</div>
	);
}
