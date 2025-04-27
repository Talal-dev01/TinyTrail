import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real implementation, you would:
    // 1. Forward the request with cookies to your Express.js backend
    // 2. Your backend would create the shortened URL
    // 3. Return the shortened URL data

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("URL creation error:", error)
    return NextResponse.json({ error: "Failed to create shortened URL" }, { status: 500 })
  }
}
