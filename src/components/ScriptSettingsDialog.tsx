import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Loader2 } from "lucide-react";
import { useScriptSettings } from "@/hooks/useScriptSettings";

export function ScriptSettingsDialog() {
  const { scriptUrl, loading, saving, saveScriptUrl } = useScriptSettings();
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setUrl(scriptUrl);
  }, [open, scriptUrl]);

  const handleSave = async () => {
    await saveScriptUrl(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings className="h-4 w-4" />
          Script Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Email Script Settings</DialogTitle>
          <DialogDescription>
            Enter your Google Apps Script URL. This is used to send emails and is private to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="script-url">Google Apps Script URL</Label>
            <Input
              id="script-url"
              placeholder="https://script.google.com/macros/s/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Deploy your Apps Script as a web app and paste the URL here. Only you can see and use this URL.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="w-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
