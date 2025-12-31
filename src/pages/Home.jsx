import { Button, EventCard } from "../components";
import { getAllUpcomingEvents } from "../api/events.api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEvents, addEvents } from "../store/eventSlice";

function Home() {
    const events = useSelector((state)=>state.event.events);
    const dispatch = useDispatch();

    function getDate(apiDate){
        const date = new Date(apiDate); 
        const formattedDate = date.toLocaleDateString('en-IN');
        return  formattedDate;
    }

    useEffect(() => {
        if (events.length > 0) return   // STOP API CALL
        (async () => {
            try {
                const fetchedEvents = await getAllUpcomingEvents();
                if (fetchedEvents.data.data) {
                    dispatch(addEvents({events : fetchedEvents.data.data}))
                }
                else {
                    dispatch(clearEvents())
                }
            }
            catch (error) {
                console.log("Error while fetching all socities: ", error)
            }
        })();
    },[events.length])
    
    return (
        <div className="flex">
            <div className="flex-1 p-2">
                <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
                <div className="flex flex-wrap gap-3">
                    {   
                        events.map((event) => (
                            <EventCard key={event.id}
                                eventId={event.id}
                                title={event.name}
                                status={event.status}
                                societyName={event.society_name}
                                date={getDate(event.date)}
                                // time={11} //change
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