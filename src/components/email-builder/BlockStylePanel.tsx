import { useState } from "react";
import { X, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BlockStyles {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  textAlign?: string;
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
  maxWidth?: number;
}

const defaultStyles: BlockStyles = {};

interface BlockStylePanelProps {
  styles: BlockStyles;
  onChange: (styles: BlockStyles) => void;
  onClose: () => void;
  blockType: string;
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider"
      >
        {title}
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2.5">{children}</div>}
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-muted-foreground w-20 shrink-0">{label}</Label>
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-input cursor-pointer p-0.5"
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="h-7 text-xs flex-1"
        />
      </div>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, step = 1, unit = "px" }: { label: string; value?: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs text-foreground font-mono">{value ?? min}{unit}</span>
      </div>
      <Slider
        value={[value ?? min]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export function BlockStylePanel({ styles, onChange, onClose, blockType }: BlockStylePanelProps) {
  const update = (partial: Partial<BlockStyles>) => {
    onChange({ ...styles, ...partial });
  };

  const reset = () => onChange({});

  return (
    <div className="w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
        <span className="text-xs font-semibold text-foreground">Style: {blockType}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={reset} title="Reset styles">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-auto">
        <Section title="Spacing" defaultOpen>
          <SliderRow label="Padding Top" value={styles.paddingTop} onChange={(v) => update({ paddingTop: v })} min={0} max={80} />
          <SliderRow label="Padding Bottom" value={styles.paddingBottom} onChange={(v) => update({ paddingBottom: v })} min={0} max={80} />
          <SliderRow label="Padding Left" value={styles.paddingLeft} onChange={(v) => update({ paddingLeft: v })} min={0} max={80} />
          <SliderRow label="Padding Right" value={styles.paddingRight} onChange={(v) => update({ paddingRight: v })} min={0} max={80} />
        </Section>

        <Section title="Typography">
          <SliderRow label="Font Size" value={styles.fontSize} onChange={(v) => update({ fontSize: v })} min={8} max={48} />
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-20 shrink-0">Weight</Label>
            <Select value={styles.fontWeight || "inherit"} onValueChange={(v) => update({ fontWeight: v === "inherit" ? undefined : v })}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">Default</SelectItem>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semibold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
                <SelectItem value="800">Extra Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SliderRow label="Line Height" value={styles.lineHeight} onChange={(v) => update({ lineHeight: v })} min={1} step={0.1} max={3} unit="" />
          <SliderRow label="Letter Spacing" value={styles.letterSpacing} onChange={(v) => update({ letterSpacing: v })} min={-2} max={8} step={0.5} unit="px" />
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-20 shrink the">Align from</Label>
            <Select value={styles.textAlign || "inherit"} onValueChange={(v) => update({ textAlign: v === "inherit" ? undefined : v })}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">Default</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Colors">
          <ColorInput label="Text" value={styles.color} onChange={(v) => update({ color: v })} />
          <ColorInput label="Background" value={styles.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
          <ColorInput label="Border" value={styles.borderColor} onChange={(v) => update({ borderColor: v })} />
        </Section>

        <Section title="Border & Shape">
          <SliderRow label="Border Radius" value={styles.borderRadius} onChange={(v) => update({ borderRadius: v })} min={0} max={24} />
          <SliderRow label="Border Width" value={styles.borderWidth} onChange={(v) => update({ borderWidth: v })} min={0} max={6} />
        </Section>

        <Section title="Layout">
          <SliderRow label="Max Width" value={styles.maxWidth} onChange={(v) => update({ maxWidth: v })} min={200} max={680} />
          <SliderRow label="Opacity" value={styles.opacity ?? 100} onChange={(v) => update({ opacity: v })} min={10} max={100} unit="%" />
        </Section>
      </div>
    </div>
  );
}

/** Convert BlockStyles to a React CSSProperties object (only defined values) */
export function stylesToCss(s: BlockStyles | undefined): React.CSSProperties {
  if (!s) return {};
  const css: React.CSSProperties = {};
  if (s.paddingTop !== undefined) css.paddingTop = s.paddingTop;
  if (s.paddingBottom !== undefined) css.paddingBottom = s.paddingBottom;
  if (s.paddingLeft !== undefined) css.paddingLeft = s.paddingLeft;
  if (s.paddingRight !== undefined) css.paddingRight = s.paddingRight;
  if (s.fontSize !== undefined) css.fontSize = s.fontSize;
  if (s.fontWeight) css.fontWeight = Number(s.fontWeight);
  if (s.color) css.color = s.color;
  if (s.backgroundColor) css.backgroundColor = s.backgroundColor;
  if (s.borderRadius !== undefined) css.borderRadius = s.borderRadius;
  if (s.borderColor) css.borderColor = s.borderColor;
  if (s.borderWidth !== undefined) css.borderWidth = s.borderWidth;
  if (s.textAlign) css.textAlign = s.textAlign as any;
  if (s.lineHeight !== undefined) css.lineHeight = s.lineHeight;
  if (s.letterSpacing !== undefined) css.letterSpacing = s.letterSpacing;
  if (s.opacity !== undefined) css.opacity = s.opacity / 100;
  if (s.maxWidth !== undefined) css.maxWidth = s.maxWidth;
  return css;
}

/** Convert BlockStyles to an inline CSS string for email HTML */
export function stylesToInline(s: BlockStyles | undefined): string {
  if (!s) return "";
  const parts: string[] = [];
  if (s.paddingTop !== undefined) parts.push(`padding-top:${s.paddingTop}px`);
  if (s.paddingBottom !== undefined) parts.push(`padding-bottom:${s.paddingBottom}px`);
  if (s.paddingLeft !== undefined) parts.push(`padding-left:${s.paddingLeft}px`);
  if (s.paddingRight !== undefined) parts.push(`padding-right:${s.paddingRight}px`);
  if (s.fontSize !== undefined) parts.push(`font-size:${s.fontSize}px`);
  if (s.fontWeight) parts.push(`font-weight:${s.fontWeight}`);
  if (s.color) parts.push(`color:${s.color}`);
  if (s.backgroundColor) parts.push(`background-color:${s.backgroundColor}`);
  if (s.borderRadius !== undefined) parts.push(`border-radius:${s.borderRadius}px`);
  if (s.borderColor) parts.push(`border-color:${s.borderColor}`);
  if (s.borderWidth !== undefined) parts.push(`border-width:${s.borderWidth}px;border-style:solid`);
  if (s.textAlign) parts.push(`text-align:${s.textAlign}`);
  if (s.lineHeight !== undefined) parts.push(`line-height:${s.lineHeight}`);
  if (s.letterSpacing !== undefined) parts.push(`letter-spacing:${s.letterSpacing}px`);
  if (s.opacity !== undefined) parts.push(`opacity:${s.opacity / 100}`);
  if (s.maxWidth !== undefined) parts.push(`max-width:${s.maxWidth}px`);
  return parts.length ? parts.join(";") + ";" : "";
}
