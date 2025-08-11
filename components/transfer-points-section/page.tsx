"use client"

import type React from "react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall } from "@/lib/api"

export default function TransferPointsForm({
  onTransferSuccess,
  onReturnToDashboard,
}: { onTransferSuccess: () => void; onReturnToDashboard: () => void }) {
  const [receiverEmail, setReceiverEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    const transferAmount = Number.parseInt(amount)

    if (!receiverEmail.trim() || isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid email and amount greater than zero.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await apiCall("/points/transfer", "POST", { to_email: receiverEmail, amount: transferAmount }, true)
      toast({ title: "Transfer Successful", description: "Points transferred successfully!" })
      setReceiverEmail("")
      setAmount("")
      onTransferSuccess() // Callback to refresh dashboard stats
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer points.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card-background p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary flex justify-between items-center">
        💸 Transfer Points
        <Button onClick={onReturnToDashboard} className="btn-secondary">
          Return to Dashboard
        </Button>
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="receiverEmail">Receiver Email</Label>
          <Input
            id="receiverEmail"
            name="receiver_email"
            type="email"
            placeholder="e.g. user@example.com"
            required
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="transferAmount">Amount</Label>
          <Input
            id="transferAmount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
          {isLoading ? "Sending Points..." : "Send Points"}
        </Button>
      </form>
    </div>
  )
}
