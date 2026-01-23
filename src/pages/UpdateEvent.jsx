import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input, Button } from "../components";
import { getEventInfo, updateEvent } from "../api/events.api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addEvents, clearEvents } from "../store/eventSlice";
import { getAllUpcomingEvents } from "../api/events.api";
import { toast } from "sonner";
export default function UpdateEvent() {
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (eventId) {
                    const res = await getEventInfo(eventId);
                    const eventData = res.data.data;

                    // Convert date to YYYY-MM-DD
                    const formattedDate = eventData.date
                        ? new Date(eventData.date).toISOString().split("T")[0]
                        : "";
                    reset({
                        name: eventData.name,
                        description: eventData.description,
                        date: formattedDate,
                        location: eventData.location,
                    });
                };
            } catch (error) {
                console.log("Error in fetching eventInfo:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [eventId])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm();
    const navigate = useNavigate()
    const [apiError, setApiError] = useState("");
    const dispatch = useDispatch()

    const submit = async (data) => {
        try {
            setApiError("");
            console.log(data)
            await updateEvent(eventId, data);
            toast.success("Event updated Successfully", {
                duration: 2000,
            });
            const fetchedEvents = await getAllUpcomingEvents();
            if (fetchedEvents.data.data) {
                dispatch(addEvents({ events: fetchedEvents.data.data }))
            }
            else {
                dispatch(clearEvents())
            }
            navigate('/')

        } catch (error) {
            setApiError(
                error?.response?.data?.message || "Something went wrong. Try again."
            );
        }
    };

    if (loading) {
        return (
            <>Loading Event for upadting... </>
        )
    }
    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm bg-white">
                <h1 className="text-2xl font-semibold text-purple-600 mb-4">
                    Update Event
                </h1>

                <p className="text-sm text-muted-foreground mb-6">
                    Fill in the details below to update the event.
                </p>

                {/* API Error */}
                {apiError && (
                    <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm p-3">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    {/* Event Name */}
                    <div>
                        <Input
                            label="Event name"
                            placeholder="Enter event name"
                            {...register("name", { required: "Event name is required" })}

                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Input
                            label="Description"
                            placeholder="Enter event description"
                            {...register("description", {
                                required: "Description is required",
                            })}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Event Date */}
                    <div>
                        <Input
                            type="date"
                            label="Event Date"
                            placeholder="Enter date"
                            {...register("date", {
                                required: "Date is required",
                            })}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    {/* Event Location */}
                    <div>
                        <Input
                            label="Event Location"
                            placeholder="Enter location"
                            {...register("location", {
                                required: "Location is required",
                            })}
                        />
                        {errors.location && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.location.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-2 text-white-700"
                    >
                        {isSubmitting ? "Updating..." : "Update Event"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
