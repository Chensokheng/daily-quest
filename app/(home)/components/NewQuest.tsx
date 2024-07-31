import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	Image as IconImage,
	ChevronUp,
	LoaderCircle,
} from "lucide-react";
import React, { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { toast } from "sonner";
import { sendNotification } from "@/actions/notification";

type IQuest = {
	created_at: string;
	created_by: string | null;
	emoji: string;
	id: string;
	public: boolean;
	title: string;
	quest_progress: {
		created_at: string;
		id: string;
		image_url: string;
		is_completed: boolean;
		object_id: string;
		quest_id: string;
		user_id: string;
	}[];
};
export default function NewQuest({ quest }: { quest: IQuest }) {
	const { data: user } = useUser();
	const [toggle, setToggle] = useState(false);
	const [imagePrevew, setImagePreview] = useState("");
	const [reviewFile, setReviewFile] = useState<File>();
	const [isPending, startTransition] = useTransition();
	const queryClient = useQueryClient();

	const questProgress = quest.quest_progress[0];
	const questImageUrl = quest?.quest_progress
		? getImageUrl(
				`${questProgress?.user_id}/${questProgress?.quest_id}/${questProgress?.image_url}`
		  )
		: undefined;

	const reset = () => {
		setReviewFile(undefined);
		setImagePreview("");
	};
	const handlePushNotification = async () => {
		if (user) {
			await sendNotification(
				"just completed a quest",
				user?.challenger?.reviewer_id!,
				user?.image_url!,
				user.display_name!
			);
		}
	};

	const handleReview = async () => {
		startTransition(async () => {
			const supabase = createSupabaseBrowser();
			if (reviewFile) {
				const { error } = await supabase.storage
					.from("images")
					.upload(
						user?.id +
							"/" +
							quest?.id +
							"/" +
							crypto.randomUUID() +
							reviewFile.name,
						reviewFile,
						{
							cacheControl: "3600",
							upsert: false,
						}
					);
				if (!error) {
					await handlePushNotification();
					reset();
					queryClient.invalidateQueries({ queryKey: ["quests"] });
				} else {
					toast.error("Fail to upload " + error.message);
				}
			}
		});
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target?.files;
		if (files?.length) {
			const compressedFile = await imageCompression(files[0], {
				maxSizeMB: 0.5,
				maxWidthOrHeight: 1080,
				useWebWorker: true,
			});
			const imageUrl = URL.createObjectURL(compressedFile);
			setReviewFile(compressedFile);
			setImagePreview(imageUrl);
		}
	};

	return (
		<>
			<div
				className={cn(" bg-zinc-900 rounded-xl  transition-all ", {
					"divide-y": toggle,
				})}
			>
				<div
					className=" flex items-center cursor-pointer justify-between hover:scale-105 p-5 transition-all"
					onClick={() => {
						setToggle(!toggle);
					}}
				>
					<div className="flex items-center gap-5 text-white">
						{questProgress ? (
							<>
								{questProgress.is_completed ? (
									<Checkbox
										id="terms"
										className=" size-5 border-green-400  checked:border-green-500 "
										checked={questProgress?.is_completed}
									/>
								) : (
									<span>⌛️</span>
								)}
							</>
						) : (
							<Checkbox
								id="terms"
								className=" size-5 border-green-400  checked:border-green-500 "
								checked={false}
							/>
						)}

						<p
							className={cn("font-semibold", {
								"line-through": questProgress?.is_completed,
							})}
						>
							{quest.title}
						</p>
						<span className="text-3xl">{quest.emoji}</span>
					</div>
					{toggle ? <ChevronUp /> : <ChevronDown />}
				</div>

				<div
					className={cn(
						" space-y-3 flex items-center justify-center flex-col transition-all ",
						toggle ? "h-auto pt-3" : "h-0 overflow-y-hidden"
					)}
				>
					{!questProgress?.image_url && !imagePrevew ? (
						<div>
							<label
								htmlFor={"quest-file-" + quest.id}
								className="h-80 w-72 border rounded-xl flex items-center justify-center cursor-pointer"
							>
								<IconImage className=" size-20 text-gray-400" />
							</label>
							<input
								type="file"
								id={"quest-file-" + quest.id}
								accept="image/*"
								className=" hidden"
								onChange={handleFileChange}
							/>
						</div>
					) : (
						<div className="h-96 w-80 mx-auto rounded-2xl  relative">
							<Image
								src={imagePrevew || questImageUrl || ""}
								alt="preview"
								fill
								className=" object-cover object-center rounded-2xl"
							/>
						</div>
					)}
					{reviewFile && (
						<div className="flex items-center justify-center">
							<Button
								className=" rounded-full"
								variant="ghost"
								onClick={() => {
									setReviewFile(undefined);
									setImagePreview("");
								}}
							>
								Change
							</Button>
						</div>
					)}
					{questProgress?.is_completed ? (
						<Button
							className="w-full rounded-xl  text-white rounded-ss-none rounded-se-none bg-green-600 hover:bg-green-600"
							variant={"outline"}
						>
							Approved ✅
						</Button>
					) : (
						<>
							{questProgress ? (
								<Button
									className="w-full rounded-xl  text-white rounded-ss-none rounded-se-none "
									variant={"outline"}
								>
									Ask your friend to review ⌛️
								</Button>
							) : (
								<Button
									className="w-full  rounded-xl rounded-ss-none rounded-se-none bg-green-500 text-white focus:bg-green-800 hover:ring-2 hover:bg-green-500 ring-green-400 focus:ring-0 transition-all"
									disabled={isPending}
									onClick={handleReview}
								>
									<LoaderCircle
										className={cn(
											" animate-spin size-4 hidden",
											{
												block: isPending,
											}
										)}
									/>
									Submit
								</Button>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}
