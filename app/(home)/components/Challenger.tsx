"use client";
import React, { useEffect } from "react";
import { Copy, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ChallengerAction from "./ChallengerAction";
import Reviewer from "./Reviewer";
import { useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { toast } from "sonner";

export default function Challenger() {
	const queryClient = useQueryClient();
	const { data } = useUser();

	useEffect(() => {
		const supabase = createSupabaseBrowser();
		const channel = supabase
			.channel("reviewer")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "challenger" },
				(payload) => {
					console.log("Change received!", payload);
					queryClient.invalidateQueries({
						queryKey: ["reviewer"],
					});
					queryClient.invalidateQueries({
						queryKey: ["challenger"],
					});
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCopyUserId = async () => {
		await navigator.clipboard.writeText(data?.id || "");
		toast.success("id is copied. Use it to share with your friend.");
	};

	return (
		<Dialog>
			<DialogTrigger asChild id="challenge-trigger">
				<Button className=" rounded-full" variant="outline">
					<User /> +
				</Button>
			</DialogTrigger>
			<DialogContent className=" h-screen  bg-green-100 w-full p-5 flex flex-col justify-between">
				<div>
					<Button
						className=" rounded-full"
						onClick={() => {
							document
								.getElementById("challenge-trigger")
								?.click();
						}}
						variant="outline"
					>
						Back
					</Button>
				</div>
				<div className=" divide-y">
					<Reviewer />
					<ChallengerAction />

					<InputForm />
				</div>
				<div>
					<Button
						className="w-full rounded-full flex items-center gap-2"
						onClick={handleCopyUserId}
					>
						Copy your ID <Copy className=" size-5" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

const FormSchema = z.object({
	reviewer_id: z.string().uuid(),
});

export function InputForm() {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			reviewer_id: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const supabase = createSupabaseBrowser();
		const { error } = await supabase
			.from("challenger")
			.insert({ reviewer_id: data.reviewer_id });
		if (error) {
			toast.error(`Failed to add challenger. ${error.message}`);
		} else {
			form.reset();
			queryClient.invalidateQueries({ queryKey: ["reviewer"] });
			queryClient.invalidateQueries({ queryKey: ["challenger"] });
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6 pt-5"
			>
				<FormField
					control={form.control}
					name="reviewer_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-center  text-lg w-full block">
								Add Challenger
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter friend's ID"
									{...field}
								/>
							</FormControl>
							<FormDescription className="text-center">
								{"Ask for your friend's ID or share your own."}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full rounded-full bg-indigo-600"
				>
					Challenge ⚔️
				</Button>
			</form>
		</Form>
	);
}
