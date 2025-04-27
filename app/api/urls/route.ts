import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Forward the request with cookies to your Express.js backend
    // 2. Your backend would fetch the user's URLs
    // 3. Return the URLs data

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/urls`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("URLs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 })
  }
}
