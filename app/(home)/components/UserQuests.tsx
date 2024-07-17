"use client";
import React from "react";
import NewQuest from "./NewQuest";
import useQuests from "@/app/hook/useQuest";
import useUser from "@/app/hook/useUser";
import { BG_COLOR } from "@/lib/constants";

export default function UserQuests() {
	const { data: user } = useUser();

	const { data } = useQuests(user?.id!);

	return (
		<div className="px-3 space-y-4">
			{data?.map((quest, index) => {
				const bgColor = BG_COLOR[index];
				return <NewQuest quest={quest} key={quest.id} />;
			})}
		</div>
	);
}
