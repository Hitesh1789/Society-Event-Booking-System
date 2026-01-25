import { useEffect, useState } from "react";
import { getMyRegisterations, registerEvent, cancelRegistration } from "../api/eventRegsiter.api";
import { EventCard } from "../components";
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
                <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
                    Loading your events...
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && myRegistrations.length === 0 && (
                <div className="flex justify-center items-center min-h-[60vh] px-4">
                    <div className="max-w-md text-center rounded-2xl border bg-white p-8 shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            🎟️
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            No Events Registered
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            You haven’t registered for any events yet.
                            Explore events and join the ones you like.
                        </p>
                    </div>
                </div>
            )}

            {/* EVENT LIST */}
            {!loading && myRegistrations.length > 0 && (
                <div className="flex flex-col gap-4">
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