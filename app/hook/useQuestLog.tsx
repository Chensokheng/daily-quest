"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, endOfWeek } from "date-fns";

export default function useQuestLog() {
	return useQuery({
		queryKey: ["quest-log"],
		queryFn: async () => {
			let currentDate = new Date();

			currentDate.setHours(0, 0, 0, 0);
			const supabase = createSupabaseBrowser();
			let { data } = await supabase
				.from("quest_log")
				.select("*")
				.gte("log_date", currentDate.toISOString())
				.single();
			return data;
		},
	});
}
