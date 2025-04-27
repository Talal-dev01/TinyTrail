import { redirect } from "next/navigation";

async function getOriginalUrl(shortId: string) {
  try {
    // Call your backend API to get the original URL
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/url/${shortId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response, "response called");
    // console.log(response, "response");
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    console.log(data, "data");
    return data.redirectURL;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return null;
  }
}

export default async function RedirectPage({
  params,
}: {
  params: { shortId: string };
}) {
  const { shortId } = await params;
  console.log(shortId, "shortId");
  const originalUrl = await getOriginalUrl(shortId);

  console.log(originalUrl, "originalUrl");

  if (originalUrl) {
    redirect(originalUrl);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-700/50 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Link Not Found</h1>
          <p className="text-slate-300 mb-6">
            This shortened URL is invalid or has expired.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
