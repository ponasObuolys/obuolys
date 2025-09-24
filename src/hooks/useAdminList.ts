import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables } from "@/integrations/supabase/types";
import { createErrorReport, reportError } from "@/utils/errorReporting";

type PublicTableName = keyof Database["public"]["Tables"];

interface UseAdminListOptions<TName extends PublicTableName> {
  tableName: TName;
  selectFields?: string;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  onDelete?: () => void;
}

interface UseAdminListResult<T> {
  items: T[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  deleteItem: (id: string, confirmMessage?: string) => Promise<void>;
}

/**
 * Shared hook for admin list components providing common CRUD patterns
 * @param options Configuration object for the list behavior
 * @returns Object with items, loading state, and common functions
 */
export function useAdminList<
  TName extends PublicTableName,
  TRow extends { id: string } = Tables<TName> & { id: string },
>({
  tableName,
  selectFields = "*",
  orderByField = "created_at",
  orderDirection = "desc",
  onDelete,
}: UseAdminListOptions<TName>): UseAdminListResult<TRow> {
  const [items, setItems] = useState<TRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const query = supabase
        .from(tableName)
        .select(selectFields)
        .order(orderByField, { ascending: orderDirection === "asc" });

      const { data, error } = await query;

      if (error) throw error;
      setItems((data as unknown as TRow[]) || []);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      const report = createErrorReport(err, {
        errorBoundary: "useAdminList.fetchItems",
        additionalData: { tableName, orderByField, orderDirection, selectFields },
      });
      reportError(report);
      toast({
        title: "Klaida",
        description: `Nepavyko gauti ${getTableDisplayName(tableName)} sąrašo.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [tableName, selectFields, orderByField, orderDirection, toast]);

  const deleteItem = useCallback(
    async (id: string, confirmMessage?: string) => {
      const defaultConfirmMessage = `Ar tikrai norite ištrinti šį ${getTableDisplayName(tableName, "singular")}?`;

      if (!window.confirm(confirmMessage || defaultConfirmMessage)) return;

      try {
        const { error } = await supabase.from(tableName).delete().match({ id });

        if (error) throw error;

        toast({
          title: "Sėkmingai ištrinta",
          description: `${getTableDisplayName(tableName, "singular")} buvo sėkmingai ${getDeletedForm(tableName)}.`,
        });

        await fetchItems();
        onDelete?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        const report = createErrorReport(err, {
          errorBoundary: "useAdminList.deleteItem",
          additionalData: { tableName, id },
        });
        reportError(report);
        toast({
          title: "Klaida",
          description: `Nepavyko ištrinti ${getTableDisplayName(tableName, "singular")}: ${
            error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "nežinoma klaida"
          }`,
          variant: "destructive",
        });
      }
    },
    [tableName, toast, fetchItems, onDelete]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    fetchItems,
    deleteItem,
  };
}

/**
 * Helper function to get Lithuanian display names for tables
 */
function getTableDisplayName(tableName: string, form: "plural" | "singular" = "plural"): string {
  const displayNames = {
    articles: { plural: "publikacijų", singular: "publikacija" },
    tools: { plural: "įrankių", singular: "įrankis" },
    courses: { plural: "kursų", singular: "kursas" },
  };

  return displayNames[tableName as keyof typeof displayNames]?.[form] || tableName;
}

/**
 * Helper function to get correct Lithuanian deleted form
 */
function getDeletedForm(tableName: string): string {
  const deletedForms = {
    articles: "ištrinta",
    tools: "ištrintas",
    courses: "ištrintas",
  };

  return deletedForms[tableName as keyof typeof deletedForms] || "ištrinta";
}
