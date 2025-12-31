import { useSelector } from "react-redux";
import { SocietyCard } from "../components/index"
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { getSocieties } from "../api/society.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function MySocieties() {
    const societies = useSelector((state) => state.society.societies)
    const userData = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch();

    function isMember(society_id) {
        return userData?.societies.some((s) => Number(society_id) === Number(s.society_id))
    }

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


    return (
        <div className="flex">
            <div className="flex-1 p-2">
                <h1 className="text-2xl font-semibold mb-4">All Societies</h1>
                <div className="flex flex-wrap gap-3">
                    {
                        societies.map((society) => (
                            <SocietyCard
                                key={society.id}
                                description={society.description}
                                socName={society.name}
                                president={society.president_name}
                                members={society.member_count}
                                isMember={isMember(society.id)}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}