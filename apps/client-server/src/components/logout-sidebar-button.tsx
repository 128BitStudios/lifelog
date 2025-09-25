"use client"

import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function LogoutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <SidebarMenuButton onClick={handleSignOut}>
      <LogOut />
      <span>Sign Out</span>
    </SidebarMenuButton>
  )
}