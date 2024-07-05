"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const { data } = await supabase
				.from("profiles")
				.select("*,strike(*)")
				.single();
			return data;
		},
	});
}
