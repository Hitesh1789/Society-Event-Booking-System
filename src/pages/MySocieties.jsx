import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MySocieties() {
    const userData = useSelector((state) => state.auth.userData)
    const societies = useSelector((state) => state.society.societies)
    const [mySocieties, setMySocieties] = useState([])

    useEffect(() => {
        const userSocietiesInfo = societies.filter((society) => (
            userData.societies.some((s) => society.id === s.id)
        ))
        setMySocieties(userSocietiesInfo)
    }, [userData, societies])

    return (mySocieties.length == 0) ? (
        <div className="flex flex-wrap">
            <div className="p-2 w-full">
                <h1 className="text-2xl font-bold">
                    {<>Sorry ,You Have not joined any Society yet.</>}
                </h1>
            </div>
        </div>
    ) :
        (
            <div className="flex">
                <div className="flex-1 p-2">
                    <h1 className="text-2xl font-semibold mb-4">Your Societies</h1>
                    <div className="flex flex-wrap gap-3">
                        {
                            mySocieties.map((society) => (
                                <SocietyCard
                                    key={society.id}
                                    description={society.description}
                                    socName={society.name}
                                    president={society.president_name}
                                    members={society.member_count}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
}