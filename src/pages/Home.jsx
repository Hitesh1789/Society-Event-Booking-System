import { EventCard } from "../components";
import { getAllUpcomingEvents } from "../api/events.api";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEvents, addEvents } from "../store/eventSlice";
import { getMyRegisterations, cancelRegistration, registerEvent } from "../api/eventRegsiter.api";
import { toast } from "sonner";
import { CalendarX, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Home() {
    const events = useSelector((state) => state.event.events);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(true);
    const dispatch = useDispatch();
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [search, setSearch] = useState("");
    const [society, setSociety] = useState("");

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


    // unique society names for the dropdown
    const societyOptions = useMemo(() => {
        const names = events.map((e) => e.society_name).filter(Boolean);
        return [...new Set(names)].sort();
    }, [events]);

    // events that match the search text and the selected society
    const filteredEvents = useMemo(() => {
        const text = search.trim().toLowerCase();
        return events.filter((e) => {
            const matchesName = !text || e.name?.toLowerCase().includes(text);
            const matchesSociety = !society || e.society_name === society;
            return matchesName && matchesSociety;
        });
    }, [events, search, society]);

    const clearFilters = () => {
        setSearch("");
        setSociety("");
    };

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
        <div className="w-full p-2 sm:p-4">

            {/* Page heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-4">
                    Upcoming Events
                </h1>
            </div>



            {/* EVENTS LOADING */}
            {loadingEvents && (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Loading upcoming events...</p>
                </div>
            )}

            {/* EMPTY STATE */}
            {!loadingEvents && events.length === 0 && (
                <div className="flex min-h-[50vh] items-center justify-center px-4">
                    <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                            <CalendarX className="h-7 w-7" />
                        </div>

                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            No Upcoming Events
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            There are no upcoming events at the moment.
                            Please check back later.
                        </p>
                    </div>
                </div>
            )}

            {/* FILTERS */}
            {!loadingEvents && events.length > 0 && (
                <div className="mb-6 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by event name..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30 dark:[color-scheme:dark] cursor-pointer sm:w-56`}
                            value={society}
                            onChange={(e) => setSociety(e.target.value)}
                        >
                            <option value="">All societies</option>
                            {societyOptions.map((name) => (
                                <option key={name} value={name} className="bg-background text-foreground">
                                    {name}
                                </option>
                            ))}
                        </select>

                        {(search || society) && (
                            <Button variant="outline" className="cursor-pointer" onClick={clearFilters}>
                                <X className="mr-1 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Showing {filteredEvents.length} of {events.length} events
                    </p>
                </div>
            )}


            {/* NO MATCH STATE */}
            {!loadingEvents && events.length > 0 && filteredEvents.length === 0 && (
                <div className="flex min-h-[40vh] items-center justify-center px-4">
                    <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                            <Search className="h-7 w-7" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-foreground">No events found</h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Try a different name or society.
                        </p>
                        <Button variant="outline" className="cursor-pointer" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    </div>
                </div>
            )}

            {/* EVENTS LIST */}
            {!loadingEvents && filteredEvents.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredEvents.map((event) => (
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
    );
}

export default Home;