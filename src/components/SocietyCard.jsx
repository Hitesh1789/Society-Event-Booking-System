import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CalendarDays, Award, KeyRound, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { joinSociety } from "../api/society.api"

function SocietyCard({
  category = "Category",
  description,
  socName,
  president,
  members,
  events = 0,
  isMember = false,
  onJoinSuccess, // refresh callback from parent
}) {
  const [open, setOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const joinHandler = async () => {
    if (!joinCode.trim()) {
      setError("Join code is required")
      return
    }

    try {
      setLoading(true)
      setError("")
      await joinSociety({join_code:joinCode})
      setOpen(false)
      setJoinCode("")
      onJoinSuccess?.() // refresh societies
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid join code. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* CARD */}
      <Card className="p-3 rounded-2xl border hover:shadow-md w-70">
        <CardContent className="space-y-4">
          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm px-3 py-1 rounded-full border bg-white">
              {category}
            </span>
          </div>

          <h2 className="text-xl font-semibold">{socName}</h2>

          <p className="text-gray-600">{description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {members} members
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> {events} events
            </span>
          </div>

          <p className="text-sm">
            <span className="font-semibold">President:</span> {president}
          </p>

          <div className="pt-2">
            {isMember ? (
              <Button
                variant="outline"
                className="w-full text-purple-600 border-purple-300"
              >
                <Award className="h-4 w-4 mr-2" /> Member
              </Button>
            ) : (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setOpen(true)}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Join Society
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* JOIN DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Join {socName}</DialogTitle>
            <DialogDescription>
              Enter the join code provided by the society president.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Enter join code"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value)
              setError("")
            }}
          />

          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          <DialogFooter>
            <Button
              onClick={joinHandler}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SocietyCard
