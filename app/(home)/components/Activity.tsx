"use client";
import useQuestLog from "@/app/hook/useQuestLog";
import useUser from "@/app/hook/useUser";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Activity() {
	const { data } = useQuestLog();

	let percentage = ((data?.count || 0) * 100) / (data?.quest_counts || 1);

	return (
		<div className="px-3 space-y-3">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-xl">Activity</h1>
				<Button className="" variant="ghost">
					View History
				</Button>
			</div>
			<div className="  bg-zinc-900 rounded-lg p-5 space-y-5 ">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h1 className="text-gray-400 text-sm">
							Today Progresss
						</h1>
						<h1 className="text-sm text-green-500 font-semibold">
							{percentage.toFixed(0)}%
						</h1>
					</div>
					<div className="bg-zinc-500 w-full h-5 rounded-xl relative ">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${percentage}%` }}
							transition={{ duration: 0.2 }}
							className="absolute  h-5 bg-green-500 rounded-full transition-all"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
