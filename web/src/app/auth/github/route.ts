import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // In a real implementation, you would:
  // 1. Generate a random state parameter for CSRF protection
  // 2. Store it in a cookie or session
  // 3. Redirect to GitHub's OAuth authorization URL

  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
  const state = Math.random().toString(36).substring(2)

  // Set a cookie with the state parameter
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=user:email`,
  )

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  return response
}
