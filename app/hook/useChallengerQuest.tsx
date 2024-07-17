"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useChallengerQuests(reviewer_id: string) {
	return useQuery({
		queryKey: ["challenger-quests"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let currentDate = new Date();

			currentDate.setHours(0, 0, 0, 0);

			const { data, error } = await supabase
				.from("quest_progress")
				.select("*,quests(*),profiles(display_name)")
				.gte("created_at", currentDate.toISOString())
				.eq("user_id", reviewer_id)
				.eq("is_completed", false);
			return data;
		},
		enabled: !!reviewer_id,
	});
}
