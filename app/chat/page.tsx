import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import ChatInterface from "@/components/chat/chat-interface";

export default async function ChatPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={session.user} />
      <main className="container mx-auto px-4 py-6">
        <ChatInterface userId={session.user.id} />
      </main>
    </div>
  );
}
