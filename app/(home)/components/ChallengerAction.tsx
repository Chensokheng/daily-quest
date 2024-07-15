"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useChallenger from "@/app/hook/useChallenger";
import useUser from "@/app/hook/useUser";
import { createSupabaseBrowser } from "@/lib/supabase/client";
export default function ChallengerAction() {
	const { data: user } = useUser();

	const { data, isFetching } = useChallenger(user?.id || "");
	if (!data || isFetching) {
		return <></>;
	}

	const handleAccepte = async () => {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("challenger")
			.update({ is_accepted: true })
			.eq("reviewer_id", user?.id!);
		if (error) {
			alert("failt to accepte");
		}
	};

	return (
		<div className=" flex items-center justify-between border p-2 py-5 rounded-md mb-10 shadow-sm flex-col md:flex-row gap-5">
			<div className="flex items-center gap-2">
				<Image
					src={data?.profiles?.image_url!}
					alt="sokheng"
					width={50}
					height={50}
					className=" rounded-full"
				/>
				<h1 className="text-lg font-semibold">
					{data?.profiles?.display_name}
				</h1>
			</div>
			<div>
				<Button variant="ghost" className=" rounded-full">
					Reject ❌
				</Button>
				<Button
					className=" rounded-full"
					variant="ghost"
					onClick={handleAccepte}
				>
					Accepte ✅
				</Button>
			</div>
		</div>
	);
}
