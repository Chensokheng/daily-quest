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

const FormSchema = z.object({
	reviewer_id: z.string().uuid(),
});

export default function InputForm() {
	const { data: user } = useUser();
	const { data: request } = useFriendRequest(user?.id || "");
	const { data: pending } = usePendingRequest(user?.id || "");

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
		}
	}

	if (request || pending) {
		return <></>;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6 pt-5 bg-zinc-900 p-5 rounded-xl"
			>
				<FormField
					control={form.control}
					name="reviewer_id"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Enter friend's ID"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								{"Ask for your friend's ID or share your own."}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full rounded-xl bg-green-500 text-white hover:bg-green-600"
				>
					Add Friend
				</Button>
			</form>
		</Form>
	);
}
