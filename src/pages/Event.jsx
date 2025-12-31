import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEventInfo } from "../api/events.api"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Share2, Mail } from "lucide-react"

export default function Event() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventId) {
          const res = await getEventInfo(eventId)
          setEvent(res.data.data)
          console.log(res.data.data)
        }
      } catch (error) {
        console.log("Error in fetching eventInfo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return <div className="p-6">Loading event details...</div>
  }

  if (!event) {
    return <div className="p-6">Event not found</div>
  }

  const dateObj = new Date(event.date)

  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  //check
  const time = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700">{event.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {event.society_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button onClick={()=>navigate(`/event-register/${eventId}`)}>Register</Button>
        </div>
      </div>

      {/* About */}
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">About This Event</h2>
        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>
      </Card>

      {/* Event Info */}
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">Event Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            {time}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
        </div>
      </Card>

      {/* Organizer */}
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">Organizer</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Approved By:</span>{" "}
            {event.approved_by_name}
          </p>
          <p className="flex items-center gap-2">
          </p>
          {/* redirect to email if want */}
          <Button variant="outline" className="mt-2"> 
            Contact Organizer
          </Button>
        </div>
      </Card>
    </div>
  )
}
