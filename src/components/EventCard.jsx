import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { cancelEvent, markEventComplete } from "../api/events.api";
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
  showFeedbackButton = false,
  showEventSummaryButton = false
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState("4")
  const [comment, setComment] = useState("")
  const [isLeadOrPresident, setIsLeadOrPresident] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


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
        duration: 4000
      });

      setOpen(false)
      setComment("")
      setRating(5)
    } catch (err) {
      toast.error("Submission failed ❌", {
        description: err?.response?.data?.message || "Please try again",
        duration: 4000,
      });

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const society = userData?.societies?.find(
      (s) => s.society_name === societyName
    );
    if (society) {
      setIsLeadOrPresident(["lead", "president"].includes(society.society_role));
      setIsMember(["lead", "president", "member"].includes(society.society_role));
    }
  }, [societyName, userData?.societies]);

  const statusStyle = {
    published: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Card className="rounded-2xl p-4  shadow-sm">
        {/* Title + Status */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-purple-700">{title}</h2>
            <p className="text-xs text-muted-foreground">{societyName}</p>
          </div>

          {status && (
            <Badge className={`rounded-full capitalize ${statusStyle[status]}`}>
              {status}
            </Badge>
          )}
        </div>


        {/* Meta Info */}
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={15} /> {date}
            </div>
          )}
          {venue && (
            <div className="flex items-center gap-2">
              <MapPin size={15} /> {venue}
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
        <div className="mt-4 space-y-2">
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
            variant="secondary"
            className="w-full rounded-xl"
            onClick={() => navigate(`/event/${eventId}`)}
          >
            View Details
          </Button>
        </div>

        {/* Secondary / Role Actions */}
        {isMember && (
          <div className="mt-4 border-t pt-3">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => navigate(`/view-registered-users/${eventId}`)}
            >
              <Users size={16} className="mr-2" />
              View Registered Users
            </Button>
          </div>
        )}
        {isLeadOrPresident && (
          <div className="mt-4 border-t pt-3 space-y-2">
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
          </div>
        )}

        {
          showFeedbackButton && (
            <Button
              variant="secondary"
              className="w-full rounded-xl"
              onClick={() => setOpen(true)}
            >
              Give Feedback
            </Button>
          )
        }

        {
          showEventSummaryButton && (
            <Button
              variant="secondary"
              className="w-full rounded-xl"
              onClick={() =>navigate(`/event-summary/${eventId}`)}
            >
              Event Summary
            </Button>
          )
        }
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
