"use client";
import useQuests from "@/app/hook/useQuest";
import { Button } from "@/components/ui/button";
import { BG_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import React from "react";

export default function Quests() {
	const { data, isFetching } = useQuests();

	return (
		<div className=" p-5 space-y-7 w-full">
			{data?.map((quest, index) => {
				const isComplted = quest?.quest_progress?.is_completed;
				const bgColor = BG_COLOR[index];
				return (
					<div
						className={cn(
							" w-full rounded-2xl p-5 border-2 border-black -rotate-[2deg] space-y-5",
							bgColor,
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
								"  border-zinc-500": !isComplted,
							})}
							// variant={isComplted ? "default" : "default"}
						>
							{isComplted ? "Completed" : "In progress"}
						</Button>
					</div>
				);
			})}
		</div>
	);
}
