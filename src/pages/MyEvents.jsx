import { useEffect, useState } from "react";
import { getMyRegisterations, registerEvent, cancelRegistration } from "../api/eventRegsiter.api";
import { EventCard } from "../components";
export default function MyEvents() {
    const [myRegistrations, setMyRegistrations] = useState([]);

    // fetch registrations
    const fetchMyRegistrations = async () => {
        const response = await getMyRegisterations();
        setMyRegistrations(response.data.data.getMyRegisterations);
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
            <h1 className="text-2xl font-semibold mb-4">Your registered events are: </h1>
            {
                myRegistrations.map((event) => (
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
                ))
            }
        </div>
    )
} 