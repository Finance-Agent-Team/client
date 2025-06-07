"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Investor AI</CardTitle>
          <CardDescription>Sign in to access your AI-powered portfolio analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGitHubLogin} disabled={isLoading} className="w-full" size="lg">
            <Github className="mr-2 h-4 w-4" />
            {isLoading ? "Signing in..." : "Continue with GitHub"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Secure authentication powered by Supabase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
