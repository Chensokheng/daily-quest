"use client";

import { cn, getCurrentWeekDaysWithNames } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
export default function QuestLog() {
	const days = getCurrentWeekDaysWithNames();

	const quest_log = [
		{ date: "2024-06-30", is_completed: true, count: 6 },
		{ date: "2024-07-01", is_completed: true, count: 6 },
		{ date: "2024-07-02", is_completed: true, count: 6 },
		{ date: "2024-07-03", is_completed: false, count: 3 },
		{ date: "2024-07-04", is_completed: false, count: 0 },
		{ date: "2024-07-05", is_completed: false, count: 0 },
		{ date: "2024-07-06", is_completed: false, count: 0 },
	];

	return (
		<div className="flex items-center justify-between p-1 sm:p-5">
			{quest_log.map((log, index) => {
				const day = days[log.date];
				const percentage = log.count !== 0 ? (log.count * 100) / 6 : 0;
				return (
					<div key={index} className=" relative  rounded-full">
						<CircularProgressbar
							styles={buildStyles({
								pathColor: "#22c55e",
							})}
							className="w-10 h-10 text-green-500 "
							value={percentage}
						/>
						<div
							className={cn(
								"h-9 w-9 flex items-center justify-center rounded-full font-bold absolute top-[50%] ",
								log.is_completed
									? "bg-green-500 text-white "
									: "text-zinc-600"
							)}
							style={{
								transform: "translate(9%, -50%)",
							}}
						>
							{day[0]}
						</div>
					</div>
				);
			})}
		</div>
	);
}
