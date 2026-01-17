import { useEffect, useState } from "react";
import { getDraftHistory } from "../api/eventDraft.api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { getSocieties } from "../api/society.api";
import DraftHistoryCard from "../components/DraftHistoryCard";
export default function DraftHistory() {

    const { draftId } = useParams();
    const [draftHistory, setDraftHistory] = useState([]);
    const dispatch = useDispatch();
    const societies = useSelector((state) => state.society.societies);

    // Map for O(1) lookup
    const societyMap = societies?.reduce((acc, s) => {
        acc[s.id] = s.name;
        return acc;
    }, {}) || {};


    useEffect(() => {
        if (draftHistory.length>0) return;
        const fetchDraftHistory = async () => {
            try {
                const res = await getDraftHistory(draftId);
                setDraftHistory(res.data.data.formatedDrafts);

            } catch (error) {
                console.error(error);
            }
        };
        fetchDraftHistory();
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


    if (!draftHistory?.length) {
        return (
            <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
                No draft history available
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {draftHistory.map((draft) => (
                <DraftHistoryCard
                    key={draft.id}
                    draft={draft}
                    societyMap={societyMap}
                />
            ))}
        </div>
    );

}