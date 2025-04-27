"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Link } from "lucide-react"

export default function RedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        // This is where you would connect to your Express.js backend
        // For demo purposes, we're simulating the API call

        // Replace this with your actual API endpoint
        // const response = await fetch(`/api/url/${params.id}`)
        // if (!response.ok) throw new Error('URL not found')
        // const data = await response.json()

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll redirect to a sample URL
        // In production, you would redirect to data.originalUrl
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              window.location.href = "https://example.com"
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        setError("This shortened URL is invalid or has expired.")
      }
    }

    fetchOriginalUrl()
  }, [params.id, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-700/50 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Link className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Link Not Found</h1>
            <p className="text-slate-300 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg"
            >
              Go Home
            </a>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Redirecting you</h1>
            <div className="mb-6">
              <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300">
                You will be redirected in <span className="text-purple-400 font-bold">{countdown}</span> seconds...
              </p>
            </div>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg"
            >
              Cancel
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
