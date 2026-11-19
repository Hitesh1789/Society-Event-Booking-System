import {
  LayoutGrid, Users, Star, CalendarDays, SquarePen, UserRound, ClipboardCheck,
  Calendar, User, LogOut, LogIn, Lock, Pencil, ChevronsUpDown
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/authSlice";
import { logoutUser } from "../api/user.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  { title: "All Societies", url: "/all-societies", icon: Users },
  { title: "My Societies", url: "/my-societies", icon: Star },
  { title: "My Events", url: "/my-events", icon: CalendarDays },
  { title: "All Events", url: "/", icon: UserRound }
]

function Brand() {
  return (
    <SidebarHeader className="border-b px-4 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-lg font-bold tracking-tight text-purple-600 dark:text-purple-400">
            EventMitra
          </p>
          <p className="text-xs text-muted-foreground">Society Manager</p>
        </div>
      </div>
    </SidebarHeader>
  );
}

export default function SideBar() {
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const isPresident = userData?.societies?.some((s) => s.society_role === "president");
  const isMember = userData?.societies?.some((s) => s.society_role === "lead" || s.society_role === "president" || s.society_role === "member");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/");
    }
    catch (error) {
      console.log("Error in logout : ", error)
    }
  }

  // highlight the menu item of the page we are on
  const isActive = (url) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  const renderItem = (item) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={active}
          className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-all cursor-pointer
            hover:bg-accent hover:text-accent-foreground
            data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:font-semibold
            data-[active=true]:hover:bg-purple-700 data-[active=true]:hover:text-white"
        >
          <button
            onClick={() => navigate(item.url)}
            className="flex w-full items-center gap-3"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.title}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  if (!authStatus) {
    return (
      <Sidebar className="border-r">
        <Brand />
        <SidebarContent />
        <SidebarFooter className="border-t p-4">
          <Button
            variant="outline"
            className="w-full cursor-pointer justify-center gap-2"
            onClick={() => navigate("/login")}
          >
            <LogIn className="h-4 w-4" />
            Login for more features
          </Button>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r">
      <Brand />

      {/* Menu Section */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map(renderItem)}

              {(userData?.profile?.role == "admin" || isPresident) &&
                renderItem({ title: "Event Approval", url: "/event-approval", icon: ClipboardCheck })}

              {(userData?.profile?.role == "admin" || isMember) &&
                renderItem({ title: "Drafts", url: "/drafts", icon: SquarePen })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Profile Section */}
      <SidebarFooter className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-accent cursor-pointer">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {userData?.profile?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {userData?.profile?.email}
                </p>
              </div>

              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56 rounded-xl"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/update-profile")}>
              <Pencil className="mr-2 h-4 w-4" />
              Update Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate("/change-password")}>
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logoutHandler}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}