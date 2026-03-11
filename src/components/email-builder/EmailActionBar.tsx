import { Eye, Save, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailActionBarProps {
  onPreview: () => void;
  onSave: () => void;
  onSend: () => void;
  isSending: boolean;
}

export function EmailActionBar({ onPreview, onSave, onSend, isSending }: EmailActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onPreview} className="gap-1.5 shadow-card">
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      <Button variant="secondary" size="sm" onClick={onSave} className="gap-1.5 shadow-card">
        <Save className="h-4 w-4" />
        Save Template
      </Button>
      <Button size="sm" onClick={onSend} disabled={isSending} className="gap-1.5 shadow-card">
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Email
      </Button>
    </div>
  );
}
