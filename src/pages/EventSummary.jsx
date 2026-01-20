import { useEffect, useState } from "react";
import { getEventSummary } from "../api/eventFeedback";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function EventSummary() {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getEventSummary(eventId);
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [eventId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading event summary...
      </div>
    );
  }

  const { event, feedback, summary, totalParticipants } = data;

  const statusColor = {
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    published: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-[80vh] p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-purple-700">
          Event Summary Report
        </h1>
        <p className="text-sm text-muted-foreground">
          Detailed overview and feedbacks
        </p>
      </div>

      {/* Event Info */}
      <Card className="rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-sm text-muted-foreground">
              {event.society_name}
            </p>
          </div>

          <Badge className={`capitalize ${statusColor[event.status]}`}>
            {event.status}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString("en-IN")}</p>
          <p><span className="font-medium">Venue:</span> {event.location}</p>
          <p><span className="font-medium">Participants:</span> {totalParticipants}</p>
          <p><span className="font-medium">Total Feedbacks:</span> {summary.total_feedbacks}</p>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <h3 className="text-3xl font-bold text-purple-600">
            ⭐ {summary.avg_rating}
          </h3>
        </Card>

        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total Participants</p>
          <h3 className="text-3xl font-bold text-purple-600">
            👥 {totalParticipants}
          </h3>
        </Card>
      </div>

      {/* Feedback Section */}
      <Card className="rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">User Feedback</h3>

        {feedback.length === 0 ? (
          <p className="text-sm text-gray-500">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((f, index) => (
              <div
                key={index}
                className="rounded-xl border p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{f.user_name}</p>
                  <span className="text-sm text-yellow-600">
                    ⭐ {f.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {f.comment}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(f.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
