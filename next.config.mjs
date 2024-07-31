import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
			},
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
			},
			{
				hostname: "zpapagojlfddtjyciyum.supabase.co",
				protocol: "https",
			},
		],
	},
};
const isDev = process.env.NODE_ENV !== "production";

const withPWA = nextPwa({
	dest: "public",
	register: true,
	buildExcludes: [
		// add buildExcludes here
		({ asset, compilation }) => {
			if (
				asset.name.startsWith("server/") ||
				asset.name.match(
					/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
				)
			) {
				return true;
			}
			if (isDev && !asset.name.startsWith("static/runtime/")) {
				return true;
			}
			return false;
		},
	],
});

const config = withPWA({
	...nextConfig,
});

export default config;
