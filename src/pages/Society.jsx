import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getSocietyInfo } from "../api/society.api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Society2() {
  const { societyId } = useParams()
  const [society, setSociety] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        if (societyId) {
          const res = await getSocietyInfo(societyId)
          setSociety(res.data.data)
        }
      } catch (error) {
        console.log("Error in fetching societyInfo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSociety()
  }, [societyId])

  if (loading) {
    return <div className="p-6 text-purple-500">Loading society details...</div>
  }

  if (!society) {
    return <div className="p-6 text-red-500">Society not found</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="rounded-2xl shadow-lg border-purple-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-purple-500">
              {society.name}
            </CardTitle>
            <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-200">
              {society.user_role}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {society.description}
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-5 pt-2">
          <div className="flex justify-between">
            <span className="text-purple-500 font-medium">President</span>
            <span className="font-semibold">{society.president_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-purple-500 font-medium">Members</span>
            <span className="font-semibold">{society.member_count}</span>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-purple-500 mb-2">
              Society Lead
            </h3>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground ">Name:</span>{" "}
                <span className="font-medium">{society.lead?.name}</span>
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
