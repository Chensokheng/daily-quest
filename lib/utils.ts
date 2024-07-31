import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfWeek, addDays, format, getDay, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function urlB64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

// export function getCurrentWeekDaysWithNames(
// 	data: IQuestLog[] | null | undefined
// ) {
// 	if (data) {
// 		const parseLog: any = {};
// 		data.forEach((value) => {
// 			const formattedDate = format(
// 				parseISO(value.log_date),
// 				"yyyy-MM-dd"
// 			); // Format the date as desired
// 			parseLog[formattedDate] = { ...value, log_date: formattedDate };
// 		});

// 		const today = new Date(); // Get current date
// 		const startOfCurrentWeek = startOfWeek(today); // Start of current week (Sunday)
// 		const logs: { [key: string]: IQuestLog } = {}; // Array to hold each day of the week with names

// 		const dayNames = [
// 			"Sunday",
// 			"Monday",
// 			"Tuesday",
// 			"Wednesday",
// 			"Thursday",
// 			"Friday",
// 			"Saturday",
// 		];

// 		// Loop through 7 days starting from Sunday (0) to Saturday (6)
// 		for (let i = 0; i < 7; i++) {
// 			const day = addDays(startOfCurrentWeek, i);
// 			const dayName = dayNames[getDay(day)]; // Get day name based on index
// 			const formattedDate = format(day, "yyyy-MM-dd"); // Format the date as desired

// 			if (
// 				Object.keys(parseLog).includes(formattedDate) &&
// 				parseLog[formattedDate].log_date === formattedDate
// 			) {
// 				logs[formattedDate] = { ...parseLog[formattedDate], dayName };
// 			} else {
// 				logs[formattedDate] = {
// 					is_completed: false,
// 					count: 0,
// 					log_date: formattedDate,
// 					dayName,
// 				};
// 			}
// 			// days.push({ date: formattedDate, dayName: dayName });
// 		}
// 		return logs;
// 	}
// 	return [];
// }

export const getImageUrl = (imageName: string) => {
	return (
		`https://zpapagojlfddtjyciyum.supabase.co/storage/v1/object/public/images/` +
		imageName
	);
};
