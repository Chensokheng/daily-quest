"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useQuests() {
	return useQuery({
		queryKey: ["quests"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const { data } = await supabase
				.from("quests")
				.select("*,quest_progress(*)");
			return data;
		},
	});
}
