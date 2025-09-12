import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (token && (pathname === "/login" || pathname === "/sign-up")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const publicPaths = ["/", "/login", "/sign-up", "/verify"];
    if (!token && !publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/sign-up" ||
          pathname === "/verify"
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/verify", "/sign-up", "/add-school", "/dashboard"],
};
