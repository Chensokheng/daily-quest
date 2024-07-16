"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useQuests(user_id: string) {
	return useQuery({
		queryKey: ["quests"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let currentDate = new Date();

			currentDate.setHours(0, 0, 0, 0);

			const { data } = await supabase
				.from("quests")
				.select("*,quest_progress(*)")
				.gte("quest_progress.created_at", currentDate.toISOString())
				.eq("quest_progress.user_id", user_id);
			return data;
		},
		enabled: !!user_id,
	});
}
