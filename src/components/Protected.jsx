import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

function Protected({children,authentication = true}){
    const [loader,setLoader] = useState(true);
    const navigate = useNavigate();
    const authStatus = useSelector((state)=>state.auth.status);
    
    useEffect(()=>{
        if(authentication && authStatus!==authentication){
            navigate('/login');
        }
        else if(!authentication && authStatus){
            navigate('/')
        }
        setLoader(false);
    },[navigate,authStatus,authentication])
    
    return loader ? (<div className="flex items-center justify-center h-screen">
      <div className="font-medium text-2xl">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    </div>) : <>{children}</>
}

export default Protected;