"use client"

import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button" // Import Button

interface UserProfile {
  email: string
  name?: string
  status: string
  points_balance: number
  referral_code?: string
  email_verified: boolean
  is_admin: boolean
  is_agent: boolean
  created_at: string
}

export default function ProfileSection({ onReturnToDashboard }: { onReturnToDashboard: () => void }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const data = await apiCall<UserProfile>("/users/me", "GET", null, true)
        setUser(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-text-secondary text-lg">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500 text-lg">
        Failed to load profile.
        <Button onClick={onReturnToDashboard} className="btn-secondary ml-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card-background p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary flex justify-between items-center">
        👤 Your Profile
        <Button onClick={onReturnToDashboard} className="btn-secondary">
          Return to Dashboard
        </Button>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
        <p>
          <strong className="text-text-primary">Email:</strong>{" "}
          <span className="text-text-secondary">{user.email}</span>
        </p>
        <p>
          <strong className="text-text-primary">Full Name:</strong>{" "}
          <span className="text-text-secondary">{user.name || "N/A"}</span>
        </p>
        <p>
          <strong className="text-text-primary">Status:</strong>{" "}
          <span className="text-text-secondary capitalize">{user.status}</span>
        </p>
        <p>
          <strong className="text-text-primary">Points Balance:</strong>{" "}
          <span className="text-text-secondary">{user.points_balance} pts</span>
        </p>
        <p>
          <strong className="text-text-primary">Referral Code:</strong>{" "}
          <span className="text-text-secondary">{user.referral_code || "N/A"}</span>
        </p>
        <p>
          <strong className="text-text-primary">Email Verified:</strong>{" "}
          <span className="text-text-secondary">{user.email_verified ? "Yes ✅" : "No ❌"}</span>
        </p>
        <p>
          <strong className="text-text-primary">Admin:</strong>{" "}
          <span className="text-text-secondary">{user.is_admin ? "Yes" : "No"}</span>
        </p>
        <p>
          <strong className="text-text-primary">Agent:</strong>{" "}
          <span className="text-text-secondary">{user.is_agent ? "Yes" : "No"}</span>
        </p>
        <p className="col-span-full">
          <strong className="text-text-primary">Created At:</strong>{" "}
          <span className="text-text-secondary">{new Date(user.created_at).toLocaleString()}</span>
        </p>
      </div>
    </div>
  )
      }
