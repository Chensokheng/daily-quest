"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, endOfWeek } from "date-fns";

export default function useQuestLog() {
	return useQuery({
		queryKey: ["quest-log"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let { data } = await supabase
				.from("quest_log")
				.select("*")
				.lte("log_date", endOfWeek(new Date()).toISOString())
				.gte("log_date", startOfWeek(new Date()).toISOString());
			return data;
		},
	});
}
