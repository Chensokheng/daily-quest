import useReviewer from "@/app/hook/useReviewer";
import useUser from "@/app/hook/useUser";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Reviewer() {
	const { data: user } = useUser();

	const { data } = useReviewer(user?.id || "");

	const handleRemoveChallenger = async () => {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("challenger")
			.delete()
			.eq("user_id", user?.id!);
		if (error) {
			toast.error("Failed to remove challenger. " + error.message);
		} else {
			toast.success(
				"Successfully remove challenger. Please add a new challenger to complete your quest"
			);
		}
	};

	if (!data) {
		return <></>;
	}

	return (
		<div className="space-y-3">
			<div className=" flex items-center justify-between border p-2 py-5 rounded-md mb-10 shadow-sm flex-col sm:flex-row gap-5">
				<div className="flex items-center gap-2">
					<Image
						src={data?.profiles?.image_url!}
						alt="sokheng"
						width={50}
						height={50}
						className=" rounded-full ring-1"
					/>
					<h1 className="text-lg">{data?.profiles?.display_name}</h1>
				</div>
				<div className="flex gap-2">
					<Button
						className=" rounded-full"
						variant="outline"
						onDoubleClick={handleRemoveChallenger}
					>
						Remove ❌
					</Button>
					{!data.is_accepted && (
						<Button className=" rounded-full" variant="outline">
							Pending ⌛️
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
