import { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronRight, Type, Layout, MessageSquare, Star, Minus, Image, Footprints, Bot, Box, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ContentBlock, ContentBlockType } from "@/types/email";

const blockMeta: Record<ContentBlockType, { label: string; icon: React.ElementType }> = {
  hero: { label: "Hero", icon: Layout },
  features: { label: "Feature Cards", icon: Star },
  callout: { label: "Callout Box", icon: MessageSquare },
  text: { label: "Text Block", icon: Type },
  topbar: { label: "Top Bar", icon: Layout },
  "live-status": { label: "Live Status", icon: Zap },
  "feature-card": { label: "Feature Card", icon: Star },
  "strategy-box": { label: "Strategy Box", icon: Box },
  "ai-card": { label: "AI Card", icon: Bot },
  footer: { label: "Footer", icon: Footprints },
  divider: { label: "Divider", icon: Minus },
  "image-placeholder": { label: "Image", icon: Image },
};

/** Meta field definitions per block type */
const metaFields: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  topbar: [
    { key: "brandName", label: "Brand Name" },
    { key: "byline", label: "Byline" },
    { key: "partnerName", label: "Partner Name" },
    { key: "partnerSub", label: "Partner Subtitle" },
    { key: "label", label: "Label" },
  ],
  hero: [
    { key: "pill", label: "Pill Text" },
    { key: "pillEmoji", label: "Pill Emoji" },
    { key: "title", label: "Title" },
    { key: "titleHighlight", label: "Title Highlight" },
    { key: "body", label: "Body", multiline: true },
  ],
  text: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "eyebrowEmoji", label: "Eyebrow Emoji" },
    { key: "title", label: "Title" },
    { key: "body", label: "Body", multiline: true },
  ],
  "live-status": [
    { key: "title", label: "Status Title" },
  ],
  "feature-card": [
    { key: "icon", label: "Icon Emoji" },
    { key: "name", label: "Feature Name" },
    { key: "subtitle", label: "Subtitle" },
    { key: "badge", label: "Badge Text" },
    { key: "description", label: "Description", multiline: true },
  ],
  "strategy-box": [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "eyebrowEmoji", label: "Eyebrow Emoji" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
    { key: "body", label: "Body", multiline: true },
  ],
  "ai-card": [
    { key: "label", label: "Label" },
    { key: "labelEmoji", label: "Label Emoji" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    { key: "variant", label: "Variant (purple/navy)" },
  ],
  footer: [
    { key: "brandName", label: "Brand Name" },
    { key: "byline", label: "Byline" },
    { key: "tagline", label: "Tagline", multiline: true },
    { key: "note", label: "Note" },
  ],
};

interface ContentBlockEditorProps {
  block: ContentBlock;
  onChange: (id: string, content: string) => void;
  onMetaChange: (id: string, meta: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}

export function ContentBlockEditor({
  block,
  onChange,
  onMetaChange,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver,
}: ContentBlockEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const info = blockMeta[block.type] || { label: block.type, icon: Type };
  const Icon = info.icon;
  const fields = metaFields[block.type] || [];
  const hasMeta = fields.length > 0 || block.meta;

  let meta: Record<string, any> = {};
  try {
    meta = block.meta ? JSON.parse(block.meta) : {};
  } catch {
    meta = {};
  }

  const updateMetaField = (key: string, value: string) => {
    const updated = { ...meta, [key]: value };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  // For list items in live-status
  const updateListItem = (index: number, value: string) => {
    const items = [...(meta.items || [])];
    items[index] = value;
    const updated = { ...meta, items };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  const addListItem = () => {
    const items = [...(meta.items || []), ""];
    const updated = { ...meta, items };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  const removeListItem = (index: number) => {
    const items = [...(meta.items || [])];
    items.splice(index, 1);
    const updated = { ...meta, items };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  // For bullets in feature-card / ai-card
  const updateBullet = (index: number, field: string, value: string) => {
    const bullets = [...(meta.bullets || [])];
    bullets[index] = { ...bullets[index], [field]: value };
    const updated = { ...meta, bullets };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  const addBullet = () => {
    const bullets = [...(meta.bullets || [])];
    const isAi = block.type === "ai-card";
    bullets.push(isAi ? { title: "", text: "", check: "teal" } : { text: "", check: "teal" });
    const updated = { ...meta, bullets };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  const removeBullet = (index: number) => {
    const bullets = [...(meta.bullets || [])];
    bullets.splice(index, 1);
    const updated = { ...meta, bullets };
    onMetaChange(block.id, JSON.stringify(updated));
  };

  if (block.type === "divider") {
    return (
      <div
        className={`rounded-lg border bg-card shadow-card transition-all ${isDragging ? "opacity-40" : ""} ${isDragOver ? "ring-2 ring-primary" : ""}`}
        draggable
        onDragStart={() => onDragStart(block.id)}
        onDragOver={(e) => { e.preventDefault(); onDragOver(block.id); }}
        onDragEnd={onDragEnd}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-lg">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-card-foreground">{info.label}</span>
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onRemove(block.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border bg-card shadow-card transition-all ${isDragging ? "opacity-40" : ""} ${isDragOver ? "ring-2 ring-primary" : ""}`}
      draggable
      onDragStart={() => onDragStart(block.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(block.id); }}
      onDragEnd={onDragEnd}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40 rounded-t-lg cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" onClick={(e) => e.stopPropagation()} />
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-card-foreground">{info.label}</span>
        {meta.title || meta.name ? (
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            — {meta.title || meta.name}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          {/* Simple content blocks (features, callout, text without meta) */}
          {(!hasMeta || (block.type === "text" && !block.meta)) && (
            <Textarea
              value={block.content}
              onChange={(e) => onChange(block.id, e.target.value)}
              placeholder="Write your content here…"
              className="min-h-[80px] resize-none border bg-background text-sm"
            />
          )}

          {/* Meta fields */}
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label className="text-xs text-muted-foreground">{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  value={meta[field.key] || ""}
                  onChange={(e) => updateMetaField(field.key, e.target.value)}
                  className="min-h-[60px] resize-none border bg-background text-sm"
                />
              ) : (
                <Input
                  value={meta[field.key] || ""}
                  onChange={(e) => updateMetaField(field.key, e.target.value)}
                  className="h-8 text-sm bg-background"
                />
              )}
            </div>
          ))}

          {/* List items (live-status) */}
          {block.type === "live-status" && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status Items</Label>
              {((meta.items || []) as string[]).map((item: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <Input value={item} onChange={(e) => updateListItem(i, e.target.value)} className="h-8 text-sm bg-background flex-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeListItem(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addListItem} className="text-xs">+ Add Item</Button>
            </div>
          )}

          {/* Bullets (feature-card, ai-card) */}
          {(block.type === "feature-card" || block.type === "ai-card") && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Bullet Points</Label>
              {((meta.bullets || []) as any[]).map((bullet: any, i: number) => (
                <div key={i} className="rounded border bg-muted/20 p-2 space-y-1.5">
                  {block.type === "ai-card" && (
                    <Input
                      value={bullet.title || ""}
                      onChange={(e) => updateBullet(i, "title", e.target.value)}
                      placeholder="Title"
                      className="h-7 text-xs bg-background"
                    />
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={bullet.text || ""}
                      onChange={(e) => updateBullet(i, "text", e.target.value)}
                      placeholder="Description"
                      className="h-7 text-xs bg-background flex-1"
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeBullet(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addBullet} className="text-xs">+ Add Bullet</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
