import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom"
import { login } from "./store/authSlice"
import { useDispatch, useSelector } from 'react-redux';
import { SideBar, ToggleTheme } from './components/index';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { getUser } from './api/user.api';
import { Toaster } from 'sonner';
import { Loader2 } from "lucide-react";

function App() {
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData)

  useEffect(() => {
    // If user already exists in Redux, do NOT call API
    if (user) {
      setLoading(false)
      return
    }
    getUser().then((userData) => {
      dispatch(login({ userData: userData.data.data }))
    })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [user, dispatch])

  return (
    <>
      <Toaster richColors position="top-right" />

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <SidebarProvider>
          <SideBar />

          <main className="flex min-w-0 flex-1 flex-col">           
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">           
              <SidebarTrigger className="cursor-pointer" />

              <div className="flex items-center gap-2">
                <ToggleTheme />

                {!authStatus && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </header>

            <div className="flex-1 p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      )}
    </>
  )
}

export default App