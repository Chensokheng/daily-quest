"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type IUser = {
	created_at: string;
	display_name: string | null;
	email: string;
	id: string;
	image_url: string | null;
	provider: string;
	quest_counts: number;
	enable_custom_quest: boolean;
	strike: {
		count: number;
		user_id: string;
	} | null;
	challenger: {
		reviewer_id: string;
	} | null;
} | null;

export default function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data } = await supabase
					.from("profiles")
					.select(
						"*,strike(*),challenger!challenger_user_id_fkey(reviewer_id)"
					)
					.eq("id", user.data.user?.id)
					.single();
				return data as IUser;
			}
			return {} as IUser;
		},
	});
}
