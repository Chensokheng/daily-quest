self.addEventListener("push", async (e) => {
	const { message, body, icon } = JSON.parse(e.data.text());

	e.waitUntil(
		self.registration.showNotification(message, {
			body,
			icon,
		})
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	// This looks to see if the current window is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === "/" && "focus" in client)
						return client.focus();
				}
				if (clients.openWindow) return clients.openWindow("/");
			})
	);
});
