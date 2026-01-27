import {
  LayoutGrid, Users, Star, CalendarDays, SquarePen, UserRound,ClipboardCheck,
  Calendar, User, LogOut,
  LogIn,
  Lock,
  Pencil
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
  { title: "My Events", url: "/my-events", icon: CalendarDays },
  { title: "All Events", url: "/", icon: UserRound }
]

export default function SideBar() {
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const isPresident = userData?.societies.some((s)=>s.society_role==="president");
  const isMember = userData?.societies.some((s)=>s.society_role==="lead" || s.society_role==="president" ||s.society_role==="member");
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

            <p className="text-sm text-center text-gray-500">Society Managar</p>
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
                  (userData?.profile?.role == "admin" || isPresident) ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => navigate("/event-approval")}
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                        >
                          <ClipboardCheck className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-800">Event Approval</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                }
                {
                  (userData?.profile?.role == "admin" || isMember) ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => navigate("/drafts")}
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                        >
                          <SquarePen className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-800">Drafts</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                }
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={()=>navigate("/change-password")}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                    >
                      <Lock className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-800">Change Password</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={()=>navigate("/update-profile")}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                    >
                      <Pencil className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-800">Update Profile</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
            <p className="text-sm font-semibold">{userData?.profile?.name}</p>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-md">
              {userData?.profile?.role}
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

            <p className="text-sm text-center text-gray-500">Society Managar</p>
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
