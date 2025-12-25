  import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import { Progress } from "@/components/ui/progress"

  export default function EventCard({
    title,
    status,
    societyName,
    date,
    time,
    venue,
    registered,
    totalSeats
  }) {
    const filledPercent = Math.round((registered / totalSeats) * 100)

    return (
      <Card className="w-full shadow-md border rounded-md">
        <CardHeader className="px-4 pb-2">
          <div className="flex justify-between items-center text-purple-600">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Badge variant="secondary" className="text-xs px-2 text-orange-600">
              {status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{societyName}</p>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-6 text-sm px-4 py-1">
          {/* Left details */}
          <div className="flex flex-col space-y-2 w-full md:w-2/3">
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Time:</span>
              <span>{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Venue:</span>
              <span>{venue}</span>
            </div>
          </div>

          {/* Right progress */}
          <div className="flex flex-col justify-between w-full md:w-1/3">
            <div className="flex justify-between">
              <span className="font-medium">Registered:</span>
              <span>{registered} / {totalSeats}</span>
            </div>
            <Progress value={filledPercent} className="h-3 rounded-sm mt-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {filledPercent}% filled
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4">
          <Button className="w-full bg-purple-600 rounded-sm">View Details</Button>
        </CardFooter>
      </Card>
    )
  }
