import { useSelector, useDispatch } from "react-redux"
import { useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { SocietyCard } from "../components"
import { addSocieties, clearSocieties } from "../store/societiesSlice"
import { getSocieties, getSocietyInfo } from "../api/society.api"
import { getUser } from "../api/user.api.js";
import { updateUser } from "../store/authSlice.js"

export default function AllSocieties() {
    const societies = useSelector((state) => state.society.societies)
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isMember = (societyId) => {
        return userData?.societies?.some(
            (s) => Number(s.society_id) === Number(societyId)
        )
    }

    const refreshSocieties = useCallback(async () => {
        try {
            dispatch(clearSocieties())

            const [socRes, userRes] = await Promise.all([
                getSocieties(),
                getUser() // API that returns updated user
            ])

            dispatch(addSocieties({ societies: socRes.data.data.societies }))
            dispatch(updateUser({newUserData : userRes.data.data}))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        if (societies.length === 0) {
            refreshSocieties()
        }
    }, [societies.length, refreshSocieties])

    const socLead = async (societyId) => {
        try {
            const res = await getSocietyInfo(societyId)
            return res?.data?.data?.lead?.name || null
        } catch {
            return null
        }
    }

    return (
        <div className="flex">
            <div className="flex-1 p-2">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">All Societies</h1>

                    {userData?.profile?.role === "admin" && (
                        <button
                            onClick={() => navigate("/create-society")}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
                        >
                            Create Society
                        </button>
                    )}
                </div>

                {/* SOCIETY CARDS */}
                <div className="flex flex-wrap gap-3">
                    {societies.map((society) => (
                        <SocietyCard
                            key={society.id}
                            socId = {society.id}
                            description={society.description}
                            socName={society.name}
                            president={society.president_name}
                            members={society.member_count}
                            isMember={isMember(society.id)}
                            lead={socLead(society.id)}
                            onJoinSuccess={refreshSocieties}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}
