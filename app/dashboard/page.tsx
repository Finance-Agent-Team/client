import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Navbar } from "@/components/layout/navbar"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio and create custom charts by comparing your data with market indexes and benchmarks.
          </p>
        </div>
        <DashboardGrid />
      </main>
    </div>
  )
} 