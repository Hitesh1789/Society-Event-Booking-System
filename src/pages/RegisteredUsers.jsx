import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Mail, Loader2, UserX } from "lucide-react";
import { getRegistrations } from "../api/eventRegsiter.api";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

export default function RegisteredUsers() {
    const { eventId } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getRegistrations(eventId);
                setRegistrations(res.data.data.registrations);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [eventId]);

    // first letter of the name, shown inside the round avatar
    const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading registered users...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4 py-6">
            <Card className="w-full max-w-4xl shadow-md">
                {/* Header */}
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-2xl font-bold">
                                Registered Users
                            </CardTitle>
                            <CardDescription>
                                Total registrations: {registrations.length}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Empty State */}
                    {registrations.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <UserX className="h-7 w-7" />
                            </div>
                            <p className="text-sm">No users have registered yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {registrations.map((reg) => (
                                <div
                                    key={reg.registration_id}
                                    className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition hover:bg-accent/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        {/* Avatar with initial */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                                            {getInitial(reg.name)}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">
                                                {reg.name}
                                            </p>
                                            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{reg.email}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <Badge
                                        className={`w-fit rounded-full border-0 px-3 py-1 text-xs font-medium capitalize ${
                                            reg.status === "registered"
                                                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                        }`}
                                    >
                                        {reg.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}