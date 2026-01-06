import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MySocietyCard } from "../components/index.js";
import { getSocieties } from "../api/society.api";
import { useDispatch } from "react-redux";
import { addSocieties, clearSocieties } from "../store/societiesSlice";

export default function MySocieties() {
    const userData = useSelector((state) => state.auth.userData)
    const societies = useSelector((state) => state.society.societies)
    const [mySocieties, setMySocieties] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        const userSocietiesInfo = societies.filter((society) => (
            userData?.societies.some((s) => Number(society.id) === Number(s.society_id))
        ))
        setMySocieties(userSocietiesInfo)
    }, [userData, societies])

    function getRole(society_id) {
        const society = userData.societies.filter((s) => Number(s.society_id) === Number(society_id))
        return society[0].society_role;
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

        (mySocieties.length == 0) ? (
            <div className="flex flex-wrap">
                <div className="p-2 w-full">
                    <h1 className="text-2xl font-bold">
                        {<>Sorry ,You Have not joined any Society yet.</>}
                    </h1>
                </div>
            </div>
        ) : (
            <div className="flex">
                <div className="flex-1 p-2">
                    <h1 className="text-2xl font-semibold mb-4">Your Societies</h1>
                    <div className="flex flex-wrap gap-3">
                        {
                            mySocieties.map((society) => (
                                <MySocietyCard
                                    key={society.id}
                                    isMember
                                    societyId={society.id}
                                    tagline={society.description}
                                    societyName={society.name}
                                    role={getRole(society.id)}
                                    members={society.member_count}
                                    onJoinSuccess={societies}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )

    )
}