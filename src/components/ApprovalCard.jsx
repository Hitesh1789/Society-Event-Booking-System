import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveOrRejectDraft } from "../api/eventDraft.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";
import { getUser } from "../api/user.api";
import { toast } from "sonner";
import { Building2, User, FileEdit, CheckCircle2, XCircle, Eye, History } from "lucide-react";

// readable names for each action
const actionLabel = {
    changes_requested: "Request Changes",
    approved: "Approve",
    rejected: "Reject",
};

export default function ApprovalCard({ draft }) {
    const [action, setAction] = useState(null); // changes_requested | approved | rejected
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        try {
            await approveOrRejectDraft(draft.id, {
                action,
                remarks: message,
            });
            toast.success("Response submitted successfully 🎉", {
                duration: 2000
            });
            setAction(null);
            setMessage("");
            const res = await getUser();
            dispatch(updateUser({ newUserData: res.data.data }))
            navigate('/event-approval')
        } catch (err) {
            toast.error("Response Submission failed ❌", {
                description: err?.response?.data?.message || "Please try again",
                duration: 2000,
            });
        }
    };

    return (
        <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-md transition hover:shadow-lg sm:p-6">

            {/* HEADER */}
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="line-clamp-2 text-xl font-semibold text-foreground sm:text-2xl">
                        {draft.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Event Draft Approval
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium capitalize text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                    {draft.status}
                </span>
            </div>

            {/* INFO */}
            <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Society</p>
                        <p className="truncate font-medium text-foreground">{draft.societyName}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Lead</p>
                        <p className="truncate font-medium text-foreground">{draft.leadName}</p>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            {!action && (
                <div className="space-y-4">
                    {/* Decision buttons */}
                    <div className="flex flex-col gap-2">
                        <Button
                            className="w-full cursor-pointer justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => setAction("changes_requested")}
                        >
                            <FileEdit className="mr-2 h-4 w-4 shrink-0" />
                            Request Changes
                        </Button>

                        <Button
                            className="w-full cursor-pointer justify-center rounded-xl bg-green-600 text-white hover:bg-green-700"
                            onClick={() => setAction("approved")}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" />
                            Approve Draft
                        </Button>

                        <Button
                            className="w-full cursor-pointer justify-center rounded-xl bg-red-600 text-white hover:bg-red-700"
                            onClick={() => setAction("rejected")}
                        >
                            <XCircle className="mr-2 h-4 w-4 shrink-0" />
                            Reject Draft
                        </Button>
                    </div>

                    {/* View buttons */}
                    <div className="flex flex-col gap-2 border-t pt-4">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer justify-center rounded-xl"
                            onClick={() => navigate(`/drafts/${draft.id}`)}
                        >
                            <Eye className="mr-2 h-4 w-4 shrink-0" />
                            View Full Draft
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full cursor-pointer justify-center rounded-xl"
                            onClick={() => navigate(`/draft-history/${draft.id}`)}
                        >
                            <History className="mr-2 h-4 w-4 shrink-0" />
                            View Draft History
                        </Button>
                    </div>
                </div>
            )}
            {/* MESSAGE SECTION */}
            {action && (
                <div className="space-y-3 rounded-2xl border bg-muted/40 p-4">
                    <p className="text-sm font-medium text-foreground">
                        Message for{" "}
                        <span className="text-purple-600 dark:text-purple-400">
                            {actionLabel[action]}
                        </span>
                    </p>

                    <textarea
                        rows={4}
                        placeholder={`Write your remarks for ${actionLabel[action].toLowerCase()}...`}
                        className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="flex gap-3">
                        <Button
                            className="flex-1 cursor-pointer rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 cursor-pointer rounded-xl"
                            onClick={() => {
                                setAction(null);
                                setMessage("");
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}