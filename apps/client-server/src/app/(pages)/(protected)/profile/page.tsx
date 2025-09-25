'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchProfile, type Profile } from '@/lib/api/profile'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile()
        setProfile(profileData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-svh w-full items-center justify-center flex-col gap-4">
        <p className="text-red-500">Error: {error}</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-lg">{profile?.first_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-lg">{profile?.last_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-lg">
                  {profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-lg">
                  {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : 'Not provided'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-lg">{profile?.location || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <label className="font-medium">Account Created</label>
                  <p>{profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}</p>
                </div>
                <div>
                  <label className="font-medium">Last Updated</label>
                  <p>{profile?.updated_at ? formatDate(profile.updated_at) : 'Unknown'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}