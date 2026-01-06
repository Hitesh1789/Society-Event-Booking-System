import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMembers, getSocietyInfo } from "../api/society.api"

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

  useEffect(() => {
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

    fetchSociety()
  }, [societyId])

  const getDate = (date) =>
    new Date(date).toLocaleDateString("en-IN")

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

            <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <span>Name</span>
              <span>Email</span>
              <span>Joined</span>
              <span>Role</span>
            </div>

            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-4 text-sm py-2"
                >
                  <span>{member.name}</span>
                  <span className="truncate">{member.email}</span>
                  <span>{getDate(member.joined_at)}</span>
                  <Badge variant="outline" className="w-fit">
                    {member.role}
                  </Badge>
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
                  {society.lead?.name}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">
                  {society.lead?.email}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
