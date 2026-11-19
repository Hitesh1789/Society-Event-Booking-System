import { useEffect, useState } from "react";
import { getDraftInfo, getDraftHistory } from "../api/eventDraft.api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { getSocieties } from "../api/society.api";
import { Building2, User, CalendarDays, MapPin, History, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Draft() {
    const { draftId } = useParams();
    const [draftInfo, setDraftInfo] = useState(null);
    const dispatch = useDispatch();
    const societies = useSelector((state) => state.society.societies);
    const society = societies?.filter((s) => s.id == draftInfo?.society_id);

    const getDate = (apiDate) =>
        new Date(apiDate).toLocaleDateString("en-IN");

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
        approved: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
        rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        changes_requested: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    };

    useEffect(() => {
        if (draftInfo) return;
        const fetchDraftInfo = async () => {
            try {
                const res = await getDraftInfo(draftId);
                setDraftInfo(res.data.data.draft);
                const res2 = await getDraftHistory(draftId);
                console.log(res2.data.data.formatedDrafts)

            } catch (error) {
                console.error(error);
            }
        };
        fetchDraftInfo();
    }, [draftId]);


    useEffect(() => {
        if (societies.length > 0) return   // STOP API CALL
        (async () => {
            try {
                const fetchedSocieties = await getSocieties();
                if (fetchedSocieties.data.data) {
                    dispatch(addSocieties({ societies: fetchedSocieties.data.data.societies }))
                }
                else {
                    dispatch(clearSocieties())
                }
            }
            catch (error) {
                console.log("Error while fetching all socities: ", error)
            }
        })();
    }, [societies.length])

    if (!draftInfo) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading draft details...</p>
            </div>
        );
    }

    // details shown in the grid below the description
    const details = [
        { label: "Society", value: society?.[0]?.name || "—", icon: Building2 },
        { label: "Drafted By", value: draftInfo.drafted_by, icon: User },
        { label: "Proposed Date", value: getDate(draftInfo.proposed_date), icon: CalendarDays },
        { label: "Proposed Location", value: draftInfo.proposed_location, icon: MapPin },
    ];

    return (
        <div className="flex justify-center px-4 py-6">
            <Card className="w-full max-w-3xl shadow-lg">

                {/* Header */}
                <CardHeader>
                    <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row">
                        <div className="min-w-0">
                            <CardTitle className="break-words text-2xl font-bold sm:text-3xl">
                                {draftInfo.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Event draft details
                            </CardDescription>
                        </div>

                        <span
                            className={`shrink-0 rounded-full px-4 py-1 text-xs font-semibold tracking-wide ${statusColor[draftInfo.status] || "bg-muted text-muted-foreground"}`}
                        >
                            {draftInfo.status.replace("_", " ").toUpperCase()}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Description */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                            Description
                        </h3>
                        <p className="leading-relaxed text-foreground">
                            {draftInfo.description}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {details.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 rounded-xl bg-muted/50 p-4"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="break-words text-sm font-medium text-foreground">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}