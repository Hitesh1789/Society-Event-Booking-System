import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CalendarDays, Award, KeyRound } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

function SocietyCard({
  category="category",
  description,
  socName,
  president,
  members,
  events=0,
  isMember=false,
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* CARD */}
      <Card className="p-3 rounded-2xl hadow-sm border hover:shadow-md w-70">
        <CardContent className="space-y-4">

          {/* Top Badge + Icon */}
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>

            <span className="text-sm px-3 py-1 rounded-full border bg-white">
              {category}
            </span>
          </div>

          {/* Society Title */}
          <h2 className="text-xl font-semibold">{socName}</h2>

          {/* Description */}
          <p className="text-gray-600 leading-snug">
            {description}
          </p>

          {/* Members + Events */}
          <div className="flex items-center gap-6 text-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {members} members
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> {events} events
            </div>
          </div>

          <hr />

          {/* President */}
          <p className="text-sm">
            <span className="font-semibold">President:</span> {president}
          </p>

          {/* Buttons Section */}
          <div className="flex gap-3 pt-2">
            {isMember ? (
              <>
                <Button variant="outline" className="flex items-center gap-2 text-purple-600 border-purple-300">
                  <Award className="h-4 w-4" />
                  Member
                </Button>

                <Button variant="outline" className="border-red-300 text-red-600">
                  Leave
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                onClick={() => setOpen(true)} //Todo
              >
                <KeyRound className="h-4 w-4" />
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
              Enter the join code provided by the society president to become a member.
            </DialogDescription>
          </DialogHeader>

          <Input placeholder="Enter join code..." />

          <DialogFooter>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SocietyCard;