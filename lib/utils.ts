import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfWeek, addDays, format, getDay } from "date-fns";
import { IQuestLog } from "@/app/(home)/components/QuestLog";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCurrentWeekDaysWithNames(
	data: IQuestLog[] | null | undefined
) {
	if (data) {
		const parseLog: any = {};
		data.forEach((value) => {
			const formattedDate = format(
				new Date(value.log_date),
				"yyyy-MM-dd"
			); // Format the date as desired
			parseLog[formattedDate] = { ...value, log_date: formattedDate };
		});

		const today = new Date(); // Get current date
		const startOfCurrentWeek = startOfWeek(today); // Start of current week (Sunday)
		const logs: { [key: string]: IQuestLog } = {}; // Array to hold each day of the week with names

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

			if (
				Object.keys(parseLog).includes(formattedDate) &&
				parseLog[formattedDate].log_date === formattedDate
			) {
				logs[formattedDate] = { ...parseLog[formattedDate], dayName };
			} else {
				logs[formattedDate] = {
					is_completed: false,
					count: 0,
					log_date: formattedDate,
					dayName,
				};
			}
			// days.push({ date: formattedDate, dayName: dayName });
		}
		return logs;
	}
	return [];
}

export const getImageUrl = (imageName: string) => {
	return (
		`https://zpapagojlfddtjyciyum.supabase.co/storage/v1/object/public/images/` +
		imageName
	);
};
