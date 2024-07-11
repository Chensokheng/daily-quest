"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useQuests() {
	return useQuery({
		queryKey: ["quests"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let currentDate = new Date();

			currentDate.setHours(0, 0, 0, 0);

			console.log(currentDate.toISOString());

			const { data } = await supabase
				.from("quests")
				.select("*,quest_progress(*)")
				.gte("quest_progress.created_at", currentDate.toISOString());
			return data;
		},
	});
}
