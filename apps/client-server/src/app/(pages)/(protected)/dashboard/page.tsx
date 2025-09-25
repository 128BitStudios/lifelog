import Link from 'next/link'
import { User, Clock, Calendar } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-semibold">{data?.claims?.email}</span>
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/profile">
          <Button variant="outline" className="h-20 w-full">
            <div className="text-center">
              <User className="h-6 w-6 mx-auto mb-2" />
              <div>View Profile</div>
            </div>
          </Button>
        </Link>
        <Link href="/timeboxing">
          <Button variant="outline" className="h-20 w-full">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div>Timeboxing</div>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
