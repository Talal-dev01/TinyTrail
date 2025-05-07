import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Build cookie options
  const cookieOptions: any = {
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // Only set domain in production
  if (process.env.NODE_ENV === "production") {
    cookieOptions.domain = "shortlyfy.vercel.app";
  }

  response.cookies.set(cookieOptions);

  return response;
}
