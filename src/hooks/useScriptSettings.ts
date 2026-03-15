import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useScriptSettings() {
  const { user } = useAuth();
  const [scriptUrl, setScriptUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("user_script_settings")
      .select("script_url")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setScriptUrl(data.script_url);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveScriptUrl = useCallback(async (url: string) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_script_settings")
      .upsert({ user_id: user.id, script_url: url }, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast.error("Failed to save script URL");
    } else {
      setScriptUrl(url);
      toast.success("Script URL saved!");
    }
  }, [user]);

  return { scriptUrl, loading, saving, saveScriptUrl };
}
