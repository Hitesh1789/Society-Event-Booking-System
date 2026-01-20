import { useEffect, useState } from "react";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DraftCard } from "../components/index";
import { getDrafts } from "../api/eventDraft.api";

export default function Drafts() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [mySocietyDrafts, setMySocietyDrafts] = useState([]);

    const isLead = userData?.societies?.some(
        (s) => s.society_role === "lead"
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData?.societies?.length) return;

        const fetchDrafts = async () => {
            try {
                setLoading(true);

                const draftsPerSociety = await Promise.all(
                    userData.societies.map((s) =>
                        getDrafts(s.society_id).then(
                            (res) => res.data.data.drafts
                        )
                    )
                );

                // draftsPerSociety = [ [..], [..], [..] ]
                const allDrafts = draftsPerSociety.flat();
                setMySocietyDrafts(allDrafts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, [userData]);


    return (
        <div className="min-h-[80vh]  px-6 py-8">
            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-purple-700">
                        Event Drafts
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
            {mySocietyDrafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm">
                    <span className="text-4xl">📭</span>
                    <p className="mt-3 text-gray-600">
                        No drafts at the moment
                    </p>
                </div>
            ) : (
                /* Draft Cards Grid */
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mySocietyDrafts.map((draft) => (
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
