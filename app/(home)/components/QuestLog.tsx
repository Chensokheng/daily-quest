"use client";
import { cn, getCurrentWeekDaysWithNames } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useQuestLog from "@/app/hook/useQuestLog";
import { format } from "date-fns";
import useUser from "@/app/hook/useUser";
import { Skeleton } from "@/components/ui/skeleton";

export type IQuestLog = {
	id?: string;
	user_id?: string;
	log_date: string;
	is_completed: boolean;
	count: number;
	dayName?: string;
};

export default function QuestLog() {
	const { data: user, isFetching: userFetching } = useUser();
	const { data, isFetching } = useQuestLog();
	if (userFetching || isFetching) {
		return (
			<div className="w-full p-5 flex items-center gap-5 justify-evenly">
				{[0, 1, 2, 3, 4, 5, 6].map((value) => {
					return (
						<Skeleton
							className="h-10 w-10 rounded-full bg-gray-400"
							key={value}
						/>
					);
				})}
			</div>
		);
	}
	const logs = getCurrentWeekDaysWithNames(data) as {
		[key: string]: IQuestLog;
	};

	return (
		<div className="flex items-center justify-between p-1 sm:p-5">
			{Object.keys(logs).map((key, index) => {
				const log = logs[key];
				const percentage = log.count !== 0 ? (log.count * 100) / 6 : 0;
				const isToday = format(new Date(), "yyyy-MM-dd") === key;
				const isFailed =
					!isToday &&
					log.is_completed === false &&
					key >
						format(
							user?.created_at
								? new Date(user?.created_at!)
								: new Date(),
							"yyyy-MM-dd"
						) &&
					key < format(new Date(), "yyyy-MM-dd");

				return (
					<div
						key={index}
						className=" relative  rounded-full  w-10 h-10"
					>
						<CircularProgressbar
							styles={buildStyles({
								pathColor: "#22c55e",
							})}
							className="w-10 h-10 absolute top-0 z-30  text-green-500 "
							value={percentage}
						/>
						<div
							className={cn(
								"h-10 w-10 flex items-center justify-center rounded-full font-bold absolute top-0  ",
								log.is_completed
									? "bg-green-500 text-white "
									: "text-zinc-600",
								{
									"bg-gray-300": isToday && !log.is_completed,
								},
								{
									"bg-red-600 text-white": isFailed,
								}
							)}
						>
							{log?.dayName && <p> {log.dayName[0]}</p>}
						</div>
					</div>
				);
			})}
		</div>
	);
}
