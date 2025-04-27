import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder API route that connects to your Express.js backend
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real implementation, you would:
    // 1. Forward the request to your Express.js backend
    // 2. Your backend would fetch the analytics data
    // 3. Return the analytics data

    // For demo purposes, we're creating a proxy to your Express.js backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/url/analytics/${id}`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
