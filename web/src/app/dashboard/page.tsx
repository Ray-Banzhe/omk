import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions"

export default function DashboardPage() {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get("authenticated")?.value === "true"

  if (!isAuthenticated) {
    redirect("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">You are now logged in to your account.</p>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
