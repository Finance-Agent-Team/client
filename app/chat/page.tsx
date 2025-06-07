import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import ChatInterface from "@/components/chat/chat-interface"
import { Navbar } from "@/components/layout/navbar"

export default async function ChatPage() {
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
        <ChatInterface userId={session.user.id} />
      </main>
    </div>
  )
}
