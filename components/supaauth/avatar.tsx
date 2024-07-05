import useUser from "@/app/hook/useUser";
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
const Avatar = ({ className = "w-10" }: { className?: string }) => {
	const { data, isFetching } = useUser();
	const imageUrl = data?.image_url;

	return (
		<div
			className={cn(
				" transition-all flex items-center justify-center",
				className,
				isFetching
					? "opacity-0 translate-y-2"
					: "opacity-1 translate-y-0"
			)}
		>
			{!imageUrl ? (
				<div className=" border w-10 h-10    grid place-content-center rounded-full hover:scale-105 transition-all">
					<p className="text-4xl -translate-y-1">
						{data?.email?.[0]}
					</p>
				</div>
			) : (
				<Image
					src={imageUrl}
					alt=""
					width={70}
					height={70}
					className={cn(
						" rounded-full border p-1 hover:scale-105 transition-all duration-500",
						isFetching
							? "opacity-0 translate-y-2"
							: "opacity-1 translate-y-0"
					)}
				/>
			)}
		</div>
	);
};

export default Avatar;
