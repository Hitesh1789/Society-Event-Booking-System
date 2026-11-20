import { useSelector, useDispatch } from "react-redux"
import { useEffect, useCallback, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { SocietyCard } from "../components"
import { addSocieties, clearSocieties } from "../store/societiesSlice"
import { getSocieties, getSocietyInfo } from "../api/society.api"
import { getUser } from "../api/user.api.js";
import { updateUser } from "../store/authSlice.js"
import { Search, Loader2,X } from "lucide-react";
import { Input } from "../components/ui/input.jsx"
import { Button } from "../components/ui/button.jsx"

export default function AllSocieties() {
    const societies = useSelector((state) => state.society.societies)
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const isMember = (societyId) => {
        return userData?.societies?.some(
            (s) => Number(s.society_id) === Number(societyId)
        )
    }

    const refreshSocieties = useCallback(async () => {
        try {
            setLoading(true);

            const [socRes, userRes] = await Promise.all([
                getSocieties(),
                getUser() // API that returns updated user
            ])

            dispatch(clearSocieties())
            dispatch(addSocieties({ societies: socRes.data.data.societies }))
            dispatch(updateUser({ newUserData: userRes.data.data }))
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }, [dispatch])

    useEffect(() => {
        refreshSocieties()
    }, [refreshSocieties])

    const socLead = async (societyId) => {
        try {
            const res = await getSocietyInfo(societyId)
            return res?.data?.data?.lead?.name || null
        } catch {
            return null
        }
    }

    // society names that contain the typed text (ignores case and extra spaces)
    const filteredSocities = useMemo(() => {
        const text = search.trim().toLowerCase();
        if (!text) return societies;
        return societies.filter((s) => s.name?.toLowerCase().includes(text));
    }, [search, societies])

    const clearSearch = () => setSearch("");

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
                            + Create Society
                        </button>
                    )}
                </div>



                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
                        Loading societies...
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && societies.length === 0 && (
                    <div className="flex justify-center items-center min-h-[60vh] px-4">
                        <div className="max-w-md text-center rounded-2xl border bg-white p-8 shadow-sm">

                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                🏛️
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                No Societies Found
                            </h2>

                            <p className="text-sm text-gray-500 mb-6">
                                There are currently no societies available to join.
                            </p>

                            {userData?.profile?.role === "admin" && (
                                <button
                                    onClick={() => navigate("/create-society")}
                                    className="rounded-xl bg-purple-600 px-6 py-2 text-white font-medium hover:bg-purple-700 transition"
                                >
                                    Create First Society
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* FILTERS */}
                {!loading && societies.length > 0 && (
                    <div className="mb-6 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by society name..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {search && (
                                <Button variant="outline" className="cursor-pointer" onClick={clearSearch}>
                                    <X className="mr-1 h-4 w-4" />
                                    Clear
                                </Button>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Showing {filteredSocities.length} of {societies.length} societies
                        </p>
                    </div>
                )}


                {/* NO MATCH STATE */}
                {!loading && societies.length > 0 && filteredSocities.length === 0 && (
                    <div className="flex min-h-[40vh] items-center justify-center px-4">
                        <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                                <Search className="h-7 w-7" />
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-foreground">No societies found</h2>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Try a different society name.
                            </p>
                            <Button variant="outline" className="cursor-pointer" onClick={clearSearch}>
                                Clear search
                            </Button>
                        </div>
                    </div>
                )}


                {/* SOCIETY LIST */}
                {!loading && societies.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                        {filteredSocities.map((society) => (
                            <SocietyCard
                                key={society.id}
                                socId={society.id}
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
                )}

            </div>
        </div>
    )
}