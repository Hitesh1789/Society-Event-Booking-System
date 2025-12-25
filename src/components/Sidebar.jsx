import {
  LayoutGrid, Users, Star, CalendarDays, ClipboardCheck, UserRound,
  Calendar, User, LogOut,
  LogIn
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { logoutUser } from "../api/user.api";
import { useDispatch } from "react-redux";

// Menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  { title: "All Societies", url: "/all-societies", icon: Users },
  { title: "My Societies", url: "/my-societies", icon: Star },
  { title: "My Events", url: "/events", icon: CalendarDays },
  { title: "All Events", url: "/events", icon: UserRound },
]

export default function SideBar() {
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const role = userData?.profile?.role || "user";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () =>{
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/");
    }
    catch (error) {
      console.log("Error in logout : " ,error)
    }
  }

  return (
    authStatus ? (<Sidebar className="border-r min-h-screen">
      <SidebarContent className="flex flex-col h-full">

        {/* Top Section */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl mb-2 flex items-center justify-center text-purple-600 font-semibold">
              <Calendar />
              <span className="p-1" />
              EventMitra
            </SidebarGroupLabel>

            <p className="text-sm text-center text-gray-500">{role}</p>
          </SidebarGroup>
        </div>
        
        {/* Menu Section */}
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  (<SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                      >
                        <item.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-800">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>) 
                ))}
                {
                  (role == "president" || role == "admin") ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => navigate("/approval")}
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                        >
                          <ClipboardCheck className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-800">Event Approval</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                }
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                    >
                      <LogOut className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-800">Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <p className="text-sm font-semibold">{"ram"}</p> {/* change */}
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-md">
              {role}
            </span>
          </div>
        </div>

      </SidebarContent>
    </Sidebar>):
    (<Sidebar className="border-r min-h-screen">
      <SidebarContent className="flex flex-col h-full">

        {/* Top Section */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl mb-2 flex items-center justify-center text-purple-600 font-semibold">
              <Calendar />
              <span className="p-1" />
              EventMitra
            </SidebarGroupLabel>

            <p className="text-sm text-center text-gray-500">{role}</p>
          </SidebarGroup>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-2 border-t flex items-center gap-3">
          <LogIn/> Login for more features
        </div>

      </SidebarContent>
    </Sidebar>)
  );
}
