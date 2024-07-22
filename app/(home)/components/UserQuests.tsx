"use client";
import React, { useEffect } from "react";
import NewQuest from "./NewQuest";
import useQuests from "@/app/hook/useQuest";
import useUser from "@/app/hook/useUser";
import { BG_COLOR } from "@/lib/constants";
import AddCustomQuest from "./AddNewCustomQuest";

export default function UserQuests() {
	const { data: user } = useUser();

	const { data } = useQuests(user?.id!);

	return (
		<div className="px-3 space-y-5 divide-y">
			<div className="space-y-4">
				{data?.map((quest) => {
					return <NewQuest quest={{ ...quest }} key={quest.id} />;
				})}
			</div>
			<div className="pt-5">
				<AddCustomQuest />
			</div>
		</div>
	);
}
