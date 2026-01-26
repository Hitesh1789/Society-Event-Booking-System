import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  cancelEvent,
  markEventComplete,
  getAllUpcomingEvents,
  getEventInfo,
} from "../api/events.api";
import { addEvents, clearEvents } from "../store/eventSlice";

export default function EventCard({
  eventId,
  title,
  status,
  date,
  venue,
  showRegister = true,
  onRegister,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [event, setEvent] = useState(null);
  const [isLead, setIsLead] = useState(false);
  const [isMember, setIsMember] = useState(false);

  /* ---------------- Fetch Event Info ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getEventInfo(eventId);
        setEvent(res.data.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [eventId]);

  /* ---------------- Role Detection ---------------- */
  useEffect(() => {
    if (!userData?.societies || !event) return;

    const society = userData.societies.find(
      (s) => Number(s.society_id) === Number(event.society_id)
    );

    if (society) {
      setIsLead(["lead", "president"].includes(society.society_role));
      setIsMember(["lead", "president", "member"].includes(society.society_role));
    }
  }, [event, userData]);

  const statusColor = {
    published: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <Card className="rounded-3xl p-5 shadow-md hover:shadow-lg transition bg-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{event?.society_name}</p>
        </div>

        <Badge className={`text-white ${statusColor[status]}`}>
          {status}
        </Badge>
      </div>

      {/* Meta */}
      <div className="mt-4 flex gap-6 text-sm text-gray-600">
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

      {/* Primary Action */}
      <div className="mt-6 space-y-2">
        <Button
          className="w-full rounded-xl bg-purple-600 hover:bg-purple-700"
          onClick={() => navigate(`/event/${eventId}`)}
        >
          View Event
        </Button>

        {showRegister && status !== "completed" && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onRegister(eventId)}
          >
            Register
          </Button>
        )}
      </div>

      {/* Member Section */}
      {isMember && (
        <div className="mt-5 border-t pt-4">
          <Button
            variant="ghost"
            className="w-full flex justify-start gap-2 text-gray-700"
            onClick={() => navigate(`/view-registered-users/${eventId}`)}
          >
            <Users size={18} /> View Registered Users
          </Button>
        </div>
      )}

      {/* Lead Section */}
      {isLead && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/update-event/${eventId}`)}
          >
            Update
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await cancelEvent(eventId);
                toast.success("Event cancelled");
                const fetched = await getAllUpcomingEvents();
                fetched.data.data
                  ? dispatch(addEvents({ events: fetched.data.data }))
                  : dispatch(clearEvents());
              } catch {
                toast.error("Action failed");
              }
            }}
          >
            Cancel
          </Button>

          <Button
            className="col-span-2 bg-green-600 hover:bg-green-700"
            onClick={async () => {
              try {
                await markEventComplete(eventId);
                toast.success("Marked as completed");
                const fetched = await getAllUpcomingEvents();
                fetched.data.data
                  ? dispatch(addEvents({ events: fetched.data.data }))
                  : dispatch(clearEvents());
              } catch {
                toast.error("Action failed");
              }
            }}
          >
            Mark Completed
          </Button>
        </div>
      )}
    </Card>
  );
}
