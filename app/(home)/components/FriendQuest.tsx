import useReviewer from "@/app/hook/useReviewer";
import useUser from "@/app/hook/useUser";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import AddFriendForm from "./AddFriendForm";

import FriendRequest from "./FriendRequest";
import useChallengerQuests from "@/app/hook/useChallengerQuest";
import { getImageUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { sendNotification } from "@/actions/notification";
export default function FriendQuest() {
	const { data: user } = useUser();
	const { data: quests } = useChallengerQuests(
		user?.challenger?.reviewer_id!
	);
	const queryClient = useQueryClient();

	const handlePushNotification = async () => {
		if (user) {
			await sendNotification(
				"just approved your quest",
				user?.challenger?.reviewer_id!,
				user?.image_url!,
				user.display_name!
			);
		}
	};

	const handleApproved = async (id: string) => {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("quest_progress")
			.update({ is_completed: true })
			.eq("id", id);
		if (error) {
			toast.error("Fail to mark this quest completed. " + error.message);
		} else {
			handlePushNotification();
			const updateData = quests?.filter((quest) => quest.id !== id);
			queryClient.setQueryData(["challenger-quests"], () => updateData);
			if (updateData?.length === 0) {
				document.getElementById("challenger-quest")?.click();
				toast.success("Successfully review all quests.");
			}
		}
	};

	return (
		<div className="space-y-5">
			<FriendRequest />

			{quests && quests.length !== 0 && (
				<h1 className="text-xl font-bold">📋 Quests </h1>
			)}
			{quests?.map((quest) => {
				const questImageUrl = getImageUrl(
					`${quest?.user_id}/${quest?.quest_id}/${quest?.image_url}`
				);

				return (
					<div
						key={quest.id}
						className=" bg-zinc-900 rounded-xl divide-y "
					>
						<div className="flex items-center gap-5 0 p-5 rounded-t-xl">
							<span className="text-3xl">
								{quest.quests?.emoji}
							</span>
							<h1 className=" font-semibold">
								{quest.quests?.title}
							</h1>
						</div>
						<div className="py-3">
							<div className="h-96 w-80 mx-auto rounded-2xl  relative">
								<Image
									src={questImageUrl}
									alt="preview"
									fill
									className=" object-cover object-center rounded-2xl"
								/>
							</div>
						</div>
						<Button
							className="w-full bg-green-600  rounded-ee-xl rounded-ss-none text-white"
							variant="outline"
							onClick={() => handleApproved(quest.id)}
						>
							Approve
						</Button>
					</div>
				);
			})}
		</div>
	);
}
