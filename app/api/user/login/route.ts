import { type NextRequest, NextResponse } from "next/server";

// This is a placeholder API route that connects to your Express.js backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real implementation, you would:
    // 1. Forward the request to your Express.js backend
    // 2. Your backend would authenticate the user
    // 3. Return the authentication result and set cookies

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include", // Add this line
    });

    const data = await response.json();

    // Create a new response with the data
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Get the Set-Cookie header from the backend response
    console.log(response.headers.get("set-cookie"));
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      // Set the cookie in the Next.js response
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
