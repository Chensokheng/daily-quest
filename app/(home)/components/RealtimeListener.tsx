"use client";
import useUser from "@/app/hook/useUser";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function RealtimeListener() {
	const queryClient = useQueryClient();
	const { data: user } = useUser();
	const { width, height } = useWindowSize();
	const [isTada, setTada] = useState(false);

	useEffect(() => {
		const supabase = createSupabaseBrowser();
		supabase
			.channel("reviewer")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "challenger" },
				(payload) => {
					queryClient.invalidateQueries({
						queryKey: ["reviewer"],
					});
					queryClient.invalidateQueries({
						queryKey: ["challenger"],
					});
					if (["UPDATE", "DELETE"].includes(payload.eventType)) {
						queryClient.invalidateQueries({
							queryKey: ["user"],
						});
						queryClient.invalidateQueries({
							queryKey: ["challenger-quests"],
						});
					}
				}
			)
			.subscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const supabase = createSupabaseBrowser();
		supabase
			.channel("reviewer-quests")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "quest_progress",
					filter: "user_id=eq." + user?.challenger?.reviewer_id,
				},
				() => {
					toast.info("Your friend just finished a quest.");

					queryClient.invalidateQueries({
						queryKey: ["challenger-quests"],
					});
				}
			)
			.subscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		const supabase = createSupabaseBrowser();
		supabase
			.channel("quests-update")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "quest_progress",
					filter: "user_id=eq." + user?.id,
				},
				(payload) => {
					if (payload.new.is_completed) {
						setTada(true);
						toast.success("Your Quest have been approved.", {
							duration: 2000,
						});

						queryClient.invalidateQueries({
							queryKey: ["quest-log"],
						});
						queryClient.invalidateQueries({ queryKey: ["quests"] });
					}
				}
			)
			.subscribe();
		if (isTada) {
			setTimeout(() => {
				setTada(false);
			}, 5000);
		}
	}, [user, queryClient, isTada]);

	if (isTada) {
		return (
			<div className=" fixed top-0">
				<Confetti width={width} height={height} />
			</div>
		);
	}
	return <></>;
}
