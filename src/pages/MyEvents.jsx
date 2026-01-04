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

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">Your registered events are: </h1>
            {
                myRegistrations.map((event) => (
                    <EventCard
                        key={event.event_id}
                        eventId={event.event_id}
                        title={event.event_name}
                        status={event.event_status}
                        //societyName={event.society_name}
                        date={getDate(event.date)}
                        // time={11} //change
                        venue={event.location}
                        registered={45} //change
                        totalSeats={100} //change
                        showRegister={false}
                        showCancelRegister={showCancelRegButton(event.event_id)}
                        registrationStatus={event.registration_status}
                        onCancel={handleCancel}
                        onRegister = {handleRegister}
                    />
                ))
            }
        </>
    )
} 