import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getEventInfo, updateEvent, getAllUpcomingEvents } from "../api/events.api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addEvents, clearEvents } from "../store/eventSlice";
import { toast } from "sonner";
import { CalendarCog, Type, FileText, CalendarDays, MapPin, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default function UpdateEvent() {
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            date: "",
            location: "",
        },
    });
    const { isSubmitting } = form.formState;

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
                    form.reset({
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

    const submit = async (data) => {
        try {
            setApiError("");
            //console.log(data)
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
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading event for updating...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                        <CalendarCog className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Update Event
                    </CardTitle>
                    <CardDescription>
                        Fill in the details below to update the event.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* API Error */}
                    {apiError && (
                        <div className="mb-5 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submit)}
                            className="space-y-5"
                        >
                            {/* Event Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: "Event name is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter event name"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                rules={{ required: "Description is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter event description"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Date */}
                            <FormField
                                control={form.control}
                                name="date"
                                rules={{ required: "Date is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    className="pl-10 dark:[color-scheme:dark]"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Location */}
                            <FormField
                                control={form.control}
                                name="location"
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Location</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter location"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full cursor-pointer bg-purple-600 text-white hover:bg-purple-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Event"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}