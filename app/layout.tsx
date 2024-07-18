import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://daily-habit-quest.vercel.app/"),

	title: {
		template: "%s | Daily Quest",
		default: "Daily Quest",
	},
	authors: {
		name: "chensokheng",
	},

	description: "a game to improve your habit",
	openGraph: {
		title: "Daily Quest",
		description: "a game to improve your habit",
		url: "https://daily-habit-quest.vercel.app/",
		siteName: "Daily Quest",
		images: "/icon512_maskable.png",
		type: "website",
	},
	keywords: ["daily web coding", "chensokheng", "dailywebcoding"],
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className} id="body">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<main className="w-full max-w-lg mx-auto  h-screen  bg-green-100 space-y-10">
							{children}
						</main>
					</QueryProvider>
					<Toaster position="top-center" richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
