import { getDraftInfo } from "../api/eventDraft.api";
import { useEffect, useState } from "react";

export default function DraftCard({ draft }) {
    const [draftInfo, setDraftInfo] = useState(null);
    // format date
    const getDate = (apiDate) => {
        return new Date(apiDate).toLocaleDateString("en-IN");
    };

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        changes_requested:"bg-blue-100 text-blue-700"
    };

    useEffect(() => {
        const fetchDraftInfo = async () => {
            try {
                const res = await getDraftInfo(draft.id);
                console.log(draft)
                setDraftInfo(res.data.data.draft);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDraftInfo();
    }, [draft.id]);

    if (!draftInfo) {
        return (
            <div className="rounded-xl border p-4 bg-white shadow-sm">
                <p className="text-sm text-gray-500">Loading draft details...</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {draftInfo.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
                {draftInfo.description}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <p><span className="font-medium">Society:</span> {draft.society_name}</p>
                <p><span className="font-medium">Drafted By:</span> {draftInfo.drafted_by}</p>

                <p><span className="font-medium">Proposed Date:</span> {getDate(draftInfo.proposed_date)}</p>
                <p><span className="font-medium">Proposed Location:</span> {draftInfo.proposed_location}</p>
            </div>

            {/* Status */}
            <div className="mt-4">
                <span className ={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusColor[draftInfo.status]}`}>
                    {draftInfo.status}
                </span>
            </div>
        </div>
    );
}
