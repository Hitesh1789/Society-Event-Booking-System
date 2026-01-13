import { useEffect, useState } from "react";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DraftCard } from "../components/index";

export default function Drafts() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [mySocietyPendingDrafts, setMySocietyPendingDrafts] = useState([]);

    const isLead = userData?.societies?.some(
        (s) => s.society_role === "lead"
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) return;
        setMySocietyPendingDrafts(userData.pendingDrafts || []);
        setLoading(false);
    }, [userData]);

    return (
        <div className="min-h-[80vh]  px-6 py-8">
            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200" />
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-purple-700">
                        Pending Event Drafts
                    </h1>
                </div>

                {isLead && (
                    <Button
                        classname="h-11 rounded-xl bg-purple-600 px-6 text-white hover:bg-purple-700 transition"
                        onClick={() => navigate("/create-draft")}
                    >
                        + Create Draft
                    </Button>
                )}
            </div>

            {/* Empty State */}
            {mySocietyPendingDrafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm">
                    <span className="text-4xl">📭</span>
                    <p className="mt-3 text-gray-600">
                        No pending drafts at the moment
                    </p>
                </div>
            ) : (
                /* Draft Cards Grid */
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mySocietyPendingDrafts.map((draft) => (
                        <DraftCard
                            key={draft.id}
                            draft={draft}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
