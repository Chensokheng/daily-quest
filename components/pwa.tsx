"use client";
import { sendNotification } from "@/actions/notification";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Pwa() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", async function () {
				await navigator.serviceWorker.register("/sw.js");
			});
		}
	}, []);

	return <></>;
}
