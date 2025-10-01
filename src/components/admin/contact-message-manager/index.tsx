import { useState } from "react";
import { useContactMessages, useMessageActions } from "./contact-message-manager.hooks";
import { MessageHeader } from "./message-header";
import { MessageTable } from "./message-table";
import type { ContactMessage, MessageFilter } from "./contact-message-manager.types";

const ContactMessageManager = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<MessageFilter>("all");

  const { messages, loading, setMessages } = useContactMessages();
  const { markAsRead, markAsUnread, deleteMessage } = useMessageActions(messages, setMessages);

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;
    return message.status === filter;
  });

  const unreadCount = messages.filter((msg) => msg.status === "unread").length;

  if (loading && messages.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <MessageHeader
        totalCount={messages.length}
        unreadCount={unreadCount}
        filter={filter}
        onFilterChange={setFilter}
      />

      <MessageTable
        messages={filteredMessages}
        filter={filter}
        selectedMessage={selectedMessage}
        onViewMessage={handleViewMessage}
        onDeleteMessage={deleteMessage}
        onMarkAsRead={markAsRead}
        onMarkAsUnread={markAsUnread}
      />
    </div>
  );
};

export default ContactMessageManager;
