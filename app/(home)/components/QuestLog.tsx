"use client";
import { cn, getCurrentWeekDaysWithNames } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useQuestLog from "@/app/hook/useQuestLog";

export type IQuestLog = {
	user_id?: string;
	log_date: string;
	is_completed: boolean;
	count: number;
	dayName?: string;
};

export default function QuestLog() {
	const { data, isFetching } = useQuestLog();
	if (isFetching) {
		return <h1>Loading</h1>;
	}
	const logs = getCurrentWeekDaysWithNames(data) as {
		[key: string]: IQuestLog;
	};

	return (
		<div className="flex items-center justify-between p-1 sm:p-5">
			{Object.keys(logs).map((key, index) => {
				const log = logs[key];
				const percentage = log.count !== 0 ? (log.count * 100) / 6 : 0;
				return (
					<div
						key={index}
						className=" relative  rounded-full  w-10 h-10"
					>
						<CircularProgressbar
							styles={buildStyles({
								pathColor: "#22c55e",
							})}
							className="w-10 h-10 text-green-500 "
							value={percentage}
						/>
						<div
							className={cn(
								"h-10 w-10 flex items-center justify-center rounded-full font-bold absolute top-0   ",
								log.is_completed
									? "bg-green-500 text-white "
									: "text-zinc-600"
							)}
						>
							{log?.dayName ? log.dayName[0] : ""}
						</div>
					</div>
				);
			})}
		</div>
	);
}
