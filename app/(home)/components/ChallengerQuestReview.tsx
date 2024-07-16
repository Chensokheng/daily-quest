"use client";
import useChallengerQuests from "@/app/hook/useChallengerQuest";
import useUser from "@/app/hook/useUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/utils";
import { BG_COLOR } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ChallengerQuestReview() {
	const { data: user } = useUser();
	const queryClient = useQueryClient();

	const { data } = useChallengerQuests(user?.challenger?.reviewer_id || "");

	useEffect(() => {
		const supabase = createSupabaseBrowser();
		const channel = supabase
			.channel("reviewer-quests")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "quest_progress",
					filter: "user_id=eq." + user?.challenger?.reviewer_id,
				},
				(payload) => {
					toast.info("Your challenger just finished a quest.");
					queryClient.invalidateQueries({
						queryKey: ["challenger-quests"],
					});
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const handleMarkComplete = async (id: string) => {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("quest_progress")
			.update({ is_completed: true })
			.eq("id", id);
		if (error) {
			toast.error("Fail to mark this quest completed. " + error.message);
		} else {
			const updateData = data?.filter((quest) => quest.id !== id);
			queryClient.setQueryData(["challenger-quests"], () => updateData);
			if (updateData?.length === 0) {
				document.getElementById("challenger-quest")?.click();
				toast.success("Successfully review all quests.");
			}
		}
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild id="challenger-quest">
					<Button
						className="flex items-center gap-2 rounded-full"
						disabled={data?.length === 0}
					>
						Review
						<Badge variant="destructive">{data?.length}+</Badge>
					</Button>
				</DialogTrigger>
				<DialogContent className="h-screen w-full bg-green-100 ">
					<ScrollArea className="h-screen w-full">
						<div className="p-2 space-y-5">
							<Button
								variant={"outline"}
								className=" rounded-full"
								onClick={() => {
									document
										.getElementById("challenger-quest")
										?.click();
								}}
							>
								Back
							</Button>
							<div className="space-y-5">
								{data?.map((quest, index) => {
									const imageUrl = getImageUrl(
										`${quest?.user_id}/${quest?.quest_id}/${quest?.image_url}`
									);
									const bgColor = BG_COLOR[index];

									return (
										<div
											key={quest.id}
											className={
												" border border-black py-5 rounded-md  space-y-3 " +
												bgColor
											}
										>
											<h1 className="text-center text-2xl font-semibold">
												{quest.quests?.emoji}{" "}
												{quest.quests?.title}
											</h1>
											<div className="h-96 w-80 mx-auto rounded-2xl  relative border border-black">
												<Image
													src={imageUrl}
													alt="preview"
													fill
													className=" object-cover object-center rounded-2xl"
												/>
											</div>
											<div
												className="w-full flex items-center justify-center"
												onClick={() =>
													handleMarkComplete(quest.id)
												}
											>
												<Button className="w-80 mx-auto rounded-full">
													Mark Complete ✅
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
}
