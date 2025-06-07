"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, TrendingUp, MessageCircle, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { User } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"

interface NavbarProps {
  user: User
}

export function Navbar({ user }: NavbarProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    {
      href: "/chat",
      label: "Chat",
      icon: MessageCircle,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Investor AI</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{user.user_metadata?.full_name || user.email}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
