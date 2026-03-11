import { Eye, Save, Send, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailActionBarProps {
  onPreview: () => void;
  onSave: () => void;
  onSend: () => void;
  isSending: boolean;
  onUploadHtml: () => void;
  hasRawHtml: boolean;
  onClearRawHtml: () => void;
}

export function EmailActionBar({ onPreview, onSave, onSend, isSending, onUploadHtml, hasRawHtml, onClearRawHtml }: EmailActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      {hasRawHtml ? (
        <Button variant="destructive" size="sm" onClick={onClearRawHtml} className="gap-1.5 shadow-card">
          <X className="h-4 w-4" />
          Clear HTML
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={onUploadHtml} className="gap-1.5 shadow-card">
          <Upload className="h-4 w-4" />
          Upload HTML
        </Button>
      )}
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
