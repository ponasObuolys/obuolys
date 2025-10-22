import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  newsletter: boolean;
  comments: boolean;
  courseUpdates: boolean;
  publicationUpdates: boolean;
}

interface NotificationsTabProps {
  emailNotifications: NotificationSettings;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
}

export const NotificationsTab = ({
  emailNotifications,
  updateNotificationSetting,
}: NotificationsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>El. pašto pranešimai</CardTitle>
        <CardDescription>Valdykite, kokius el. pašto pranešimus norite gauti</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1 text-left">
            <Label htmlFor="comments" className="text-base font-medium cursor-pointer">
              Komentarų pranešimai
            </Label>
            <p className="text-sm text-muted-foreground">
              Gaukite pranešimus, kai kas nors pakomentuoja jūsų turinį ar atsako į jūsų komentarus
            </p>
          </div>
          <Switch
            id="comments"
            checked={emailNotifications.comments}
            onCheckedChange={checked => updateNotificationSetting("comments", checked)}
            className="shrink-0"
          />
        </div>

        <Separator />

        <div className="rounded-lg bg-muted/50 p-4 text-left">
          <p className="text-sm text-muted-foreground">
            <strong>Pastaba:</strong> Kitos pranešimų funkcijos šiuo metu yra kuriamos ir netrukus
            bus prieinamos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
