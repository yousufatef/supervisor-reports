import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl;

  // if (pathname === "/form") {
  //   const token = req.cookies.get("auth-token")?.value;

  //   try {
  //     if (!token || !verifyToken(token)) {
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }
  //   } catch {
  //     // لو فيه أي خطأ في التوكن
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  // return NextResponse.next();
}

export const config = {
  // matcher: ["/form"],
};
