"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import UserProfile from "@/components/supaauth/user-profile";
import useUser from "@/app/hook/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Profile() {
	const { data } = useUser();
	const queryClient = useQueryClient();
	useEffect(() => {
		const supabase = createSupabaseBrowser();
		const channel = supabase
			.channel("quests-update")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "quest_progress",
					filter: "user_id=eq." + data?.id,
				},
				() => {
					toast.info("Your Quest have been approved.", {
						duration: 2000,
					});
					queryClient.invalidateQueries({ queryKey: ["quest-log"] });
					queryClient.invalidateQueries({ queryKey: ["quests"] });
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<div className="flex items-center justify-center flex-col gap-3">
			<Image src={"/line.png"} alt="line" width={100} height={100} />
			<div className="flex items-center justify-center">
				<UserProfile />
			</div>

			<h1 className="text-3xl font-bold">Hi, {data?.display_name}</h1>
			<p className="text-zinc-600 font-medium">
				{data?.strike?.count} Days in a row
			</p>
		</div>
	);
}
