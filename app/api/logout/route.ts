import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Forward the request to your Express.js backend
    // 2. Your backend would clear the session/cookies
    // 3. Return success and clear cookies

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/logout`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    // Clear cookies on the client
    const responseHeaders = new Headers()
    responseHeaders.append("Set-Cookie", "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly")

    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url), {
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
