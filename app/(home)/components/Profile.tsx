import React from "react";
import Image from "next/image";

export default function Profile() {
	return (
		<div className="flex items-center justify-center flex-col gap-3">
			<Image src={"/line.png"} alt="line" width={100} height={100} />
			<Image
				src={"/profile.jpeg"}
				alt="sokheng"
				width={70}
				height={70}
				className=" rounded-full"
			/>
			<h1 className="text-3xl font-bold">Hi, Sokheng</h1>
			<p className="text-zinc-600 font-medium">10 Days in a row</p>
		</div>
	);
}
