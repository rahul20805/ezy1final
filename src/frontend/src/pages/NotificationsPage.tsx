import { Bell } from "lucide-react";
import UserLayout from "../components/UserLayout";

export default function NotificationsPage() {
  return (
    <UserLayout title="Notifications">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">No new notifications</h2>
        <p className="text-muted-foreground text-sm">
          We'll let you know when something important happens.
        </p>
      </div>
    </UserLayout>
  );
}
