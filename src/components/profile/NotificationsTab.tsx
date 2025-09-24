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
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="newsletter" className="flex flex-col space-y-1">
            <span>Naujienlaiškiai</span>
            <span className="font-normal text-sm text-muted-foreground">
              Gaukite reguliarius naujienlaiškius apie naujas publikacijas
            </span>
          </Label>
          <Switch
            id="newsletter"
            checked={emailNotifications.newsletter}
            onCheckedChange={checked => updateNotificationSetting("newsletter", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="comments" className="flex flex-col space-y-1">
            <span>Komentarų pranešimai</span>
            <span className="font-normal text-sm text-muted-foreground">
              Gaukite pranešimus, kai kas nors pakomentuoja jūsų turinį ar atsako į jūsų komentarus
            </span>
          </Label>
          <Switch
            id="comments"
            checked={emailNotifications.comments}
            onCheckedChange={checked => updateNotificationSetting("comments", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="courseUpdates" className="flex flex-col space-y-1">
            <span>Kursų atnaujinimai</span>
            <span className="font-normal text-sm text-muted-foreground">
              Gaukite pranešimus apie jūsų prenumeruojamų kursų atnaujinimus
            </span>
          </Label>
          <Switch
            id="courseUpdates"
            checked={emailNotifications.courseUpdates}
            onCheckedChange={checked => updateNotificationSetting("courseUpdates", checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="publicationUpdates" className="flex flex-col space-y-1">
            <span>Publikacijų atnaujinimai</span>
            <span className="font-normal text-sm text-muted-foreground">
              Gaukite pranešimus apie naujus straipsnius ir publikacijas
            </span>
          </Label>
          <Switch
            id="publicationUpdates"
            checked={emailNotifications.publicationUpdates}
            onCheckedChange={checked => updateNotificationSetting("publicationUpdates", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
