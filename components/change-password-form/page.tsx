"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { apiCall } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ChangePasswordForm({ onReturnToDashboard }: { onReturnToDashboard: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await apiCall(
        "/users/change-password",
        "POST",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        true,
      )
      toast({
        title: "Password Changed",
        description: "Password changed successfully!",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (error: any) {
      toast({
        title: "Change Failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card-background p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary flex justify-between items-center">
        🔐 Change Password
        <Button onClick={onReturnToDashboard} className="btn-secondary">
          Return to Dashboard
        </Button>
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <PasswordInput
            id="currentPassword"
            name="current_password"
            placeholder="Current Password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput
            id="newPassword"
            name="new_password"
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirm_password"
            placeholder="Confirm New Password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
          {isLoading ? "Updating Password..." : "Change Password"}
        </Button>
      </form>
    </div>
  )
}
