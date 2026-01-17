import { useEffect, useState } from "react";
import { getDraftInfo,getDraftHistory } from "../api/eventDraft.api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { getSocieties } from "../api/society.api";

export default function Draft() {
    const { draftId } = useParams();
    const [draftInfo, setDraftInfo] = useState(null);
    const dispatch = useDispatch();
    const societies = useSelector((state) => state.society.societies);
    const society = societies?.filter((s) => s.id == draftInfo?.society_id); 
    
    const getDate = (apiDate) =>
        new Date(apiDate).toLocaleDateString("en-IN");

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    useEffect(() => {
        if(draftInfo) return;
        const fetchDraftInfo = async () => {
            try {
                const res = await getDraftInfo(draftId);
                setDraftInfo(res.data.data.draft);
                const res2 = await getDraftHistory(draftId);
                console.log(res2.data.data.formatedDrafts)

            } catch (error) {
                console.error(error);
            }
        };
        fetchDraftInfo();
    }, [draftId]);


    useEffect(() => {
        if (societies.length > 0) return   // STOP API CALL
        (async () => {
            try {
                const fetchedSocieties = await getSocieties();
                if (fetchedSocieties.data.data) {
                    dispatch(addSocieties({ societies: fetchedSocieties.data.data.societies }))
                }
                else {
                    dispatch(clearSocieties())
                }
            }
            catch (error) {
                console.log("Error while fetching all socities: ", error)
            }
        })();
    }, [societies.length])
    
    if (!draftInfo) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Loading draft details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] p-6 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {draftInfo.title}
                    </h1>

                    <span
                        className={`rounded-full px-4 py-1 text-sm font-medium ${statusColor[draftInfo.status]
                            }`}
                    >
                        {draftInfo.status.toUpperCase()}
                    </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">
                        Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        {draftInfo.description}
                    </p>
                </div>

                <hr className="my-6" />

                {/* Details */}
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Society</span>
                        <span className="font-medium">
                            {society[0]?.name || "—"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Drafted By</span>
                        <span className="font-medium">
                            {draftInfo.drafted_by}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Proposed Date</span>
                        <span className="font-medium">
                            {getDate(draftInfo.proposed_date)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Proposed Location</span>
                        <span className="font-medium">
                            {draftInfo.proposed_location}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}