import { useSelector } from "react-redux";
import { Button } from "../components";
import { useEffect, useState } from "react";
import ApprovalCard from "../components/ApprovalCard";

export default function EventApproval() {
  const userData = useSelector((state) => state.auth.userData);
  const [mySocietyPendingApprovals, setMySocietyPendingApprovals] = useState([]);

  useEffect(() => {
    if (!userData) return;

    // 1. Societies where user is president
    const presidentSocieties = userData.societies.filter(
      (s) => s.society_role === "president"
    );

    console.log(userData)
    // 2. Pending approvals for those societies
    const res = userData.pendingApprovals.filter((draft) => presidentSocieties.some((soc) => soc.society_name === draft.societyName)
    );
    setMySocietyPendingApprovals(res);
  }, [userData]);

  return (
    <div className="min-h-[80vh] p-6">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        Pending Event Approvals
      </h1>

      {/* Empty State */}
      {mySocietyPendingApprovals.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          🎉 No pending drafts to approve
        </div>
      )}

      {/* Draft Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mySocietyPendingApprovals.map((draft) => (
          <ApprovalCard
            key={draft.id}
            draft={draft}
          />
        ))}
      </div>
    </div>
  );
}
