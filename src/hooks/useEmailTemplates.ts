import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const [draftId, setDraftId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

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
      const { data, error } = await supabase
        .from("email_templates")
        .insert({ name, template_data: email as any })
        .select("id")
        .single();
      if (error) {
        toast.error("Failed to save template");
        return null;
      }
      toast.success(`Template "${name}" saved!`);
      return data?.id || true;
    }
    await fetchTemplates();
    return true;
  }, [fetchTemplates]);

  const saveDraft = useCallback(async (email: EmailState) => {
    const serialized = JSON.stringify(email);
    // Skip if nothing changed
    if (serialized === lastSavedRef.current) return;
    // Skip if template is completely empty
    if (!email.subject && !email.recipients && email.blocks.length === 0 && !email.rawHtml) return;

    lastSavedRef.current = serialized;
    const draftName = email.subject ? `Draft: ${email.subject}` : "Untitled Draft";

    if (draftId) {
      await supabase
        .from("email_templates")
        .update({ name: draftName, template_data: email as any })
        .eq("id", draftId);
    } else {
      const { data } = await supabase
        .from("email_templates")
        .insert({ name: draftName, template_data: email as any })
        .select("id")
        .single();
      if (data?.id) setDraftId(data.id);
    }
    await fetchTemplates();
  }, [draftId, fetchTemplates]);

  /** Call this on every email state change — it debounces to avoid spamming. */
  const autosaveDraft = useCallback((email: EmailState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveDraft(email), 1500);
  }, [saveDraft]);

  /** When loading an existing template, set it as the active draft so updates go to the same row. */
  const setActiveDraft = useCallback((id: string | null) => {
    setDraftId(id);
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete template");
      return;
    }
    if (id === draftId) setDraftId(null);
    toast.success("Template deleted");
    await fetchTemplates();
  }, [fetchTemplates, draftId]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { savedTemplates, loading, fetchTemplates, saveTemplate, deleteTemplate, autosaveDraft, setActiveDraft, draftId };
}
