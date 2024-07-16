import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://next-supabase-vote.vercel.app/"),

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
		url: "https://next-supabase-vote.vercel.app/",
		siteName: "Daily Quest",
		images: "/og.png",
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
		<html lang="en">
			<body className={inter.className}>
				<QueryProvider>
					<main className="w-full max-w-lg mx-auto  h-screen  bg-green-100 space-y-10">
						{children}
					</main>
				</QueryProvider>
				<Toaster position="top-center" richColors />
			</body>
		</html>
	);
}
