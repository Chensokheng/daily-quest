"use client";
import useUser from "@/app/hook/useUser";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { urlB64ToUint8Array } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationRequest() {
	const { data: user, isFetching } = useUser();
	const queryClient = useQueryClient();

	const [notificationPermission, setNotificationPermission] = useState<
		"granted" | "denied" | "default"
	>("granted");

	// Check permission status when component mounts

	const showNotification = () => {
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				setNotificationPermission(permission);
				if (permission === "granted") {
					subscribeUser();
				} else {
					toast.info(
						"please go to setting and enable noitificatoin."
					);
				}
			});
		} else {
			toast.info("This browser does not support notifications.");
		}
	};

	async function subscribeUser() {
		if ("serviceWorker" in navigator) {
			try {
				// Check if service worker is already registered
				const registration =
					await navigator.serviceWorker.getRegistration();
				if (registration) {
					generateSubscribeEndPoint(registration);
				} else {
					// Register the service worker
					const newRegistration =
						await navigator.serviceWorker.register("/sw.js");
					// Subscribe to push notifications
					generateSubscribeEndPoint(newRegistration);
				}
			} catch (error) {
				toast.error(
					"Error during service worker registration or subscription:"
				);
			}
		} else {
			toast.error("Service workers are not supported in this browser");
		}
	}

	const generateSubscribeEndPoint = async (
		newRegistration: ServiceWorkerRegistration
	) => {
		const applicationServerKey = urlB64ToUint8Array(
			process.env.NEXT_PUBLIC_VAPID_KEY!
		);
		const options = {
			applicationServerKey,
			userVisibleOnly: true, // This ensures the delivery of notifications that are visible to the user, eliminating silent notifications. (Mandatory in Chrome, and optional in Firefox)
		};
		const subscription = await newRegistration.pushManager.subscribe(
			options
		);
		const supabase = createSupabaseBrowser();

		const { error } = await supabase
			.from("notification")
			.insert({ notification_json: JSON.stringify(subscription) });

		if (error) {
			toast.error(error.message);
		} else {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		}
	};

	const removeNotification = async () => {
		// remove from notification
		setNotificationPermission("denied");
		const supabase = createSupabaseBrowser();

		const { error } = await supabase
			.from("notification")
			.delete()
			.eq("user_id", user?.id!);

		if (error) {
			toast.error(error.message);
		} else {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		}
	};

	useEffect(() => {
		setNotificationPermission(Notification.permission);
	}, []);

	if (isFetching) {
		return null;
	}
	return (
		<div className=" hover:scale-110 cursor-pointer transition-all">
			{notificationPermission === "granted" && user?.notification ? (
				<BellRing onClick={removeNotification} />
			) : (
				<BellOff onClick={showNotification} />
			)}
		</div>
	);
}
