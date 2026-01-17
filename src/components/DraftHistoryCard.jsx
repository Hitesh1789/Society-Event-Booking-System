export default function DraftHistoryCard({ draft, societyMap }) {
    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        requested: "bg-blue-100 text-blue-700",
    };

    const getDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "—";

    return (
        <div className="relative rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                    {draft.title}
                </h3>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusColor[draft.status] || "bg-gray-100 text-gray-700"
                    }`}
                >
                    {draft.status}
                </span>
            </div>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {draft.description}
            </p>

            {/* Meta Info */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                <p>
                    <span className="font-medium">Society:</span>{" "}
                    {societyMap[draft.society_id] || "—"}
                </p>

                <p>
                    <span className="font-medium">Draft ID:</span> {draft.id}
                </p>

                <p>
                    <span className="font-medium">Date:</span>{" "}
                    {getDate(draft.proposed_date)}
                </p>

                <p>
                    <span className="font-medium">Location:</span>{" "}
                    {draft.proposed_location || "—"}
                </p>
            </div>
        </div>
    );
}
