import { Button } from "../components";
import { useNavigate } from "react-router-dom";

export default function Drafts(){
    const navigate = useNavigate();

    return(
        <div className="p-2">
            <Button
            onClick={()=>navigate("/create-draft")}
            >Create Draft</Button>
        </div>
    )
}