import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

const protectedRoutes = [
  "/dashboard",
  "/dashboard/attendance",
  "/dashboard/project",
  "/dashboard/chat",
  "/dashboard/profile",
];

const adminManagerRoutes = [
  "/dashboard/analytics",
  "/dashboard/create-employee",
  "/dashboard/manage-employees",
  "/dashboard/tracking",
];

const restrictedBlockedRoutes = [
  "/dashboard/attendance",
  "/dashboard/project",
  "/dashboard/chat",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
          cookiesToSet.forEach(({ name, value }) =>
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminManagerRoute = adminManagerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isRestrictedBlockedRoute = restrictedBlockedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return response;
  }

  if ((isProtectedRoute || isAdminManagerRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (isAdminManagerRoute || isRestrictedBlockedRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role,status")
      .eq("id", user.id)
      .single();

    const role = String(profile?.role || "").trim().toLowerCase();
    const status = String(profile?.status || "active").trim().toLowerCase();

    if (isAdminManagerRoute && role !== "admin" && role !== "manager" && role !== "supervisor") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }

    if (
      isRestrictedBlockedRoute &&
      status === "restricted" &&
      role === "employee"
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};