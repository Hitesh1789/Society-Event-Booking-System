import { Button, EventCard } from "../components";
import { getAllUpcomingEvents } from "../api/events.api";
import { useState, useEffect } from "react";
function Home() {
    const [events, setEvents] = useState([]);

    const events2 = [{ //delete
        id:"122",
        title: "Tech Talk: AI in Healthcare"
        ,status: "Completed",
        society_name: "Tech Society",
        date: "Nov 15, 2025",
        time: "14:00",
        venue: "Auditorium A",
    },
    {   
        id:"123",
        title: "Tech Talk: AI in Jobs"
        ,status: "Completed",
        society_name: "Tech Society",
        date: "Nov 15, 2025",
        time: "14:00",
        venue: "Auditorium A",
    }
    ]


    useEffect(() => {
        try {
            (async () => {
                const fetchedEvents = await getAllUpcomingEvents()
                setEvents(fetchedEvents.data.data);
            })()
            setEvents(events2) //change
        }
        catch (error) {
            console.log("Error in fetching events: ", error);
        }
    }, [])
    return (
        <div className="flex">
            <div className="flex-1 p-2">
                <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
                <div className="flex flex-wrap gap-3">
                    {
                        events.map((event) => (
                            <EventCard key={event.id}
                                title={event.title}
                                status={event.status}
                                societyName={event.society_name}
                                date={event.date}
                                time={11} //change
                                venue={event.location}
                                registered={45} //change
                                totalSeats={100} //change
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Home;