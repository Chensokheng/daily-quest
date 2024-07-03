import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfWeek, addDays, format, getDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Function to get all days of the current week
export function getCurrentWeekDaysWithNames() {
	const today = new Date(); // Get current date
	const startOfCurrentWeek = startOfWeek(today); // Start of current week (Sunday)
	const days: any = {}; // Array to hold each day of the week with names

	// Array of day names for formatting
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Loop through 7 days starting from Sunday (0) to Saturday (6)
	for (let i = 0; i < 7; i++) {
		const day = addDays(startOfCurrentWeek, i);
		const dayName = dayNames[getDay(day)]; // Get day name based on index
		const formattedDate = format(day, "yyyy-MM-dd"); // Format the date as desired
		days[formattedDate] = dayName;
		// days.push({ date: formattedDate, dayName: dayName });
	}

	return days;
}
