import { Card } from "@/components/ui/card"
import { Users, CalendarDays, ClipboardCheck, MessageSquareMore } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getAllUpcomingEvents } from "../api/events.api";
import { getMyRegisterations } from "../api/eventRegsiter.api";
import { clearEvents, addEvents } from "../store/eventSlice";

export default function Dashboard() {
  const userData = useSelector((state) => state.auth.userData)
  const events = useSelector((state) => state.event.events);
  const [myRegisterations, setMyRegisterations] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (events.length > 0) return   // STOP API CALL
    (async () => {
      try {
        const fetchedEvents = await getAllUpcomingEvents();
        if (fetchedEvents.data.data) {
          dispatch(addEvents({ events: fetchedEvents.data.data }))
        }
        else {
          dispatch(clearEvents())
        }
      }
      catch (error) {
        console.log("Error while fetching all socities: ", error)
      }
    })();
  }, [events.length])

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        const response = await getMyRegisterations();
        const fetchedRegistrations = response.data.data.getMyRegisterations;
        let registeredEvents = 0;
        fetchedRegistrations.forEach((event) => {
          if(event.registration_status=='registered') registeredEvents++;
        });
        setMyRegisterations(registeredEvents)
      }
      catch (error) {
        console.log("Error in fetching : ", error);
      }
    };
    fetchData();
  }, [userData])

  const stats = [
    {
      title: "My Societies",
      value: userData?.societies.length,
      subtitle: "Active memberships",
      icon: Users,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Upcoming Events",
      value: events.length,
      subtitle: "Across all societies",
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "My Registrations",
      value: myRegisterations,
      subtitle: "Events registered",
      icon: ClipboardCheck,
      color: "text-green-600 bg-green-100"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back {userData?.profile.name}👋</h1>{/*change */}
        <p className="text-gray-500 mt-1">Here’s your activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {console.log(userData)}
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-3 text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-500 text-sm">{stat.title}</span>
              <span className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</span>
              <span className="text-gray-400 text-xs mt-1">{stat.subtitle}</span>
              <span
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </span>
            </div>
          </Card>
        ))}
        {
          (userData.societies.some((s) => s.society_role === "president") || userData?.profile.role == 'admin') ? (
            <Card
              className="p-3 text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="flex flex-col gap-2 items-center">
                <span className="text-gray-500 text-sm">Pending Approvals</span>
                <span className="text-3xl font-bold text-gray-900 mt-1">{userData.pendingApprovals.length}</span>
                <span className="text-gray-400 text-xs mt-1">Awaiting your input</span>
                <span
                  className={`h-12 w-12 rounded-xl flex items-center justify-center text-yellow-600 bg-yellow-100`}
                >
                  <MessageSquareMore className="h-6 w-6" />
                </span>
              </div>
            </Card>
          ) : null
        }
        {
          (userData.societies.some((s) => s.society_role === "lead") || userData?.profile.role == 'admin') ? (
            <Card
              className="p-3 text-center rounded-2xl shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="flex flex-col gap-2 items-center">
                <span className="text-gray-500 text-sm">Pending Drafts</span>
                <span className="text-3xl font-bold text-gray-900 mt-1">{userData.pendingDrafts.length}</span>
                <span className="text-gray-400 text-xs mt-1">Awaiting your input</span>
                <span
                  className={`h-12 w-12 rounded-xl flex items-center justify-center text-yellow-600 bg-yellow-100`}
                >
                  <MessageSquareMore className="h-6 w-6" />
                </span>
              </div>
            </Card>
          ) : null
        }
      </div>
    </div>
  )
}
