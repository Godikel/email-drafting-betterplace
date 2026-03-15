import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { BuilderEmailState } from "@/types/builder";

export interface BuilderDraft {
  id: string;
  name: string;
  template_data: BuilderEmailState;
  created_at: string;
  updated_at: string;
}

export function useBuilderDrafts() {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<BuilderDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Failed to load drafts");
      return;
    }
    setDrafts((data || []) as unknown as BuilderDraft[]);
  }, []);

  const saveDraft = useCallback(async (email: BuilderEmailState) => {
    const serialized = JSON.stringify(email);
    if (serialized === lastSavedRef.current) return;
    if (!email.subject && !email.recipients && email.blocks.length === 0) return;

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
        .insert({ name: draftName, template_data: email as any, user_id: user?.id })
        .select("id")
        .single();
      if (data?.id) setDraftId(data.id);
    }
    await fetchDrafts();
  }, [draftId, fetchDrafts]);

  const autosave = useCallback((email: BuilderEmailState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveDraft(email), 1500);
  }, [saveDraft]);

  const deleteDraft = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete draft");
      return;
    }
    if (id === draftId) setDraftId(null);
    toast.success("Draft deleted");
    await fetchDrafts();
  }, [fetchDrafts, draftId]);

  const setActiveDraft = useCallback((id: string | null) => {
    setDraftId(id);
    lastSavedRef.current = "";
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { drafts, loading, fetchDrafts, deleteDraft, autosave, setActiveDraft, draftId };
}
