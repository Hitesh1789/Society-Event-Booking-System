import { useState } from "react";
import { Button } from "../components";
import { approveOrRejectDraft } from "../api/eventDraft.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";
import { getUser } from "../api/user.api";
export default function ApprovalCard({ draft }) {
    const [action, setAction] = useState(null); // request | approve | reject
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleSubmit = async () => {
        await approveOrRejectDraft(draft.id, {
            action,
            remarks: message,
        });
        setAction(null);
        setMessage("");
        const res = await getUser();
        dispatch(updateUser({newUserData:res.data.data}))
        navigate('/event-approval')
    };

    return (
        <div className="rounded-3xl border bg-white p-6 shadow-md transition hover:shadow-lg">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {draft.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Event Draft Approval
                </p>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-5">
                <div>
                    <p className="font-medium text-gray-500">Society</p>
                    <p>{draft.societyName}</p>
                </div>

                <div>
                    <p className="font-medium text-gray-500">Lead</p>
                    <p>{draft.leadName}</p>
                </div>

                <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                        {draft.status}
                    </span>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            {!action && (
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        className="rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
                        onClick={() => setAction("changes_requested")}
                    >
                        Request Changes
                    </Button>

                    <Button
                        className="rounded-xl bg-green-600 py-2 text-white hover:bg-green-700"
                        onClick={() => setAction("approved")}
                    >
                        Approve Draft
                    </Button>

                    <Button
                        className="rounded-xl bg-red-600 py-2 text-white hover:bg-red-700"
                        onClick={() => setAction("rejected")}
                    >
                        Reject Draft
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-xl bg-purple-600 text-purple-600 py-2 text-white hover:bg-purple-700"
                        onClick={() => navigate(`/drafts/${draft.id}`)}
                    >
                        View Full Draft
                    </Button>
                </div>
            )}

            {/* MESSAGE SECTION */}
            {action && (
                <div className="mt-5 rounded-2xl border bg-gray-50 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                        Message for <span className="capitalize">{action}</span>
                    </p>

                    <textarea
                        rows={4}
                        placeholder={`Write your remarks for ${action}...`}
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="flex gap-3">
                        <Button
                            className="flex-1 rounded-xl bg-purple-600 py-2 text-white hover:bg-purple-700 cursor-pointer"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl "
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
