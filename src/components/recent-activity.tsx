import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { recentActivities } from "@/lib/data";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An overview of recent actions in the system.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={activity.patientAvatarUrl} alt="Avatar" data-ai-hint="person" />
              <AvatarFallback>{activity.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {activity.patientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action} by {activity.actorName}
              </p>
            </div>
            <div className="ml-auto font-medium text-sm text-muted-foreground">{activity.timestamp}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
