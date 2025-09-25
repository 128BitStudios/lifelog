export interface Profile {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  gender: 'M' | 'F' | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface ProfileResponse {
  data: Profile
}

export interface ProfileError {
  error: string
  details?: string
}

export const fetchProfile = async (): Promise<Profile> => {
  const response = await fetch('/api/profile')
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch profile')
  }

  return result.data.profile
}