import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import type { ContactMessage } from "./contact-message-manager.types";

interface MessageDialogProps {
  message: ContactMessage;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MessageDialog = ({
  message,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: MessageDialogProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Siuntėjas</label>
          <p className="mt-1">{message.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">El. paštas</label>
          <p className="mt-1">
            <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">
              {message.email}
            </a>
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground">Tema</label>
        <p className="mt-1">{message.subject}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground">Pranešimas</label>
        <Textarea value={message.message} readOnly className="mt-1 min-h-[200px] resize-none" />
      </div>

      <div className="text-sm text-muted-foreground">
        Gauta: {format(new Date(message.created_at), "yyyy-MM-dd HH:mm:ss", { locale: lt })}
      </div>

      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          {message.status === "read" ? (
            <Button variant="outline" size="sm" onClick={() => onMarkAsUnread(message.id)}>
              <Mail className="h-4 w-4 mr-1" />
              Žymėti kaip neperskaitytą
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onMarkAsRead(message.id)}>
              <MailOpen className="h-4 w-4 mr-1" />
              Žymėti kaip perskaitytą
            </Button>
          )}
        </div>

        <Button variant="destructive" size="sm" onClick={() => onDelete(message.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Ištrinti
        </Button>
      </div>
    </div>
  );
};
