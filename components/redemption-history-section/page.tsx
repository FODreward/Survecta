"use client"

import { useEffect, useState, useCallback } from "react"
import { apiCall } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button" // Import Button
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDateForInput, getPastDate } from "@/lib/utils" // Import date utilities

interface Redemption {
  id: string
  type: string
  points_amount: number
  equivalent_value: number
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function RedemptionHistorySection({ onReturnToDashboard }: { onReturnToDashboard: () => void }) {
  const [history, setHistory] = useState<Redemption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const defaultEndDate = new Date()
  const defaultStartDate = getPastDate(30)

  const [startDate, setStartDate] = useState(formatDateForInput(defaultStartDate))
  const [endDate, setEndDate] = useState(formatDateForInput(defaultEndDate))
  const [limit, setLimit] = useState("10") // Default to 10 items

  const loadHistory = useCallback(async () => {
    setIsLoading(true)

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      toast({
        title: "Invalid Date Range",
        description: "Start date cannot be after end date.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 30) {
      toast({
        title: "Date Range Exceeded",
        description: "Date range cannot exceed 30 days.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const data = await apiCall<Redemption[]>("/redemption/history", "GET", null, true, {
        start_date: startDate,
        end_date: endDate,
        limit: limit,
      })
      setHistory(
  Array.isArray(data)
    ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : []
)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load redemption history.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate, limit, toast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return (
    <div className="bg-card-background p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary flex justify-between items-center">
        🧾 Redemption History
        <Button onClick={onReturnToDashboard} className="btn-secondary">
          Return to Dashboard
        </Button>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="limit">Items Per Page</Label>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger id="limit">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px] text-text-secondary text-lg">
          Loading redemption history...
        </div>
      ) : history.length === 0 ? (
        <p className="text-text-secondary text-lg text-center py-8">
          No redemption history found with applied filters.
        </p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {" "}
          {/* Added scrollable container */}
          <ul className="space-y-4">
            {history.map((item) => {
              let statusClass = ""
              let statusEmoji = ""
              if (item.status === "approved") {
                statusClass = "bg-green-100 text-green-800"
                statusEmoji = "✅"
              } else if (item.status === "pending") {
                statusClass = "bg-yellow-100 text-yellow-800"
                statusEmoji = "⏳"
              } else {
                statusClass = "bg-red-100 text-red-800"
                statusEmoji = "❌"
              }

              return (
                <li key={item.id} className="bg-background p-5 rounded-xl shadow-sm border border-border-light">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold capitalize text-xl text-text-primary flex items-center gap-2">
                      {statusEmoji} {item.type.replace("_", " ")}
                    </h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}>{item.status}</span>
                  </div>
                  <p className="text-text-secondary text-base">
                    <strong>Points:</strong> {item.points_amount} pts
                  </p>
                  <p className="text-text-secondary text-base">
                    <strong>Value:</strong> ${Number(item.equivalent_value || 0).toFixed(2)}
                  </p>
                  <p className="text-text-secondary text-sm mt-2">
                    <strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
                   }
