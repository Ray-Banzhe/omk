import { useState } from "react"
import { Github } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginCard() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in to your account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>

        <LoginForm />

      </CardContent>
    </Card>
  )
}
