import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
export default function MySocietyCard({
  societyId,
  societyName,
  role,
  category="Category",
  tagline,
  members,
  upcomingEvents,
  joinedDate
}) {
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-4xl rounded-2xl border bg-background p-6">
      <div className="flex items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          {/* Icon / Avatar */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600 text-white">
            <Users className="h-7 w-7" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{societyName}</h3>

              {role && (
                <Badge className="gap-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-100">
                  {(role=="president") && "👑 President"}
                  {(role=="lead") && "⭐ Lead"}
                  {(role=="member") && "👤 Member"}
                </Badge>
              )}

              {category && (
                <Badge variant="outline" className="rounded-full">
                  {category}
                </Badge>
              )}
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="max-w-xl text-sm text-muted-foreground">
                {tagline}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-muted-foreground">
              {members !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {members} members
                </span>
              )}

              {upcomingEvents !== undefined && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {upcomingEvents} upcoming events
                </span>
              )}

              {joinedDate && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Joined {joinedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="outline"
          className="rounded-xl px-6 text-purple-600 hover:bg-purple-50"
          onClick={()=>navigate(`/society/${societyId}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}
