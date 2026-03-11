import { useState, useRef, useCallback } from "react";
import { GripVertical, Trash2, Plus, ArrowUp, ArrowDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockStylePanel, stylesToCss } from "./BlockStylePanel";
import type { BlockStyles } from "./BlockStylePanel";
import type { ContentBlock, ContentBlockType } from "@/types/email";

/* ── helpers ── */
function parseMeta(block: ContentBlock): Record<string, any> {
  try {
    return block.meta ? JSON.parse(block.meta) : {};
  } catch {
    return {};
  }
}

/* ── Inline-editable text span ── */
function Editable({
  value,
  onChange,
  className = "",
  style = {},
  multiline = false,
  as = "span",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  as?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const handleBlur = () => {
    if (ref.current) {
      const text = multiline ? ref.current.innerText : ref.current.textContent || "";
      if (text !== value) onChange(text);
    }
  };

  const commonProps = {
    ref: ref as any,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    className: `outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 rounded px-0.5 cursor-text transition-shadow ${className}`,
    style: { ...style, minWidth: "20px", display: multiline ? "block" : "inline" } as React.CSSProperties,
    dangerouslySetInnerHTML: { __html: value.replace(/\n/g, "<br/>") },
  };

  if (as === "h1") return <h1 {...commonProps} />;
  if (as === "h2") return <h2 {...commonProps} />;
  if (as === "h3") return <h3 {...commonProps} />;
  if (as === "h4") return <h4 {...commonProps} />;
  if (as === "p") return <p {...commonProps} />;
  if (as === "div") return <div {...commonProps} />;
  if (as === "strong") return <strong {...commonProps} />;
  return <span {...commonProps} />;
}

/* ── Block wrapper with controls ── */
function BlockWrapper({
  block,
  isSelected,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onStyleOpen,
  isFirst,
  isLast,
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver,
  customStyle,
}: {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStyleOpen: () => void;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
  customStyle: React.CSSProperties;
}) {
  return (
    <div
      className={`relative group transition-all ${isDragging ? "opacity-40" : ""} ${isDragOver ? "ring-2 ring-primary ring-offset-2" : ""} ${isSelected ? "ring-2 ring-primary/60 ring-offset-1" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragEnd={onDragEnd}
    >
      {/* Floating toolbar */}
      <div
        className={`absolute -left-11 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-10 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}
      >
        <button
          className="p-1 rounded hover:bg-muted text-muted-foreground cursor-grab"
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        {!isFirst && (
          <button
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            title="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        )}
        {!isLast && (
          <button
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            title="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"
          onClick={(e) => { e.stopPropagation(); onStyleOpen(); }}
          title="Style settings"
        >
          <Palette className="h-3.5 w-3.5" />
        </button>
        <button
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Remove block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div style={customStyle}>
        {children}
      </div>
    </div>
  );
}

/* ── Visual block renderers ── */

function VisualTopbar({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  return (
    <div style={{ background: "#ffffff", padding: "16px 32px", borderBottom: "1px solid #e8ecf0" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://radiant-reply-room.lovable.app/images/skillbetter-logo.png" alt="Logo" style={{ height: 34 }} />
          <div style={{ width: 1, height: 28, background: "#d0d8e0" }} />
          <div style={{ background: "#f0f4f8", border: "1px solid #dde3ea", borderRadius: 10, padding: "8px 14px" }}>
            <div className="flex items-center gap-1.5">
              <span>🤝</span>
              <Editable
                value={meta.partnerName || "PARTNER"}
                onChange={(v) => onMetaChange({ ...meta, partnerName: v })}
                style={{ fontSize: 10, fontWeight: 700, color: "#1a3c6e", letterSpacing: 0.5 }}
              />
            </div>
            <Editable
              value={meta.partnerSub || ""}
              onChange={(v) => onMetaChange({ ...meta, partnerSub: v })}
              style={{ fontSize: 9, fontWeight: 600, color: "#7a8a9a", marginTop: 4 }}
              as="div"
            />
          </div>
        </div>
        <Editable
          value={meta.label || "Update"}
          onChange={(v) => onMetaChange({ ...meta, label: v })}
          style={{ fontSize: 11, fontWeight: 700, color: "#1a6fa8" }}
        />
      </div>
    </div>
  );
}

function VisualHero({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  return (
    <div style={{ background: "linear-gradient(155deg, #0c2752 0%, #1a4a8a 55%, #1568a8 100%)", padding: "50px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(77,184,200,0.16)", border: "1px solid rgba(77,184,200,0.38)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
        <Editable
          value={meta.pillEmoji || "🚀"}
          onChange={(v) => onMetaChange({ ...meta, pillEmoji: v })}
          style={{ fontSize: 12 }}
        />
        <Editable
          value={meta.pill || "UPDATE"}
          onChange={(v) => onMetaChange({ ...meta, pill: v })}
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: "#7de8f4" }}
        />
      </div>
      <Editable
        value={meta.title || "Headline"}
        onChange={(v) => onMetaChange({ ...meta, title: v })}
        as="h1"
        style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", lineHeight: 1.22, marginBottom: 18, maxWidth: 520 }}
      />
      <Editable
        value={meta.titleHighlight || ""}
        onChange={(v) => onMetaChange({ ...meta, titleHighlight: v })}
        as="span"
        style={{ fontSize: 34, fontWeight: 800, color: "#4db8c8", lineHeight: 1.22 }}
      />
      <Editable
        value={meta.body || ""}
        onChange={(v) => onMetaChange({ ...meta, body: v })}
        as="p"
        multiline
        style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.78, maxWidth: 490, marginTop: 18 }}
      />
    </div>
  );
}

function VisualSectionText({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  return (
    <div style={{ padding: "42px 40px 0" }}>
      {meta.eyebrow && (
        <div className="flex items-center gap-2 mb-2">
          <Editable
            value={meta.eyebrowEmoji || ""}
            onChange={(v) => onMetaChange({ ...meta, eyebrowEmoji: v })}
            style={{ fontSize: 12 }}
          />
          <Editable
            value={meta.eyebrow}
            onChange={(v) => onMetaChange({ ...meta, eyebrow: v })}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: "#1a6fa8" }}
          />
        </div>
      )}
      {meta.title && (
        <Editable
          value={meta.title}
          onChange={(v) => onMetaChange({ ...meta, title: v })}
          as="h2"
          style={{ fontSize: 21, fontWeight: 700, color: "#0c2752", lineHeight: 1.3, marginBottom: 13 }}
        />
      )}
      {meta.body && (
        <Editable
          value={meta.body}
          onChange={(v) => onMetaChange({ ...meta, body: v })}
          as="p"
          multiline
          style={{ fontSize: 13.5, color: "#4a5e72", lineHeight: 1.78 }}
        />
      )}
    </div>
  );
}

function VisualLiveStatus({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  const items = (meta.items || []) as string[];
  return (
    <div style={{ padding: "0 40px" }}>
      <div style={{ background: "#f0fdf6", border: "1px solid #b8efd4", borderLeft: "4px solid #22c55e", borderRadius: 10, padding: "17px 20px", marginTop: 20 }}>
        <div className="flex items-start gap-3">
          <div style={{ width: 11, height: 11, background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 0 4px rgba(34,197,94,0.17)", marginTop: 4, flexShrink: 0 }} />
          <div>
            <Editable
              value={meta.title || "Status"}
              onChange={(v) => onMetaChange({ ...meta, title: v })}
              as="h4"
              style={{ fontSize: 13.5, fontWeight: 600, color: "#14532d", marginBottom: 8 }}
            />
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ display: "inline-block", width: 18, height: 18, lineHeight: "18px", textAlign: "center", borderRadius: "999px", background: "#d5f1df", color: "#166534", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <Editable
                    value={item.replace(/\s*[✓✔]$/, "")}
                    onChange={(v) => {
                      const newItems = [...items];
                      newItems[i] = v;
                      onMetaChange({ ...meta, items: newItems });
                    }}
                    style={{ fontSize: 12, color: "#166534", lineHeight: 1.55 }}
                  />
                </div>
              ))}
              <button
                className="text-xs text-primary hover:underline mt-1"
                onClick={() => onMetaChange({ ...meta, items: [...items, "New item"] })}
              >
                + Add item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualDivider() {
  return <div style={{ height: 1, background: "linear-gradient(to right, transparent, #d4dfe8, transparent)", margin: "40px 40px 0" }} />;
}

function VisualFeatureCard({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  const bullets = (meta.bullets || []) as { text: string; check: string }[];
  const iconBg = meta.iconColor === "navy" ? "#dfe7f5" : "#dceff2";
  const checkColors: Record<string, { bg: string; color: string }> = {
    teal: { bg: "#d5f1f4", color: "#0f7c90" },
    navy: { bg: "#dae6ff", color: "#2457d6" },
    purple: { bg: "#ece6ff", color: "#6d28d9" },
  };

  return (
    <div style={{ padding: "0 40px" }}>
      <div style={{ border: "1px solid #e0eaf2", borderRadius: 12, overflow: "hidden", marginTop: 18 }}>
        <div style={{ padding: "17px 20px 13px", background: "#fff" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              <Editable
                value={meta.icon || "⭐"}
                onChange={(v) => onMetaChange({ ...meta, icon: v })}
              />
            </div>
            <div className="flex-1">
              <Editable
                value={meta.name || "Feature"}
                onChange={(v) => onMetaChange({ ...meta, name: v })}
                as="div"
                style={{ fontSize: 14, fontWeight: 700, color: "#0c2752" }}
              />
              <Editable
                value={meta.subtitle || ""}
                onChange={(v) => onMetaChange({ ...meta, subtitle: v })}
                as="div"
                style={{ fontSize: 11, color: "#7a8ea0", marginTop: 4 }}
              />
            </div>
            {meta.badge && (
              <Editable
                value={meta.badge}
                onChange={(v) => onMetaChange({ ...meta, badge: v })}
                style={{ padding: "3px 10px", borderRadius: 20, background: "#fff8e1", color: "#92530a", border: "1px solid #f9c846", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}
              />
            )}
          </div>
        </div>
        <div style={{ padding: "14px 20px 18px", background: "#f8fafb", borderTop: "1px solid #edf2f6" }}>
          {meta.description && (
            <Editable
              value={meta.description}
              onChange={(v) => onMetaChange({ ...meta, description: v })}
              as="p"
              multiline
              style={{ fontSize: 12.5, color: "#516070", lineHeight: 1.65, marginBottom: 16 }}
            />
          )}
          <div className="space-y-2.5">
            {bullets.map((b, i) => {
              const c = checkColors[b.check] || checkColors.teal;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ display: "inline-block", width: 18, height: 18, lineHeight: "18px", textAlign: "center", borderRadius: "999px", background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <Editable
                    value={b.text}
                    onChange={(v) => {
                      const newBullets = [...bullets];
                      newBullets[i] = { ...b, text: v };
                      onMetaChange({ ...meta, bullets: newBullets });
                    }}
                    style={{ fontSize: 13, color: "#3d4f60", lineHeight: 1.62 }}
                  />
                  <button
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive ml-1 flex-shrink-0"
                    onClick={() => {
                      const newBullets = bullets.filter((_, idx) => idx !== i);
                      onMetaChange({ ...meta, bullets: newBullets });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => onMetaChange({ ...meta, bullets: [...bullets, { text: "New bullet point", check: meta.iconColor || "teal" }] })}
            >
              + Add bullet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualStrategyBox({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  return (
    <div style={{ padding: "42px 40px 0" }}>
      <div className="flex items-center gap-2 mb-2">
        <Editable value={meta.eyebrowEmoji || ""} onChange={(v) => onMetaChange({ ...meta, eyebrowEmoji: v })} style={{ fontSize: 12 }} />
        <Editable value={meta.eyebrow || ""} onChange={(v) => onMetaChange({ ...meta, eyebrow: v })} style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: "#1a6fa8" }} />
      </div>
      <Editable value={meta.title || ""} onChange={(v) => onMetaChange({ ...meta, title: v })} as="h2" style={{ fontSize: 21, fontWeight: 700, color: "#0c2752", lineHeight: 1.3, marginBottom: 13 }} />
      <div style={{ background: "linear-gradient(135deg, #edf3fb 0%, #e4eefc 100%)", border: "1px solid #c5d6ee", borderRadius: 12, padding: "24px 26px", marginTop: 18 }}>
        {meta.subtitle && (
          <div className="flex items-center gap-2 mb-2">
            <Editable value={meta.subtitleEmoji || ""} onChange={(v) => onMetaChange({ ...meta, subtitleEmoji: v })} style={{ fontSize: 14 }} />
            <Editable value={meta.subtitle} onChange={(v) => onMetaChange({ ...meta, subtitle: v })} as="h4" style={{ fontSize: 14, fontWeight: 700, color: "#0c2752" }} />
          </div>
        )}
        <Editable value={meta.body || ""} onChange={(v) => onMetaChange({ ...meta, body: v })} as="p" multiline style={{ fontSize: 13, color: "#3d4f60", lineHeight: 1.78 }} />
      </div>
    </div>
  );
}

function VisualAiCard({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  const isPurple = meta.variant === "purple";
  const topBg = isPurple ? "linear-gradient(135deg, #3b1a7a, #5a38ae)" : "linear-gradient(135deg, #0c2752, #1a4a8a)";
  const labelBg = isPurple ? "rgba(255,255,255,0.14)" : "rgba(77,184,200,0.18)";
  const labelColor = isPurple ? "#ddd6fe" : "#7de8f4";

  const bullets = (meta.bullets || []) as { title: string; text: string; check: string }[];
  const checkColors: Record<string, { bg: string; color: string }> = {
    teal: { bg: "#d5f1f4", color: "#0f7c90" },
    navy: { bg: "#dae6ff", color: "#2457d6" },
    purple: { bg: "#ece6ff", color: "#6d28d9" },
  };

  return (
    <div style={{ padding: "0 40px" }}>
      <div style={{ border: "1px solid #e0eaf2", borderRadius: 12, overflow: "hidden", marginTop: 20 }}>
        <div style={{ padding: "20px 24px 16px", background: topBg }}>
          <div className="flex gap-3.5 items-start">
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.12)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>
              <Editable value={meta.labelEmoji || "🧠"} onChange={(v) => onMetaChange({ ...meta, labelEmoji: v })} />
            </div>
            <div>
              <Editable
                value={meta.label || "AI"}
                onChange={(v) => onMetaChange({ ...meta, label: v })}
                style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: labelBg, color: labelColor, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 6 }}
              />
              <Editable
                value={meta.title || ""}
                onChange={(v) => onMetaChange({ ...meta, title: v })}
                as="h3"
                style={{ fontSize: 15.5, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 6 }}
              />
              <Editable
                value={meta.subtitle || ""}
                onChange={(v) => onMetaChange({ ...meta, subtitle: v })}
                as="p"
                multiline
                style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "18px 24px 22px", background: "#fff" }}>
          <div className="space-y-3">
            {bullets.map((b, i) => {
              const c = checkColors[b.check] || checkColors.teal;
              return (
                <div key={i} className="flex items-start gap-2.5 group/bullet">
                  <span style={{ display: "inline-block", width: 18, height: 18, lineHeight: "18px", textAlign: "center", borderRadius: "999px", background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <div className="flex-1">
                    <Editable
                      value={b.title}
                      onChange={(v) => {
                        const newBullets = [...bullets];
                        newBullets[i] = { ...b, title: v };
                        onMetaChange({ ...meta, bullets: newBullets });
                      }}
                      as="strong"
                      style={{ color: "#0c2752", fontWeight: 700, fontSize: 13 }}
                    />
                    <span style={{ color: "#3d4f60", fontSize: 13 }}> — </span>
                    <Editable
                      value={b.text}
                      onChange={(v) => {
                        const newBullets = [...bullets];
                        newBullets[i] = { ...b, text: v };
                        onMetaChange({ ...meta, bullets: newBullets });
                      }}
                      style={{ fontSize: 13, color: "#3d4f60", lineHeight: 1.62 }}
                    />
                  </div>
                  <button
                    className="opacity-0 group-hover/bullet:opacity-100 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => {
                      const newBullets = bullets.filter((_, idx) => idx !== i);
                      onMetaChange({ ...meta, bullets: newBullets });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => onMetaChange({ ...meta, bullets: [...bullets, { title: "New Title", text: "Description", check: isPurple ? "purple" : "teal" }] })}
            >
              + Add bullet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualFooter({ meta, onMetaChange }: { meta: Record<string, any>; onMetaChange: (m: Record<string, any>) => void }) {
  return (
    <div style={{ background: "#f6f9fc", borderTop: "2px solid #e0eaf2", padding: "30px 40px", textAlign: "center" }}>
      <div style={{ marginBottom: 18 }}>
        <img src="https://radiant-reply-room.lovable.app/images/skillbetter-logo.png" alt="Logo" style={{ height: 32, margin: "0 auto", display: "block" }} />
      </div>
      <Editable
        value={meta.tagline || ""}
        onChange={(v) => onMetaChange({ ...meta, tagline: v })}
        as="p"
        multiline
        style={{ fontSize: 13, color: "#4a5e72", lineHeight: 1.7, marginBottom: 16 }}
      />
      <Editable
        value={meta.note || ""}
        onChange={(v) => onMetaChange({ ...meta, note: v })}
        as="p"
        style={{ fontSize: 10, color: "#a0adb8", marginTop: 14 }}
      />
    </div>
  );
}

/* ── Main visual editor ── */

interface VisualEmailEditorProps {
  blocks: ContentBlock[];
  onBlockMetaChange: (id: string, meta: string) => void;
  onBlockRemove: (id: string) => void;
  onBlockReorder: (fromId: string, toId: string) => void;
}

export function VisualEmailEditor({ blocks, onBlockMetaChange, onBlockRemove, onBlockReorder }: VisualEmailEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stylePanelId, setStylePanelId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ dragging: string | null; over: string | null }>({ dragging: null, over: null });

  const handleMetaChange = useCallback(
    (id: string, newMeta: Record<string, any>) => {
      onBlockMetaChange(id, JSON.stringify(newMeta));
    },
    [onBlockMetaChange]
  );

  const handleStyleChange = useCallback(
    (id: string, newStyles: BlockStyles) => {
      const block = blocks.find((b) => b.id === id);
      if (!block) return;
      const meta = parseMeta(block);
      handleMetaChange(id, { ...meta, _styles: newStyles });
    },
    [blocks, handleMetaChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) onBlockReorder(blocks[index].id, blocks[index - 1].id);
    },
    [blocks, onBlockReorder]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < blocks.length - 1) onBlockReorder(blocks[index].id, blocks[index + 1].id);
    },
    [blocks, onBlockReorder]
  );

  const handleDragEnd = useCallback(() => {
    if (dragState.dragging && dragState.over && dragState.dragging !== dragState.over) {
      onBlockReorder(dragState.dragging, dragState.over);
    }
    setDragState({ dragging: null, over: null });
  }, [dragState, onBlockReorder]);

  const renderBlock = (block: ContentBlock) => {
    const meta = parseMeta(block);
    const onMC = (m: Record<string, any>) => handleMetaChange(block.id, m);

    switch (block.type) {
      case "topbar":
        return <VisualTopbar meta={meta} onMetaChange={onMC} />;
      case "hero":
        return <VisualHero meta={meta} onMetaChange={onMC} />;
      case "text":
        return <VisualSectionText meta={meta} onMetaChange={onMC} />;
      case "live-status":
        return <VisualLiveStatus meta={meta} onMetaChange={onMC} />;
      case "divider":
        return <VisualDivider />;
      case "feature-card":
        return <VisualFeatureCard meta={meta} onMetaChange={onMC} />;
      case "strategy-box":
        return <VisualStrategyBox meta={meta} onMetaChange={onMC} />;
      case "ai-card":
        return <VisualAiCard meta={meta} onMetaChange={onMC} />;
      case "footer":
        return <VisualFooter meta={meta} onMetaChange={onMC} />;
      default:
        return <div className="p-4 text-muted-foreground text-sm">Unknown block: {block.type}</div>;
    }
  };

  const stylePanelBlock = stylePanelId ? blocks.find((b) => b.id === stylePanelId) : null;
  const stylePanelMeta = stylePanelBlock ? parseMeta(stylePanelBlock) : {};

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Visual Editor</h3>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Click to edit • Drag to reorder • 🎨 to style
        </span>
      </div>
      <div className="flex-1 flex gap-4">
        <div
          className="flex-1 rounded-lg border bg-card shadow-card overflow-auto"
          onClick={() => { setSelectedId(null); }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
            <div className="pl-12 relative">
              {blocks.map((block, i) => {
                const meta = parseMeta(block);
                const blockStyles: BlockStyles = meta._styles || {};
                return (
                  <BlockWrapper
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => setSelectedId(block.id)}
                    onRemove={() => onBlockRemove(block.id)}
                    onMoveUp={() => handleMoveUp(i)}
                    onMoveDown={() => handleMoveDown(i)}
                    onStyleOpen={() => setStylePanelId(stylePanelId === block.id ? null : block.id)}
                    isFirst={i === 0}
                    isLast={i === blocks.length - 1}
                    onDragStart={() => setDragState({ dragging: block.id, over: null })}
                    onDragOver={() => setDragState((prev) => ({ ...prev, over: block.id }))}
                    onDragEnd={handleDragEnd}
                    isDragging={dragState.dragging === block.id}
                    isDragOver={dragState.over === block.id}
                    customStyle={stylesToCss(blockStyles)}
                  >
                    {renderBlock(block)}
                  </BlockWrapper>
                );
              })}
            </div>
          </div>
        </div>

        {/* Style panel sidebar */}
        {stylePanelBlock && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <BlockStylePanel
              styles={stylePanelMeta._styles || {}}
              onChange={(newStyles) => handleStyleChange(stylePanelBlock.id, newStyles)}
              onClose={() => setStylePanelId(null)}
              blockType={stylePanelBlock.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}
