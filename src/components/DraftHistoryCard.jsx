export default function DraftHistoryCard({ draft, societyMap }) {
    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
        approved: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
        rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        requested: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    };

    const getDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "—";

    return (
        
        <div className="relative rounded-xl border bg-card text-card-foreground p-4 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    {draft.title}
                </h3>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusColor[draft.status] || "bg-muted text-muted-foreground"
                    }`}
                >
                    {draft.status}
                </span>
            </div>

            {/* Description */}
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {draft.description}
            </p>

            {/* Meta Info */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <p>
                    <span className="font-medium">Society:</span>{" "}
                    {societyMap[draft.society_id] || "—"}
                </p>

                <p>
                    <span className="font-medium">Date:</span>{" "}
                    {getDate(draft.proposed_date)}
                </p>

                <p>
                    <span className="font-medium">Location:</span>{" "}
                    {draft.proposed_location || "—"}
                </p>

                <p>
                    <span className="font-medium">Version:</span>{" "}
                    {draft.version || "—"}
                </p>

                <p>
                    <span className="font-medium">Created Date:</span>{" "}
                    {getDate(draft.created_at)}
                </p>
            </div>
        </div>
    );
}