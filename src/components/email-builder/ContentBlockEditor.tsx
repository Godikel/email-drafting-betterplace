import { GripVertical, Trash2, Type, Layout, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ContentBlock, ContentBlockType } from "@/types/email";

const blockMeta: Record<ContentBlockType, { label: string; icon: React.ElementType; placeholder: string }> = {
  hero: { label: "Hero", icon: Layout, placeholder: "Hero headline text…" },
  features: { label: "Feature Cards", icon: Star, placeholder: "Feature 1\nFeature 2\nFeature 3" },
  callout: { label: "Callout Box", icon: MessageSquare, placeholder: "Important callout message…" },
  text: { label: "Text Block", icon: Type, placeholder: "Write your content here…" },
};

interface ContentBlockEditorProps {
  block: ContentBlock;
  onChange: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

export function ContentBlockEditor({ block, onChange, onRemove }: ContentBlockEditorProps) {
  const meta = blockMeta[block.type];
  const Icon = meta.icon;

  return (
    <div className="rounded-lg border bg-card shadow-card animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40 rounded-t-lg">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-card-foreground">{meta.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="p-3">
        <Textarea
          value={block.content}
          onChange={(e) => onChange(block.id, e.target.value)}
          placeholder={meta.placeholder}
          className="min-h-[80px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm"
        />
      </div>
    </div>
  );
}
