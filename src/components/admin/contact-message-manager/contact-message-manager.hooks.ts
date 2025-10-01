import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { log } from "@/utils/browserLogger";
import type { ContactMessage } from "./contact-message-manager.types";

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalized: ContactMessage[] = (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        created_at: row.created_at,
        status: row.status === "read" ? ("read" as const) : ("unread" as const),
      }));
      setMessages(normalized);
    } catch (error) {
      log.error("Error fetching contact messages:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti kontaktų pranešimų.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, setMessages };
};

export const useMessageActions = (
  messages: ContactMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>
) => {
  const { toast } = useToast();

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);

      if (error) throw error;

      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "read" as const } : msg)));

      toast({
        title: "Sėkmė",
        description: "Pranešimas pažymėtas kaip perskaitytas.",
      });
    } catch (error) {
      log.error("Error marking message as read:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko pažymėti pranešimo.",
        variant: "destructive",
      });
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: "unread" })
        .eq("id", id);

      if (error) throw error;

      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, status: "unread" as const } : msg))
      );

      toast({
        title: "Sėkmė",
        description: "Pranešimas pažymėtas kaip neperskaitytas.",
      });
    } catch (error) {
      log.error("Error marking message as unread:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko pažymėti pranešimo.",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Ar tikrai norite ištrinti šį pranešimą?")) {
      return;
    }

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);

      if (error) throw error;

      setMessages(messages.filter((msg) => msg.id !== id));

      toast({
        title: "Sėkmė",
        description: "Pranešimas sėkmingai ištrintas.",
      });
    } catch (error) {
      log.error("Error deleting message:", error);
      toast({
        title: "Klaida",
        description: `Nepavyko ištrinti pranešimo: ${error instanceof Error ? error.message : typeof error === "string" ? error : "nežinoma klaida"}`,
        variant: "destructive",
      });
    }
  };

  return { markAsRead, markAsUnread, deleteMessage };
};
