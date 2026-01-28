import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { cancelEvent, markEventComplete, getAllUpcomingEvents, getEventInfo } from "../api/events.api";
import { submitEventFeedback } from "../api/eventFeedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import StarRating from "../components/StarRating";
import { toast } from "sonner";
import { addEvents, clearEvents } from "../store/eventSlice";
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventCard({
  eventId,
  title,
  status,
  date,
  venue,
  showRegister = true,
  showCancelRegister = false,
  registrationStatus,
  onRegister,
  onCancel,
  showFeedbackButton = false,
  showEventSummaryButton = false
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState("4")
  const [comment, setComment] = useState("")
  const [isMember, setIsMember] = useState(false);
  const [isLeadOrPresident, setIsLeadOrPresident] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch();
  const [societyName, setSocietyName] = useState("");

  const handleFeedback = async () => {
    if (!rating) {
      setError("Rating is required")
      return
    }
    try {
      setLoading(true)
      setError("")
      await submitEventFeedback(eventId, {
        rating: Number(rating),
        comment
      })

      toast.success("Feedback submitted successfully 🎉", {
        description: "Thank you for sharing your experience",
        duration: 2000
      });

      setOpen(false)
      setComment("")
      setRating(5)
    } catch (err) {
      toast.error("Submission failed ❌", {
        description: err?.response?.data?.message || "Please try again",
        duration: 2000,
      });

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    (async () => {
      const societyname = (await getEventInfo(eventId)).data.data.society_name;
      setSocietyName(societyname)

      const society = userData?.societies?.find(
        (s) => s.society_name === societyname
      );

      if (society) {
        setIsLeadOrPresident(["lead", "president"].includes(society.society_role));
        setIsMember(["memeber", "lead", "president"].includes(society.society_role));
      }
    })()

  }, [eventId, userData?.societies]);

  const statusStyle = {
    published: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <>
      <Card className="inline-flex flex-col 
    gap-3
    rounded-xl 
    border 
    bg-white 
    p-4 
    shadow-sm 
    hover:shadow-md 
    transition-all">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {societyName}
            </p>
          </div>

          {status && (
            <Badge
              className={`capitalize px-2 py-0.5 text-xs rounded-md ${statusStyle[status]}`}
            >
              {status}
            </Badge>
          )}
        </div>

        {/* Meta Info */}
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={13} />
              <span>{date}</span>
            </div>
          )}

          {venue && (
            <div className="flex items-center gap-2">
              <MapPin size={13} />
              <span>{venue}</span>
            </div>
          )}
        </div>

        {registrationStatus && (
          <Badge
            variant="secondary"
            className="w-fit text-xs rounded-md"
          >
            {registrationStatus}
          </Badge>
        )}


        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          {showRegister && status !== "completed" && (
            <Button
              size="sm"
              className="rounded-lg px-3"
              onClick={() => onRegister(eventId)}
            >
              Register
            </Button>
          )}

          {showCancelRegister && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg px-3"
              onClick={() => onCancel(eventId)}
            >
              Cancel
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            className="rounded-lg px-3"
            onClick={() => navigate(`/event/${eventId}`)}
          >
            View Details
          </Button>
        </div>

        {/* Member Actions */}
        {isMember && (
          <div className="mt-4 text-center border-t pt-3">
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg px-3"
              onClick={() => navigate(`/view-registered-users/${eventId}`)}
            >
              <Users size={14} className="mr-1" />
              Users
            </Button>
          </div>
        )}

        {/* Lead / President Actions */}
        {isLeadOrPresident && (
          <div className="flex flex-wrap gap-2 pt-2 border-t justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/update-event/${eventId}`)}
            >
              Update
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                try {
                  await cancelEvent(eventId)
                  toast.success("Event cancelled Successfully", {
                    duration: 2000,
                  });
                  const fetchedEvents = await getAllUpcomingEvents();
                  if (fetchedEvents.data.data) {
                    dispatch(addEvents({ events: fetchedEvents.data.data }))
                  }
                  else {
                    dispatch(clearEvents())
                  }

                } catch (error) {
                  toast.error("Something went wrong! ", {
                    duration: 2000,
                    description: error?.response?.data?.message || "Something went wrong. Try again."
                  })
                }
              }
              }
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
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
              Complete
            </Button>
          </div>
        )}

        {/* Extra Buttons */}
        {showFeedbackButton && (
          <div className="mt-1">
            <Button
              size="sm"
              variant="secondary"
              className="w-full rounded-lg"
              onClick={() => setOpen(true)}
            >
              Give Feedback
            </Button>
          </div>
        )}

        {showEventSummaryButton && (
          <div>
            <Button
              size="sm"
              variant="secondary"
              className="w-full rounded-lg"
              onClick={() => navigate(`/event-summary/${eventId}`)}
            >
              Event Summary
            </Button>
          </div>
        )}
      </Card>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Rate this Event</DialogTitle>
          </DialogHeader>

          <StarRating
            value={rating}
            onChange={(val) => {
              setRating(val)
              setError("")
            }}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Input
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              setError("")
            }}
          />

          <DialogFooter>
            <Button
              onClick={handleFeedback}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>
    </>

  );
}
