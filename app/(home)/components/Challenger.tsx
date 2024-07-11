"use client";
import React from "react";
import { Copy } from "lucide-react";
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
import Image from "next/image";

export default function Challenger() {
	return (
		<Dialog>
			<DialogTrigger asChild id="challenge-trigger">
				<Button className=" rounded-full" variant="outline">
					Add Challenger +
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
					<div className=" flex items-center justify-between border p-2 rounded-md mb-10 shadow-sm">
						<div className="flex items-center gap-2">
							<Image
								src={"/profile.jpeg"}
								alt="sokheng"
								width={50}
								height={50}
								className=" rounded-full"
							/>
							<h1 className="text-lg font-semibold">Sokheng</h1>
						</div>
						<Button className=" rounded-full">Accepte</Button>
					</div>

					<InputForm />
				</div>
				<div>
					<Button className="w-full rounded-full flex items-center gap-2">
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
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			reviewer_id: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {}

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
