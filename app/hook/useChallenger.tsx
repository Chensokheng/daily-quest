"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
export default function useChallenger(userId: string) {
	return useQuery({
		queryKey: ["challenger"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let { data, error } = await supabase
				.from("challenger")
				.select(
					"*,profiles!challenger_user_id_fkey(display_name,image_url)"
				)
				.eq("reviewer_id", userId)
				.eq("is_accepted", false)
				.single();
			return data;
		},
		enabled: !!userId,
	});
}
