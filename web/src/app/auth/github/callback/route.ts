import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // In a real implementation, you would:
  // 1. Verify the state parameter to prevent CSRF attacks
  // 2. Exchange the code for an access token
  // 3. Use the access token to fetch the user's profile
  // 4. Create or update the user in your database
  // 5. Create a session for the user

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = request.cookies.get("github_oauth_state")?.value

  // Verify state parameter
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error}`, request.url))
    }

    const accessToken = tokenData.access_token

    // Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userData = await userResponse.json()

    // Fetch user emails
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const emailsData = await emailsResponse.json()
    const primaryEmail = emailsData.find((email: any) => email.primary)?.email

    // Here you would create or update the user in your database
    // and create a session for the user

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=server_error", request.url))
  }
}
