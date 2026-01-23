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
import { assignPresident, getMembers, joinSociety } from "../api/society.api"
import { useSelector } from "react-redux"
import { toast } from "sonner"

function SocietyCard({
  description,
  socName,
  president,
  members,
  events = 0,
  isMember = false,
  onJoinSuccess,
  socId
}) {
  const [open, setOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [assignOpen, setAssignOpen] = useState(false)
  const [socMembers, setSocMembers] = useState([])
  const [assignLoading, setAssignLoading] = useState(false)

  const userData = useSelector((state) => state.auth.userData)

  const joinHandler = async () => {
    if (!joinCode.trim()) {
      setError("Join code is required")
      return
    }

    try {
      setLoading(true)
      setError("")
      await joinSociety({ join_code: joinCode })
      setOpen(false)
      toast.success("Society Joined successfully 🎉", {
        duration: 2000
      });

      setJoinCode("")
      onJoinSuccess?.()
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid join code. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDialogChange = (state) => {
    setOpen(state)
    if (!state) {
      setJoinCode("")
      setError("")
    }
  }

  const assignPresidentHandler = async () => {
    try {
      setAssignLoading(true)

      const membersRes = await getMembers(socId)
      const membersList = membersRes.data.data.members

      setSocMembers(membersList)
      setAssignOpen(true)

    } catch (error) {
      console.log(error)
    } finally {
      setAssignLoading(false)
    }
  }

  return (
    <>
      <Card className="p-3 rounded-2xl border hover:shadow-md w-70">
        <CardContent className="space-y-4">

          {/* TOP */}
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>

            {userData?.profile?.role === "admin" && !president && (
              <button className="bg-purple-600 text-sm px-3 py-1 rounded-full border text-white cursor-pointer"
                onClick={assignPresidentHandler}>
                Assign President
              </button>
            )}
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
            <span className="font-semibold">President:</span>{" "}
            {president || "Not Assigned"}
          </p>

          <div className="pt-2">
            {isMember ? (
              <Button
                variant="outline"
                className="w-full text-purple-600 border-purple-300"
              >
                <Award className="h-4 w-4 mr-2" />
                Member
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
      <Dialog open={open} onOpenChange={handleDialogChange}>
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

          {error && <p className="text-sm text-red-500">{error}</p>}

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

      {/* ASSIGN PRESIDENT DIALOG */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Assign President</DialogTitle>
            <DialogDescription>
              Select a member to make President
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {socMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between border p-2 rounded-lg"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>

                <Button
                  size="sm"
                  className="cursor-pointer"
                  disabled={assignLoading}
                  onClick={async () => {
                    try {
                      setAssignLoading(true)
                      await assignPresident(socId, { "userId": member.id })
                      setAssignOpen(false)
                      onJoinSuccess?.()
                    } catch (err) {
                      console.log(err)
                    } finally {
                      setAssignLoading(false)
                    }
                  }}
                >
                  Assign
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}

export default SocietyCard
