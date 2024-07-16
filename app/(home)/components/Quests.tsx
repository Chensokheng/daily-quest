"use client";
import useQuests from "@/app/hook/useQuest";
import { Button } from "@/components/ui/button";
import { BG_COLOR } from "@/lib/constants";
import { cn, getImageUrl } from "@/lib/utils";
import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, LoaderCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type IQuest = {
	created_at: string;
	created_by: string | null;
	emoji: string;
	id: string;
	public: boolean;
	title: string;
	background: string;
	quest_progress: {
		created_at: string;
		id: string;
		image_url: string | null;
		is_completed: boolean;
		quest_id: string;
		user_id: string;
	};
};
export default function Quests() {
	const { data: user } = useUser();
	const { data } = useQuests(user?.id || "");

	const [imagePrevew, setImagePreview] = useState("");
	const [reviewFile, setReviewFile] = useState<File>();
	const [quest, setQuest] = useState<IQuest>();
	const [isPending, startTransition] = useTransition();
	const queryClient = useQueryClient();

	const openQuest = (selectQuest: IQuest) => {
		setQuest(selectQuest);
		document.getElementById("quest-trigger")?.click();
	};

	const reset = () => {
		setQuest(undefined);
		setReviewFile(undefined);
		setImagePreview("");
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
					document.getElementById("quest-trigger")?.click();
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

	const questImageUrl = quest?.quest_progress
		? getImageUrl(
				`${quest?.quest_progress?.user_id}/${quest?.quest_progress?.quest_id}/${quest?.quest_progress?.image_url}`
		  )
		: undefined;
	return (
		<>
			<div className=" p-5 space-y-7 w-full">
				{data?.map((quest, index) => {
					const questProgress = quest.quest_progress[0];
					const isComplted = questProgress?.is_completed;
					const bgColor = BG_COLOR[index];
					return (
						<div
							className={cn(
								" w-full rounded-2xl p-5 border-2 border-black -rotate-[2deg] space-y-5 hover:scale-105 transition-all cursor-pointer",
								bgColor,
								{ "rotate-2": index % 2 !== 0 }
							)}
							key={index}
							onClick={() =>
								openQuest({
									...quest,
									background: bgColor,
									quest_progress: questProgress,
								})
							}
						>
							<div className="flex items-center justify-between">
								<h1 className="text-3xl font-bold line-clamp-3">
									{quest.title}
								</h1>
								<span className="text-7xl">{quest.emoji}</span>
							</div>
							{questProgress?.id ? (
								<>
									{questProgress.is_completed ? (
										<Button
											className={cn("rounded-full", {
												"  border-zinc-500":
													!isComplted,
											})}
											variant="outline"
										>
											Completed ✅
										</Button>
									) : (
										<Button
											className={cn("rounded-full", {
												"  border-zinc-500":
													!isComplted,
											})}
											variant="outline"
										>
											In Review ⌛️
										</Button>
									)}
								</>
							) : (
								<Button
									className={cn("rounded-full", {
										"  border-zinc-500": !isComplted,
									})}
								>
									{isComplted
										? "Completed ✅"
										: "In progress 🚀"}
								</Button>
							)}
						</div>
					);
				})}
			</div>
			<Dialog>
				<DialogTrigger id="quest-trigger"></DialogTrigger>
				<DialogContent
					className={cn(
						"h-screen w-full  border-none p-5 flex justify-between flex-col",
						quest?.background
					)}
				>
					<div className=" justify-between flex items-center">
						<Button
							variant={"outline"}
							className=" rounded-full"
							onClick={() => {
								document
									.getElementById("quest-trigger")
									?.click();
								reset();
							}}
						>
							Back
						</Button>
						<span className="text-5xl">{quest?.emoji}</span>
					</div>
					<div className="space-y-5">
						<h1 className="text-3xl font-bold text-center">
							{quest?.title}
						</h1>
						{!imagePrevew && !questImageUrl ? (
							<div>
								<label
									htmlFor="quest-file"
									className=" h-96 w-80 border-dashed border  flex items-center justify-center mx-auto border-gray-500 rounded-xl group"
								>
									<ImageIcon className=" size-40 text-gray-700 group-hover:scale-105 transition-all" />
								</label>
								<input
									type="file"
									id="quest-file"
									accept="image/*"
									className=" hidden"
									onChange={handleFileChange}
								/>
							</div>
						) : (
							<div className="h-96 w-80 mx-auto rounded-2xl  relative">
								<Image
									src={questImageUrl || imagePrevew}
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
					</div>
					{quest?.quest_progress?.id ? (
						<>
							{quest.quest_progress.is_completed ? (
								<Button className=" rounded-full h-12">
									Completed ✅
								</Button>
							) : (
								<Button
									variant={"outline"}
									className=" rounded-full h-12"
								>
									Waiting for Review ⌛️
								</Button>
							)}
						</>
					) : (
						<Button
							className=" rounded-full h-12 flex items-center justify-center gap-2"
							onClick={handleReview}
							disabled={isPending}
						>
							<LoaderCircle
								className={cn(" animate-spin size-4 hidden", {
									block: isPending,
								})}
							/>
							Review
						</Button>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
