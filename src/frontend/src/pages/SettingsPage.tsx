import UserLayout from "../components/UserLayout";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <UserLayout title="Settings">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground text-sm">Settings panel is coming soon.</p>
      </div>
    </UserLayout>
  );
}
