"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PinInput } from "@/components/ui/pin-input"
import { apiCall } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ChangePinForm({ onReturnToDashboard }: { onReturnToDashboard: () => void }) {
  const [oldPin, setOldPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "New PIN must be a 4-digit number.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await apiCall(
        "/users/change-pin",
        "POST",
        {
          current_pin: oldPin,
          new_pin: newPin,
        },
        true,
      )
      toast({
        title: "PIN Changed",
        description: "PIN changed successfully!",
      })
      setOldPin("")
      setNewPin("")
    } catch (error: any) {
      toast({
        title: "Change Failed",
        description: error.message || "Failed to change PIN.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card-background p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary flex justify-between items-center">
        🔒 Change PIN
        <Button onClick={onReturnToDashboard} className="btn-secondary">
          Return to Dashboard
        </Button>
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="oldPin">Old PIN</Label>
          <PinInput
            id="oldPin"
            name="old_pin"
            length={4}
            required
            value={oldPin}
            onChange={setOldPin}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="newPin">New PIN</Label>
          <PinInput
            id="newPin"
            name="new_pin"
            length={4}
            required
            value={newPin}
            onChange={setNewPin}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
          {isLoading ? "Updating PIN..." : "Change PIN"}
        </Button>
      </form>
    </div>
  )
}
