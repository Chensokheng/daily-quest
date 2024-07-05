"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const { data } = await supabase
				.from("profiles")
				.select("*")
				.single();
			return data;
		},
	});
}
