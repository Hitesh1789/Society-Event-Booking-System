import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { cancelEvent, markEventComplete } from "../api/events.api";
export default function EventCard({
  eventId,
  title,
  status,
  societyName,
  date,
  venue,
  showRegister = true,
  showCancelRegister = false,
  registrationStatus,
  onRegister,
  onCancel
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData)
  const [isLeadOrPresidsent, setIsLeadOrPresidsent] = useState(false);



  const handleCancel = async () => {
    await cancelEvent(eventId)
    status = 'cancelled'
  }

  const handleMarkComplete = async () => {
    await markEventComplete(eventId)
    status = 'completed'
  }


  useEffect(() => {
    const userSociety = userData.societies.filter((s) => s.society_name == societyName);
    console.log(userSociety[0])
    if (userSociety) {
      setIsLeadOrPresidsent(userSociety[0].society_role == 'lead' || userSociety[0].society_role == 'president')
    }
  }, [societyName, userData.societies])

  return (
    <Card className="w-full rounded-2xl border p-6">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg text-purple-500 font-semibold">{title}</h2>
            {status && (
              <Badge variant="secondary" className="rounded-full px-3">
                Event Status : <span className="text-red-500">{status}</span>
              </Badge>
            )}
            {registrationStatus && (
              <Badge variant="secondary" className="rounded-full px-3">
                Registration Status:  <span className="text-red-500">{registrationStatus}</span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{societyName}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showRegister && status !== "completed" && (
            <Button
              className="cursor-pointer rounded-xl bg-purple-600 px-6 hover:bg-purple-700"
              onClick={() => onRegister(eventId)}
            >
              Register
            </Button>
          )}
          {showCancelRegister && status !== "completed" && (
            <Button
              className="cursor-pointer rounded-xl bg-purple-600 px-6 hover:bg-purple-700"
              onClick={() => onCancel(eventId)}
            >
              Cancel Registration
            </Button>
          )}
          {
            isLeadOrPresidsent && (
              <>
                <Button className="cursor-pointer rounded-xl bg-purple-600 px-6 hover:bg-purple-700" onClick={()=>navigate(`/update-event/${eventId}`)}>Update</Button>
                <Button className="cursor-pointer rounded-xl bg-purple-600 px-6 hover:bg-purple-700" onClick={handleCancel}>Cancel</Button>
                <Button className="cursor-pointer rounded-xl bg-purple-600 px-6 hover:bg-purple-700" onClick={handleMarkComplete}>Mark Complete</Button>
              </>
            )
          }
          <Button variant="outline" className="cursor-pointer rounded-xl" onClick={() => navigate(`/event/${eventId}`)}>
            View Details
          </Button>
        </div>
      </div>


      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
        {date && (
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {date}
          </span>
        )}
        {venue && (
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" /> {venue}
          </span>
        )}
      </div>
    </Card>
  )
}