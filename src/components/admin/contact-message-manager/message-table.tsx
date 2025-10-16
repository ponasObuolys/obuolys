import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, MailOpen, Trash2, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { MessageDialog } from "./message-dialog";
import type { ContactMessage, MessageFilter } from "./contact-message-manager.types";

interface MessageTableProps {
  messages: ContactMessage[];
  filter: MessageFilter;
  selectedMessage: ContactMessage | null;
  onViewMessage: (message: ContactMessage) => void;
  onDeleteMessage: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

export const MessageTable = ({
  messages,
  filter,
  selectedMessage,
  onViewMessage,
  onDeleteMessage,
  onMarkAsRead,
  onMarkAsUnread,
}: MessageTableProps) => {
  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">
            {filter === "all"
              ? "Pranešimų nėra."
              : `${filter === "unread" ? "Neperskaitytų" : "Perskaitytų"} pranešimų nėra.`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop lentelė */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Siuntėjas</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Būklė</TableHead>
                <TableHead className="text-right">Veiksmai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  className={message.status === "unread" ? "bg-blue-100 dark:bg-blue-950/30" : ""}
                >
                  <TableCell>
                    {message.status === "unread" ? (
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div
                        className={`font-medium ${message.status === "unread" ? "text-gray-900 dark:text-gray-100" : ""}`}
                      >
                        {message.name}
                      </div>
                      <div
                        className={`text-sm ${message.status === "unread" ? "text-gray-700 dark:text-gray-300" : "text-muted-foreground"}`}
                      >
                        {message.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div
                      className={`truncate ${message.status === "unread" ? "text-gray-900 dark:text-gray-100 font-medium" : ""}`}
                      title={message.subject}
                    >
                      {message.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(message.created_at), "yyyy-MM-dd HH:mm", { locale: lt })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.status === "unread" ? "default" : "secondary"}>
                      {message.status === "unread" ? "Neperskaitytas" : "Perskaitytas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => onViewMessage(message)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Peržiūrėti
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Kontakto pranešimas</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <MessageDialog
                              message={selectedMessage}
                              onMarkAsRead={onMarkAsRead}
                              onMarkAsUnread={onMarkAsUnread}
                              onDelete={onDeleteMessage}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="destructive" size="sm" onClick={() => onDeleteMessage(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile kortelės */}
      <div className="md:hidden grid gap-3">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={message.status === "unread" ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                {message.status === "unread" ? (
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <MailOpen className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${message.status === "unread" ? "text-gray-900 dark:text-gray-100" : ""}`}>
                    {message.name}
                  </div>
                  <div className={`text-sm truncate ${message.status === "unread" ? "text-gray-700 dark:text-gray-300" : "text-muted-foreground"}`}>
                    {message.email}
                  </div>
                </div>
                <Badge variant={message.status === "unread" ? "default" : "secondary"} className="flex-shrink-0">
                  {message.status === "unread" ? "Naujas" : "Skaitytas"}
                </Badge>
              </div>

              <div className="mb-3">
                <div className={`font-medium text-sm mb-1 line-clamp-2 ${message.status === "unread" ? "text-gray-900 dark:text-gray-100" : ""}`}>
                  {message.subject}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(message.created_at), "yyyy-MM-dd HH:mm", { locale: lt })}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => onViewMessage(message)} className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Peržiūrėti
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] md:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Kontakto pranešimas</DialogTitle>
                    </DialogHeader>
                    {selectedMessage && (
                      <MessageDialog
                        message={selectedMessage}
                        onMarkAsRead={onMarkAsRead}
                        onMarkAsUnread={onMarkAsUnread}
                        onDelete={onDeleteMessage}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="destructive" size="sm" onClick={() => onDeleteMessage(message.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
