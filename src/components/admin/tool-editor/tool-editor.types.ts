import type { Database } from "@/integrations/supabase/types";

export type ToolFormData = Database["public"]["Tables"]["tools"]["Insert"];

export interface ToolEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}
