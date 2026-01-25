import { EventCard } from "../components";
import { getAllUpcomingEvents } from "../api/events.api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEvents, addEvents } from "../store/eventSlice";
import { getMyRegisterations, cancelRegistration, registerEvent } from "../api/eventRegsiter.api";
import { toast } from "sonner";

function Home() {
    const events = useSelector((state) => state.event.events);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(true);
    const dispatch = useDispatch();
    const [loadingEvents, setLoadingEvents] = useState(true);
    // format date
    const getDate = (apiDate) => {
        return new Date(apiDate).toLocaleDateString("en-IN");
    };

    // fetch registrations
    const fetchMyRegistrations = async () => {
        setLoadingRegs(true);
        const response = await getMyRegisterations();
        setMyRegistrations(response.data.data.getMyRegisterations);
        setLoadingRegs(false);
    };

    useEffect(() => {
        fetchMyRegistrations();
    }, []);
useEffect(() => {
    if (events.length > 0) {
        setLoadingEvents(false);
        return;
    }

    (async () => {
        try {
            setLoadingEvents(true);
            const fetchedEvents = await getAllUpcomingEvents();

            if (fetchedEvents.data.data) {
                dispatch(addEvents({ events: fetchedEvents.data.data }));
            } else {
                dispatch(clearEvents());
            }
        } catch (error) {
            console.log("Error while fetching events: ", error);
        } finally {
            setLoadingEvents(false);
        }
    })();
}, [events.length, dispatch]);


    const showCancelRegButton = (eventId) => {
        if (loadingRegs) return false;
        return myRegistrations.some(
            (event) =>
                event.event_id === eventId &&
                event.registration_status === "registered"
        );
    }

    const showRegisterButton = (eventId) => {
        if (loadingRegs) return false;
        return !myRegistrations.some((event) => event.event_id === eventId);
    }

    // register event
    const handleRegister = async (eventId) => {
        try {
            await registerEvent(eventId);
            toast.success("Registered successfully 🎉", {
                description: "Thank you for registering.",
                duration: 2000
            });
            fetchMyRegistrations();

        } catch (err) {
            toast.error("Registration failed ❌", {
                description: err?.response?.data?.message || "Please try again",
                duration: 2000,
            });

        };
    }

    // cancel registration
    const handleCancel = async (eventId) => {
        try {
            await cancelRegistration(eventId);
            toast.success("Registration Cancelled successfully", {
                description: "",
                duration: 2000
            });
            fetchMyRegistrations();

        } catch (err) {
            toast.error("Cancelation failed ❌", {
                description: err?.response?.data?.message || "Please try again",
                duration: 2000,
            });

        };
    };

    return (
    <div className="flex">
        <div className="flex-1 p-2">

            <h1 className="text-2xl font-semibold mb-4">
                Upcoming Events
            </h1>

            {/* EVENTS LOADING */}
            {loadingEvents && (
                <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
                    Loading upcoming events...
                </div>
            )}

            {/* EMPTY STATE */}
            {!loadingEvents && events.length === 0 && (
                <div className="flex justify-center items-center min-h-[60vh] px-4">
                    <div className="max-w-md text-center rounded-2xl border bg-white p-8 shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            📅
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            No Upcoming Events
                        </h2>

                        <p className="text-sm text-gray-500">
                            There are no upcoming events at the moment.
                            Please check back later.
                        </p>
                    </div>
                </div>
            )}

            {/* EVENTS LIST */}
            {!loadingEvents && events.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            eventId={event.id}
                            title={event.name}
                            status={event.status}
                            societyName={event.society_name}
                            date={getDate(event.date)}
                            venue={event.location}
                            showRegister={showRegisterButton(event.id)}
                            showCancelRegister={showCancelRegButton(event.id)}
                            onCancel={handleCancel}
                            onRegister={handleRegister}
                        />
                    ))}
                </div>
            )}

        </div>
    </div>
);

    
}

export default Home;