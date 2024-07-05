"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useQuestLog() {
	return useQuery({
		queryKey: ["quest-log"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let { data, error } = await supabase.rpc("get_current_week_data");
			return data;
		},
	});
}
