import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
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
  onCancel,
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const society = userData?.societies?.find(
      (s) => s.society_name === societyName
    );
    if (society) {
      setIsAdmin(["lead", "president"].includes(society.society_role));
      setIsMember(["lead", "president", "member"].includes(society.society_role));
    }
  }, [societyName, userData?.societies]);

  const statusStyle = {
    published: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <Card className="rounded-2xl p-4  shadow-sm">

      {/* Title + Status */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-purple-600">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{societyName}</p>

        {status && (
          <Badge className={`w-fit rounded-full ${statusStyle[status]}`}>
            {status}
          </Badge>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        {date && (
          <div className="flex items-center gap-2">
            <Calendar size={16} /> {date}
          </div>
        )}
        {venue && (
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {venue}
          </div>
        )}
      </div>

      {/* Registration Status */}
      {registrationStatus && (
        <Badge variant="secondary" className="rounded-full">
          Registration: {registrationStatus}
        </Badge>
      )}

      {/* Primary Action */}
      <div className="flex flex-col gap-2">
        {showRegister && status !== "completed" && (
          <Button
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700"
            onClick={() => onRegister(eventId)}
          >
            Register
          </Button>
        )}

        {showCancelRegister && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onCancel(eventId)}
          >
            Cancel Registration
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={() => navigate(`/event/${eventId}`)}
        >
          View Details
        </Button>
      </div>

      {/* Secondary / Role Actions */}
      {(isMember || isAdmin) && (
        <div className="flex flex-col gap-2 border-t pt-3">

          {isMember && (
            <Button
              variant="secondary"
              className="w-full rounded-xl"
              onClick={() => navigate(`/view-registered-users/${eventId}`)}
            >
              <Users size={16} /> View Registered Users
            </Button>
          )}

          {isAdmin && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/update-event/${eventId}`)}
              >
                Update Event
              </Button>
              <Button
                variant="destructive"
                onClick={() => cancelEvent(eventId)}
              >
                Cancel Event
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => markEventComplete(eventId)}
              >
                Mark Completed
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
