import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { protectedPaths, authPaths } from "@/lib/constants";

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						request.cookies.set(name, value)
					);
					response = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	const user = await supabase.auth.getUser();
	const url = new URL(request.url);
	const next = url.searchParams.get("next");
	if (user.data.user?.id) {
		if (authPaths.includes(url.pathname)) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return response;
	} else {
		if (protectedPaths.includes(url.pathname)) {
			return NextResponse.redirect(
				new URL("/auth?next=" + (next || url.pathname), request.url)
			);
		}
		return response;
	}
}
