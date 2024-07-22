import React from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/app/hook/useUser";
import useFriendRequest from "@/app/hook/useFriendRequest";
import usePendingRequest from "@/app/hook/useReviewer";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
	title: z.string().min(5, { message: "Title is too short" }),
	emoji: z.string().min(1, { message: "Please use one emoji" }),
});

export default function AddCustomQuest() {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			emoji: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("quests")
			.insert({ title: data.title, emoji: data.emoji, public: false });
		if (error) {
			toast.error(`Failed to add challenger. ${error.message}`);
		} else {
			queryClient.invalidateQueries({
				queryKey: ["quests"],
			});
			queryClient.invalidateQueries({
				queryKey: ["quest-log"],
			});
			form.reset();
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6 pt-5 bg-zinc-900 p-5 rounded-xl"
			>
				<div>
					<h1 className="font-semibold">Create Your Habit Quest</h1>
				</div>

				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Read 10 page..."
									className="text-base"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="emoji"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="📘...."
									{...field}
									className="text-base"
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full rounded-xl bg-green-500 text-white hover:bg-green-600"
				>
					Add New Quest
				</Button>
			</form>
		</Form>
	);
}
