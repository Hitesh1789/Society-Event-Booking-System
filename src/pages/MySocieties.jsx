import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MySocietyCard } from "../components/index.js";
import { getSocieties } from "../api/society.api";
import { useDispatch } from "react-redux";
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { Users } from "lucide-react";
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
            <div className="flex min-h-[50vh] items-center justify-center px-4">
                <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                        <Users/>
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        No Society Memberships
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        You haven’t joined any societies yet.
                    </p>
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