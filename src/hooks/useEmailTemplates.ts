import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EmailState } from "@/types/email";

export interface SavedTemplate {
  id: string;
  name: string;
  template_data: EmailState;
  created_at: string;
  updated_at: string;
}

export function useEmailTemplates() {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Failed to load saved templates");
      return;
    }
    setSavedTemplates((data || []) as unknown as SavedTemplate[]);
  }, []);

  const saveTemplate = useCallback(async (name: string, email: EmailState, existingId?: string) => {
    if (existingId) {
      const { error } = await supabase
        .from("email_templates")
        .update({ name, template_data: email as any })
        .eq("id", existingId);
      if (error) {
        toast.error("Failed to update template");
        return null;
      }
      toast.success(`Template "${name}" updated!`);
    } else {
      const { error } = await supabase
        .from("email_templates")
        .insert({ name, template_data: email as any });
      if (error) {
        toast.error("Failed to save template");
        return null;
      }
      toast.success(`Template "${name}" saved!`);
    }
    await fetchTemplates();
    return true;
  }, [fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete template");
      return;
    }
    toast.success("Template deleted");
    await fetchTemplates();
  }, [fetchTemplates]);

  return { savedTemplates, loading, fetchTemplates, saveTemplate, deleteTemplate };
}
