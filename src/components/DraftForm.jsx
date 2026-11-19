import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FilePlus2, Type, FileText, CalendarDays, MapPin, Loader2, AlertCircle } from "lucide-react";

import { createEventDraft, getDrafts } from "../api/eventDraft.api";
import { getUser } from "../api/user.api";
import { updateUser } from "../store/authSlice";

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

// same look as the shadcn Input, used for the native select boxes
const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30 dark:[color-scheme:dark] cursor-pointer";

export default function DraftForm() {
    const form = useForm({
        defaultValues: {
            societyId: "",
            title: "",
            description: "",
            proposedDate: "",
            proposedLocation: "",
            parentDraftId: "",
        },
    });
    const { isSubmitting } = form.formState;

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const selectedSocietyId = form.watch("societyId");
    const [apiError, setApiError] = useState("");
    const [mySelectedSocietyDrafts, setMySelectedSocietyDrafts] = useState([]);
    const mySocieties = userData?.societies?.filter((s) => s.society_role == 'lead') || [];
    const dispatch = useDispatch();

    const createDraft = async (data) => {
        try {
            setApiError("");
            const {
                title,
                description,
                proposedDate,
                proposedLocation,
                societyId,
                parentDraftId,
            } = data;


            const res = {
                title,
                description,
                proposedDate,
                proposedLocation,
                societyId: Number(societyId)
            }
            if (parentDraftId && parentDraftId !== "") res.parentDraftId = Number(parentDraftId)
            console.log(res)
            await createEventDraft(res);
            toast.success("Draft Created Successfully", {
                duration: 2000
            })
            const user = await getUser();
            dispatch(updateUser({ newUserData: user.data.data }))
            navigate('/drafts')
        } catch (err) {
            setApiError(
                err?.response?.data?.message ||
                "Something went wrong while creating the draft"
            );
        }
    };

    useEffect(() => {
        if (!userData?.societies?.length) return;
        const fetchDrafts = async () => {
            try {
                const draftsPerSociety = await Promise.all(
                    userData.societies.map((s) =>
                        getDrafts(s.society_id).then(
                            (res) => res.data.data.drafts
                        )
                    )
                );

                // draftsPerSociety = [ [..], [..], [..] ]
                const Drafts = draftsPerSociety.flat().filter((d) => Number(d.society_id) === Number(selectedSocietyId) && (d.status == 'changes_requested' || d.status == 'rejected'));
                setMySelectedSocietyDrafts(Drafts);
                console.log(mySelectedSocietyDrafts)
            } catch (error) {
                console.error(error);
            }
        };

        fetchDrafts();
    }, [userData, selectedSocietyId]);

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                        <FilePlus2 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Create Event Draft
                    </CardTitle>
                    <CardDescription>
                        Submit an event idea for approval by selecting a society.
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
                        <form onSubmit={form.handleSubmit(createDraft)} className="space-y-5">

                            {/* Society */}
                            <FormField
                                control={form.control}
                                name="societyId"
                                rules={{ required: "Society is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Society</FormLabel>
                                        <FormControl>
                                            <select className={selectClass} {...field}>
                                                <option value="">Select a society</option>
                                                {mySocieties.map((s) => (
                                                    <option
                                                        key={s.society_id}
                                                        value={s.society_id}
                                                        className="bg-background text-foreground"
                                                    >
                                                        {s.society_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                rules={{ required: "Title is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Draft Title</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter event title"
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
                                                    placeholder="Brief event description"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date */}
                            <FormField
                                control={form.control}
                                name="proposedDate"
                                rules={{ required: "Proposed date is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Proposed Date</FormLabel>
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

                            {/* Location */}
                            <FormField
                                control={form.control}
                                name="proposedLocation"
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Proposed Location</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Eg: Main Auditorium"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Parent Draft */}
                            {selectedSocietyId && mySelectedSocietyDrafts.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="parentDraftId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Draft</FormLabel>
                                            <FormControl>
                                                <select className={selectClass} {...field}>
                                                    <option value="">Start New Draft (No Parent)</option>
                                                    {mySelectedSocietyDrafts.map((d) => (
                                                        <option
                                                            key={d.id}
                                                            value={d.id}
                                                            className="bg-background text-foreground"
                                                        >
                                                            {d.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full cursor-pointer bg-purple-600 text-white hover:bg-purple-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Draft...
                                    </>
                                ) : (
                                    "Create Draft"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}