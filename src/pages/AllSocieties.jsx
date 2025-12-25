import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocieties } from "../api/society.api";
import { addSocieties, clearSocieties } from "../store/societiesSlice";
import { SocietyCard } from "../components/index"

export default function MySocieties() {
    const societies = useSelector((state)=>state.society.societies)
    const dispatch = useDispatch();

    useEffect(()=>{
        (async()=>{
            try {
                const fetchedSocieties = await getSocieties();
                if(fetchedSocieties.data.data){
                    dispatch(addSocieties({societies:fetchedSocieties.data.data.societies}))
                }
                else{
                    dispatch(clearSocieties())
                }
            } 
            catch (error) {
                console.log("Error while fetching all socities: ",error)
            }
        })();
    },[dispatch])

    return (
        <div className="flex">
            <div className="flex-1 p-2">
                <h1 className="text-2xl font-semibold mb-4">All Societies</h1>
                <div className="flex flex-wrap gap-3">
                    {
                        societies.map((society)=>(
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