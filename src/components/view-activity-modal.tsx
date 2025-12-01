
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { History } from "lucide-react";
import type { User, RecentActivity } from "@/lib/types";
import { recentActivities } from "@/lib/data";

interface ViewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// Mock function to get activities for a specific user
const getUserActivities = (user: User): RecentActivity[] => {
    // In a real app, this would be a filtered query.
    // For demo, we'll just show all activities and pretend they're for this user.
    return recentActivities.map(activity => ({
        ...activity,
        actorName: user.name, // Overwrite actor name for demo purposes
    }));
}

export function ViewActivityModal({ isOpen, onClose, user }: ViewActivityModalProps) {
  const activities = getUserActivities(user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Activity Log for {user.name}
          </DialogTitle>
          <DialogDescription>
            A log of recent actions performed by this user.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="h-72">
            <div className="p-4 grid gap-6">
                {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={activity.patientAvatarUrl} alt="Avatar" data-ai-hint="person" />
                    <AvatarFallback>{activity.patientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                        {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Patient: {activity.patientName}
                    </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-muted-foreground">{activity.timestamp}</div>
                </div>
                ))}
            </div>
        </ScrollArea>
        <Separator />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
