import type { Database } from "@/integrations/supabase/types";

export type YouTubeFormData = Database["public"]["Tables"]["tools"]["Insert"];

export interface YouTubeEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}
