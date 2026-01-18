import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRegistrations } from "../api/eventRegsiter.api";

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-500">
                Loading registered users...
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border p-6">
                
                {/* Header */}
                <h1 className="text-2xl font-semibold text-purple-600 mb-2">
                    Registered Users
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Total registrations: {registrations.length}
                </p>

                {/* Empty State */}
                {registrations.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No users have registered yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {registrations.map((reg) => (
                            <div
                                key={reg.registration_id}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 border rounded-xl hover:shadow-sm transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {reg.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {reg.email}
                                    </p>
                                </div>

                                <span
                                    className={`text-sm px-3 py-1 rounded-full w-fit
                                        ${
                                            reg.status === "registered"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {reg.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
