import { Card } from "@/components/ui/card"
import { Users, CalendarDays, ClipboardCheck, MessageSquareMore } from "lucide-react"
// import { useSelector } from "react-redux"

export default function Dashboard() {
  // const userData = useSelector((state) => state.auth.userData)

  const stats = [
    {
      title: "My Societies",
      value: 2,
      subtitle: "Active memberships",
      icon: Users,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Upcoming Events",
      value: 5,
      subtitle: "Across all societies",
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "My Registrations",
      value: 3,
      subtitle: "Events registered",
      icon: ClipboardCheck,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Pending Feedback",
      value: 1,
      subtitle: "Awaiting your input",
      icon: MessageSquareMore,
      color: "text-orange-600 bg-orange-100"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back Ram👋</h1>{/*change */}
        <p className="text-gray-500 mt-1">Here’s your activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  )
}
