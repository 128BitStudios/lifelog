import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <p className="text-xl mb-4">
            Hello <span className="font-semibold">{data?.claims?.email}</span>
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/profile">
            <Button variant="default">View Profile</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
