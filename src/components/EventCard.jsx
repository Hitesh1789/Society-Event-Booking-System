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
import { Calendar, MapPin, Users, Eye, Pencil, XCircle, CheckCircle2, Star, FileText } from "lucide-react";
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
  const [rating, setRating] = useState(1)
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
        setIsMember(["member", "lead", "president"].includes(society.society_role));
      }
    })()

  }, [eventId, userData?.societies]);

  const statusStyle = {
    published: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  }

  const refreshEvents = async () => {
    const fetchedEvents = await getAllUpcomingEvents();
    if (fetchedEvents.data.data) {
      dispatch(addEvents({ events: fetchedEvents.data.data }))
    }
    else {
      dispatch(clearEvents())
    }
  }

  return (
    <>
      <Card className="group flex h-full w-full flex-col gap-4 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-base font-semibold leading-tight text-foreground sm:text-lg">
              {title}
            </h2>
            {societyName && (
              <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                {societyName}
              </p>
            )}
          </div>

          {status && (
            <Badge
              className={`shrink-0 rounded-md border-0 px-2 py-0.5 text-xs capitalize ${statusStyle[status]}`}
            >
              {status}
            </Badge>
          )}
        </div>

        {/* Meta Info */}
        {(date || venue) && (
          <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
            {date && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="truncate">{date}</span>
              </div>
            )}

            {venue && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="truncate">{venue}</span>
              </div>
            )}
          </div>
        )}

        {registrationStatus && (
          <Badge
            variant="secondary"
            className="w-fit rounded-md text-xs capitalize"
          >
            {registrationStatus}
          </Badge>
        )}

        {/* Actions: pushed to the bottom so cards in a grid line up */}
        <div className="mt-auto flex flex-col gap-3">

          {/* Main actions */}
          <div className="flex flex-wrap gap-2">
            {showRegister && status !== "completed" && (
              <Button
                size="sm"
                className="min-w-[110px] flex-1 rounded-lg"
                onClick={() => onRegister(eventId)}
              >
                Register
              </Button>
            )}

            {showCancelRegister && (
              <Button
                size="sm"
                variant="outline"
                className="min-w-[110px] flex-1 rounded-lg"
                onClick={() => onCancel(eventId)}
              >
                Cancel
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              className="min-w-[110px] flex-1 rounded-lg"
              onClick={() => navigate(`/event/${eventId}`)}
            >
              <Eye size={14} className="mr-1" />
              View Details
            </Button>
          </div>

          {/* Extra Buttons */}
          {(showFeedbackButton || showEventSummaryButton) && (
            <div className="flex flex-wrap gap-2">
              {showFeedbackButton && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="min-w-[110px] flex-1 rounded-lg"
                  onClick={() => setOpen(true)}
                >
                  <Star size={14} className="mr-1" />
                  Give Feedback
                </Button>
              )}

              {showEventSummaryButton && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="min-w-[110px] flex-1 rounded-lg"
                  onClick={() => navigate(`/event-summary/${eventId}`)}
                >
                  <FileText size={14} className="mr-1" />
                  Event Summary
                </Button>
              )}
            </div>
          )}

          {/* Member Actions */}
          {isMember && (
            <div className="border-t pt-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => navigate(`/view-registered-users/${eventId}`)}
              >
                <Users size={14} className="mr-1" />
                Users
              </Button>
            </div>
          )}

          {/* Lead / President Actions */}
          {isLeadOrPresident && (
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button
                size="sm"
                variant="outline"
                className="min-w-[90px] flex-1 rounded-lg"
                onClick={() => navigate(`/update-event/${eventId}`)}
              >
                <Pencil size={14} className="mr-1" />
                Update
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="min-w-[90px] flex-1 rounded-lg"
                onClick={async () => {
                  try {
                    await cancelEvent(eventId)
                    toast.success("Event cancelled Successfully", {
                      duration: 2000,
                    });
                    await refreshEvents();
                  } catch (error) {
                    toast.error("Something went wrong! ", {
                      duration: 2000,
                      description: error?.response?.data?.message || "Something went wrong. Try again."
                    })
                  }
                }}
              >
                <XCircle size={14} className="mr-1" />
                Cancel
              </Button>

              <Button
                size="sm"
                className="min-w-[90px] flex-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                onClick={async () => {
                  try {
                    await markEventComplete(eventId);
                    toast.success("Marked as completed");
                    await refreshEvents();
                  } catch {
                    toast.error("Action failed");
                  }
                }}
              >
                <CheckCircle2 size={14} className="mr-1" />
                Complete
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
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

          {error && <p className="text-sm text-destructive">{error}</p>}

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
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}