import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom"
import { login } from "./store/authSlice"
import { useDispatch } from 'react-redux';
import { SideBar } from './components/index';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { getUser } from './api/user.api';

function App() {
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    getUser().then((userData)=>{
      dispatch(login({userData:userData.data.data}))
    })
    .catch((error)=>console.log(error))
    .finally(()=>setLoading(false));
  }, [])

  return (
    loading ? (<div className="flex items-center justify-center h-screen">
      <div className="font-medium text-2xl">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    </div>) :
      (<div className='flex w-full'>
        <SidebarProvider>
          <SideBar />
          <main className="relative flex-1 p-2">

            {/* TOP BAR */}
            <div className="flex justify-between items-center absolute top-2 left-2 right-2 ">

              {/* LEFT SIDE — SIDEBAR TRIGGER */}
              <SidebarTrigger className="cursor-pointer p-5"/>

              {/* RIGHT SIDE — AUTH BUTTONS */}
              {!authStatus && (
                <div className="flex items-center gap-3">
                  <button 
                  onClick={()=>navigate("/login")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer">
                    Login
                  </button>
                  <button 
                  onClick={()=>navigate("/signup")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md cursor-pointer">
                    Signup
                  </button>
                </div>
              )}

            </div>

            {/* MAIN CONTENT — Push down below top bar */}
            <div className="mt-10">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>)
  )
}

export default App