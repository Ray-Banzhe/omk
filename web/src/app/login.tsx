import { LoginCard } from "@/components/login-card"

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  )
}
