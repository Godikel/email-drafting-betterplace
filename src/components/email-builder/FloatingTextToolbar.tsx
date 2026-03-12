import { useEffect, useState, useCallback, useRef } from "react";
import { Bold, Italic, Underline, Strikethrough, Type } from "lucide-react";

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "White", value: "#ffffff" },
  { label: "Navy", value: "#0c2752" },
  { label: "Teal", value: "#0f7c90" },
  { label: "Purple", value: "#6d28d9" },
  { label: "Rose", value: "#e11d48" },
  { label: "Emerald", value: "#059669" },
  { label: "Amber", value: "#d97706" },
  { label: "Slate", value: "#475569" },
  { label: "Sky", value: "#0284c7" },
];

export function FloatingTextToolbar() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [showColors, setShowColors] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const checkSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setPos(null);
      setShowColors(false);
      return;
    }

    // Only show toolbar if selection is inside a contentEditable element
    const anchor = sel.anchorNode;
    if (!anchor) { setPos(null); return; }
    const editable = (anchor.nodeType === 3 ? anchor.parentElement : anchor as HTMLElement)?.closest("[contenteditable='true']");
    if (!editable) { setPos(null); return; }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width < 2) { setPos(null); return; }

    setPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [checkSelection]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    // Keep selection active
    checkSelection();
  };

  if (!pos) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[9999] flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-lg px-1 py-0.5 animate-in fade-in-0 zoom-in-95"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -100%)",
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent blur
    >
      <ToolBtn icon={<Bold className="h-3.5 w-3.5" />} title="Bold" onClick={() => exec("bold")} />
      <ToolBtn icon={<Italic className="h-3.5 w-3.5" />} title="Italic" onClick={() => exec("italic")} />
      <ToolBtn icon={<Underline className="h-3.5 w-3.5" />} title="Underline" onClick={() => exec("underline")} />
      <ToolBtn icon={<Strikethrough className="h-3.5 w-3.5" />} title="Strikethrough" onClick={() => exec("strikethrough")} />
      <div className="w-px h-5 bg-border mx-0.5" />
      <div className="relative">
        <ToolBtn
          icon={<Type className="h-3.5 w-3.5" />}
          title="Text Color"
          onClick={() => setShowColors(!showColors)}
        />
        {showColors && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1 min-w-[140px]"
            onMouseDown={(e) => e.preventDefault()}
          >
            {TEXT_COLORS.map((c) => (
              <button
                key={c.value || "default"}
                className="w-6 h-6 rounded-full border border-border/50 hover:scale-110 transition-transform flex items-center justify-center"
                style={{ background: c.value || "#f0f0f0" }}
                title={c.label}
                onClick={() => {
                  if (c.value) {
                    exec("foreColor", c.value);
                  } else {
                    exec("removeFormat");
                  }
                  setShowColors(false);
                }}
              >
                {!c.value && <span className="text-[8px] text-muted-foreground">↺</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolBtn({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title={title}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
