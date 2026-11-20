import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMembers, getSocietyInfo, assignLead } from "../api/society.api"
import { toast } from "sonner"
import { Mail, CalendarDays, Crown, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Society() {
  const { societyId } = useParams()
  const [society, setSociety] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const isPresident =
    society?.user_role === "president" || society?.user_role === "admin"

  const fetchSociety = async () => {
    try {
      const [societyRes, membersRes] = await Promise.all([
        getSocietyInfo(societyId),
        getMembers(societyId),
      ])
      setSociety(societyRes.data.data)
      setMembers(membersRes.data.data.members)
    } catch (error) {
      console.log("Error fetching society data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (society != null) return;
    fetchSociety()
  }, [societyId, society])

  const getDate = (date) =>
    new Date(date).toLocaleDateString("en-IN")

  const assignlead = async (leadId) => {
    try {
      await assignLead(society.id, { "userId": leadId })
      fetchSociety()
      toast.success("Lead assigned Successfully", {
        duration: 2000,
      });
    } catch (err) {
      console.log(err)
      toast.error("Lead not assigned.", {
        description: err?.response?.data?.message || "Please try again",
        duration: 2000,
      });
    }
  }

  // show the Assign Lead button only for the president/admin, not for the
  // president row and not for the member who is already the lead
  const canAssignLead = (member) =>
    isPresident && member.role != "president" && society.lead?.id !== member.id

  const assignButtonClass =
    "cursor-pointer rounded-full border border-purple-300 px-4 py-1.5 text-xs font-medium text-purple-600 transition-all duration-200 hover:bg-purple-600 hover:text-white dark:border-purple-500/40 dark:text-purple-300 dark:hover:bg-purple-600 dark:hover:text-white"

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading society details...</p>
      </div>
    )
  }

  if (!society) {
    return <div className="p-6 text-destructive">Society not found</div>
  }

  return (
    <div className="mx-auto max-w-5xl p-3 sm:p-6">
      <Card className="rounded-2xl shadow-md">
        {/* Header */}
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="min-w-0 break-words text-2xl font-bold text-purple-600 dark:text-purple-400 sm:text-3xl">
              {society.name}
            </CardTitle>
            <Badge className="shrink-0 border-0 bg-purple-100 text-purple-700 capitalize dark:bg-purple-500/20 dark:text-purple-300">
              {society.user_role}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {society.description}
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-8 pt-6">
          {/* Society Stats */}
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-6">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-muted-foreground">President</p>
              <p className="font-semibold">{society.president_name}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-muted-foreground">Total Members</p>
              <p className="font-semibold">{society.member_count}</p>
            </div>
          </div>

          <Separator />

          {/* Members */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-purple-600 dark:text-purple-400">
              Members
            </h3>

            {/* TABLE: tablets and larger screens */}
            <div className="hidden md:block">
              <div
                className={`grid ${isPresident ? "grid-cols-5" : "grid-cols-4"} gap-3 border-b pb-2 text-sm font-medium text-muted-foreground`}
              >
                <span>Name</span>
                <span>Email</span>
                <span>Joined</span>
                <span>Role</span>
                {isPresident && <span className="text-right">Action</span>}
              </div>

              <div className="divide-y">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`grid ${isPresident ? "grid-cols-5" : "grid-cols-4"} items-center gap-3 py-3 text-sm`}
                  >
                    <span className="truncate font-medium">{member.name}</span>

                    <span className="truncate text-muted-foreground">
                      {member.email}
                    </span>

                    <span>{getDate(member.joined_at)}</span>

                    <Badge variant="outline" className="w-fit capitalize">
                      {member.role}
                    </Badge>

                    {isPresident && (
                      <div className="flex justify-end">
                        {canAssignLead(member) && (
                          <button
                            className={assignButtonClass}
                            onClick={() => assignlead(member.id)}
                          >
                            Assign Lead
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CARDS: phones */}
            <div className="space-y-3 md:hidden">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                        {member.name?.trim().charAt(0).toUpperCase() || "?"}
                      </div>
                      <p className="truncate font-medium text-foreground">
                        {member.name}
                      </p>
                    </div>

                    <Badge variant="outline" className="shrink-0 capitalize">
                      {society.lead?.id === member.id && (
                        <Crown className="mr-1 h-3 w-3" />
                      )}
                      {member.role}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>Joined {getDate(member.joined_at)}</span>
                    </p>
                  </div>

                  {canAssignLead(member) && (
                    <button
                      className={`${assignButtonClass} mt-4 w-full py-2`}
                      onClick={() => assignlead(member.id)}
                    >
                      Assign Lead
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Society Lead */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-purple-600 dark:text-purple-400">
              Society Lead
            </h3>

            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">
                  {society.lead ? society.lead.name : <>Lead not Assigned yet</>}
                </span>
              </p>
              <p className="break-all">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">
                  {society.lead ? society.lead.email : <>Lead not Assigned yet</>}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}