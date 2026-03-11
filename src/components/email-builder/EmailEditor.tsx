import { PlusCircle, Layout, Star, MessageSquare, Type, Minus, Bot, Box, Zap, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentBlockEditor } from "./ContentBlockEditor";
import type { EmailState, ContentBlockType } from "@/types/email";

const templates = [
  { value: "welcome", label: "Welcome Series" },
  { value: "promo", label: "Promotional" },
  { value: "newsletter", label: "Newsletter" },
  { value: "blank", label: "Blank" },
  { value: "ai-roadmap", label: "AI Roadmap" },
];

const addBlockOptions: { type: ContentBlockType; label: string; icon: React.ElementType }[] = [
  { type: "topbar", label: "Top Bar", icon: Layout },
  { type: "hero", label: "Hero", icon: Layout },
  { type: "text", label: "Text", icon: Type },
  { type: "live-status", label: "Live Status", icon: Zap },
  { type: "feature-card", label: "Feature Card", icon: Star },
  { type: "strategy-box", label: "Strategy Box", icon: Box },
  { type: "ai-card", label: "AI Card", icon: Bot },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "footer", label: "Footer", icon: Footprints },
  { type: "features", label: "Features (simple)", icon: Star },
  { type: "callout", label: "Callout", icon: MessageSquare },
];

interface EmailEditorProps {
  email: EmailState;
  onChange: (update: Partial<EmailState>) => void;
  onBlockChange: (id: string, content: string) => void;
  onBlockMetaChange: (id: string, meta: string) => void;
  onBlockRemove: (id: string) => void;
  onBlockAdd: (type: ContentBlockType) => void;
  onBlockReorder: (fromId: string, toId: string) => void;
  dragState: { dragging: string | null; over: string | null };
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
}

export function EmailEditor({
  email,
  onChange,
  onBlockChange,
  onBlockMetaChange,
  onBlockRemove,
  onBlockAdd,
  dragState,
  onDragStart,
  onDragOver,
  onDragEnd,
}: EmailEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Compose Email</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject…"
              value={email.subject}
              onChange={(e) => onChange({ subject: e.target.value })}
              className="shadow-card"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="recipients" className="text-sm font-medium">Recipients</Label>
            <Input
              id="recipients"
              placeholder="e.g. team@company.com, user@example.com"
              value={email.recipients}
              onChange={(e) => onChange({ recipients: e.target.value })}
              className="shadow-card"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Template</Label>
            <Select
              value={email.template}
              onValueChange={(v) => onChange({ template: v })}
            >
              <SelectTrigger className="shadow-card">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Content Sections ({email.blocks.length})
        </h3>
        <div className="space-y-2">
          {email.blocks.map((block) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onChange={onBlockChange}
              onMetaChange={onBlockMetaChange}
              onRemove={onBlockRemove}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              isDragging={dragState.dragging === block.id}
              isDragOver={dragState.over === block.id}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {addBlockOptions.map((opt) => (
            <Button
              key={opt.type}
              variant="outline"
              size="sm"
              onClick={() => onBlockAdd(opt.type)}
              className="gap-1.5 shadow-card text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
