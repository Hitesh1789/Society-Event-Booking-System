import { useEffect, useState } from "react";
import { getMyRegisterations, registerEvent, cancelRegistration } from "../api/eventRegsiter.api";
import { EventCard } from "../components";
import { Ticket,Loader2 } from "lucide-react";
export default function MyEvents() {
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch registrations
    const fetchMyRegistrations = async () => {
        try {
            setLoading(true);
            const response = await getMyRegisterations();
            setMyRegistrations(response.data.data.getMyRegisterations);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    // format date
    const getDate = (apiDate) => {
        return new Date(apiDate).toLocaleDateString("en-IN");
    };

    // show cancel button only if registered
    const showCancelRegButton = (eventId) => {
        return myRegistrations.some(
            (event) =>
                event.event_id === eventId &&
                event.registration_status === "registered"
        );
    };

    // register event
    const handleRegister = async (eventId) => {
        await registerEvent(eventId);
        fetchMyRegistrations();
    };

    // cancel registration
    const handleCancel = async (eventId) => {
        await cancelRegistration(eventId);
        fetchMyRegistrations();
    };

    const showFeedbackButton = (eventId) => {
        //feedback button for only completed events and registered user
        return myRegistrations.some(
            (event) =>
                event.event_id === eventId &&
                event.event_status === "completed"
        );
    }

    const showEventSummaryButton = (eventId) => {
        //feedback button for only completed events 
        return myRegistrations.some(
            (event) =>
                event.event_id === eventId &&
                event.event_status === "completed"
        );
    }

    return (
        <div className="p-2 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold mb-4">
                Your registered events
            </h1>

            {/* LOADING */}
            {loading && (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Loading your events...</p>
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && myRegistrations.length === 0 && (
                <div className="flex min-h-[60vh] items-center justify-center px-4">
                    <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                            <Ticket className="h-7 w-7" />
                        </div>

                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            No Events Registered
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            You haven’t registered for any events yet.
                            Explore events and join the ones you like.
                        </p>
                    </div>
                </div>
            )}

            {/* EVENT LIST */}
            {!loading && myRegistrations.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {myRegistrations.map((event) => (
                        <EventCard
                            key={event.event_id}
                            eventId={event.event_id}
                            title={event.event_name}
                            status={event.event_status}
                            date={getDate(event.date)}
                            venue={event.location}
                            showRegister={false}
                            showCancelRegister={showCancelRegButton(event.event_id)}
                            registrationStatus={event.registration_status}
                            onCancel={handleCancel}
                            onRegister={handleRegister}
                            showFeedbackButton={showFeedbackButton(event.event_id)}
                            showEventSummaryButton={showEventSummaryButton(event.event_id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );

} 