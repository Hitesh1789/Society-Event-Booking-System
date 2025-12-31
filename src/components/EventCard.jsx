import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function EventCard({
  eventId,
  title,
  status,
  societyName,
  date,
  time,
  venue,
  registered,
  totalSeats,
  showRegister = true,
}) {
  const filledPercent = Math.round((registered / totalSeats) * 100)
  const navigate = useNavigate();
  return (
    <Card className="w-full rounded-2xl border p-6">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg text-purple-500 font-semibold">{title}</h2>
            {status && (
              <Badge variant="secondary" className="text-red-500 rounded-full px-3">
                {status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{societyName}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showRegister && status !== "Completed" && (
            <Button
              className="rounded-xl bg-purple-600 px-6 hover:bg-purple-700"
              onClick={()=>navigate(`/event-register/${eventId}`)}
            >
              Register
            </Button>
          )}
          <Button variant="outline" className="rounded-xl" onClick={()=>navigate(`/event/${eventId}`)}>
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
        {time && (
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> {time}
          </span>
        )}
        {venue && (
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" /> {venue}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {registered} / {totalSeats} registered
          </span>
          <span>{filledPercent}% filled</span>
        </div>
        <Progress value={filledPercent} className="h-2 rounded-full" />
      </div>
    </Card>
  )
}