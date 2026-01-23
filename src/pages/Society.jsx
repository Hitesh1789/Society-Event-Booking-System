import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMembers, getSocietyInfo } from "../api/society.api"
import {toast} from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { assignLead } from "../api/society.api";
export default function Society() {
  const {societyId} = useParams()
  const [society, setSociety] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPresident, setIsPresident] = useState(false);
  
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
    if(society!=null) return;
    fetchSociety()
  }, [societyId, members,society])

  useEffect(() => {
    setIsPresident(society?.user_role == 'president' || society?.user_role=="admin" )
  }, [society])

  const getDate = (date) =>
    new Date(date).toLocaleDateString("en-IN")

  const assignlead = async (leadId) => {
    try {
      await assignLead(society.id, {"userId": leadId})
      fetchSociety()
      toast.success("Lead assigned Successfully", {
        duration: 2000,
      });
    } catch (err) {
      console.log(err)
      toast.error("Lead not assigned.", {
        description:err?.response?.data?.message || "Please try again",
        duration: 2000,
      });
    }
  }

  if (loading) {
    return <div className="p-6 text-purple-500">Loading society details...</div>
  }

  if (!society) {
    return <div className="p-6 text-red-500">Society not found</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="rounded-2xl shadow-md">
        {/* Header */}
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-purple-600">
              {society.name}
            </CardTitle>
            <Badge className="bg-purple-100 text-purple-700">
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
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">President</p>
              <p className="font-semibold">{society.president_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Members</p>
              <p className="font-semibold">{society.member_count}</p>
            </div>
          </div>

          <Separator />

          {/* Members Table */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-4">
              Members
            </h3>

            <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground border-b pb-2">
              <span>Name</span>
              <span>Email</span>
              <span>Joined</span>
              <span>Role</span>
              {isPresident && <span className="text-right mr-5">Action</span>}
            </div>

            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-5 items-center text-sm py-3"
                >
                  <span className="font-medium">{member.name}</span>

                  <span className="truncate text-muted-foreground">
                    {member.email}
                  </span>

                  <span>{getDate(member.joined_at)}</span>

                  <Badge variant="outline" className="w-fit">
                    {member.role}
                  </Badge>
                  
                  {/* Assign Lead Button — UI only */}
                  {isPresident && (member.role!="president") && (
                    <div className="flex justify-end">
                      {society.lead?.id !== member.id &&
                        <button
                          className="
                          px-4 py-1.5 text-xs font-medium
                          text-purple-600 border-purple-300
                          rounded-full border
                          transition-all duration-200 cursor-pointer
                          hover:bg-purple-600 hover:text-white
                          "
                          onClick={() => assignlead(member.id)}
                        > Assign Lead
                        </button>}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          <Separator />

          {/* Society Lead */}
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              Society Lead
            </h3>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">
                  {society.lead? society.lead.name : <>Lead not Assigned yet</>}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">
                  {society.lead? society.lead.email : <>Lead not Assigned yet</>}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
