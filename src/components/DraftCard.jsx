import { getDraftInfo } from "../api/eventDraft.api";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DraftCard({ draft }) {
  const [draftInfo, setDraftInfo] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const getDate = (apiDate) =>
    new Date(apiDate).toLocaleDateString("en-IN");

  const statusConfig = {
    pending: {
      label: "Pending Approval",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    },
    changes_requested: {
      label: "Changes Requested",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    },
  };

  useEffect(() => {
    const fetchDraftInfo = async () => {
      try {
        const res = await getDraftInfo(draft.id);
        setDraftInfo(res.data.data.draft);
        setRemarks(res.data.data.approval?.remarks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDraftInfo();
  }, [draft.id]);

  if (!draftInfo) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm animate-pulse">
        <div className="h-4 w-1/3 bg-muted rounded mb-3" />
        <div className="h-3 w-full bg-muted rounded mb-2" />
        <div className="h-3 w-5/6 bg-muted rounded" />
      </div>
    );
  }

  const status = statusConfig[draftInfo.status];

  return (
    <div className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground line-clamp-2">
          {draftInfo.title}
        </h2>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full text-center ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
        {draftInfo.description}
      </p>

      {/* Divider */}
      <div className="my-4 border-t" />

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <span><span className="font-medium">Society: </span>{draft.society_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span><span className="font-medium">Drafted By: </span>{draftInfo.drafted_by}</span>
        </div>

        <div className="flex items-center gap-2">
          <span><span className="font-medium">Proposed Date: </span>{getDate(draftInfo.proposed_date)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span><span className="font-medium">Proposed Location: </span>{draftInfo.proposed_location}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(`/draft-history/${draft.id}`)}
        >
          View History
        </Button>

        {remarks && (
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
          >
            View Remarks
          </Button>
        )}
      </div>

      {/* Remarks Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle>President Remarks</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-foreground leading-relaxed">
            {remarks}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}