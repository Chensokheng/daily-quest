import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export default function Quests() {
	const quests = [
		{
			id: "1",
			title: "Workout for 1 hour",
			emoji: "💪",
			backgroud: "bg-pink-400",
			quest_progress: {
				is_completed: true,
			},
		},
		{
			id: "2",
			title: "Read 10 pages",
			emoji: "📘",
			backgroud: "bg-yellow-400",
			quest_progress: {
				is_completed: false,
			},
		},
		{
			id: "3",
			title: "Eat Healthy",
			emoji: "🥦",
			backgroud: "bg-indigo-400",
			quest_progress: {
				is_completed: true,
			},
		},
	];

	return (
		<div className=" p-5 space-y-7 w-full">
			{quests.map((quest, index) => {
				const isComplted = quest.quest_progress.is_completed;

				return (
					<div
						className={cn(
							" w-full rounded-2xl p-5 border-2 border-white -rotate-[2deg] space-y-5",
							quest.backgroud,
							{ "rotate-2": index % 2 !== 0 }
						)}
						key={index}
					>
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold line-clamp-2">
								{quest.title}
							</h1>
							<span className="text-7xl">{quest.emoji}</span>
						</div>
						<Button
							className={cn("rounded-full", {
								"bg-inherit border-zinc-500": !isComplted,
							})}
							variant={isComplted ? "default" : "outline"}
						>
							{isComplted ? "Completed" : "In progress"}
						</Button>
					</div>
				);
			})}
		</div>
	);
}
