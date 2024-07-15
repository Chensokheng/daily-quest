"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
export default function useReviewer(userId: string) {
	return useQuery({
		queryKey: ["reviewer"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			let { data, error } = await supabase
				.from("challenger")
				.select(
					"*,profiles!challenger_reviewer_id_fkey(display_name,image_url)"
				)
				.eq("user_id", userId)
				.single();
			return data;
		},
		enabled: !!userId,
	});
}
