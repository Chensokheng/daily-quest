"use server";
import { createSupabaseServer } from "@/lib/supabase/server";
import webpush from "web-push";

export const sendNotification = async (
	message: string,
	user_id: string,
	icon: string,
	name: string
) => {
	const vapidKeys = {
		publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
		privateKey: process.env.VAPID_PRIVATE_KEY!,
	};
	//setting our previously generated VAPID keys
	webpush.setVapidDetails(
		"mailto:myuserid@email.com",
		vapidKeys.publicKey,
		vapidKeys.privateKey
	);

	const supabase = createSupabaseServer();

	const { data, error } = await supabase
		.from("notification")
		.select("*")
		.eq("user_id", user_id)
		.single();
	if (error) {
		return JSON.stringify({ error: error.message });
	} else if (data) {
		try {
			await webpush.sendNotification(
				JSON.parse(data.notification_json),
				JSON.stringify({
					message: name,
					icon,
					body: message,
				})
			);
			return "{}";
		} catch (e) {
			return JSON.stringify({ error: "failed to send notification" });
		}
	}
	return "{}";
};
