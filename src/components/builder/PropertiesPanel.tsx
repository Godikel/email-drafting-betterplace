import { useState, useRef, useCallback } from 'react';
import { X, Upload, Monitor, Smartphone, Plus } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { generateBuilderHtml } from '@/lib/generateBuilderHtml';
import { normalizeBullets } from '@/types/builder';
import { toast } from 'sonner';

/* ── Helpers ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 rounded border cursor-pointer" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs font-mono flex-1" />
      </div>
    </Field>
  );
}

function SliderField({ label, value, onChange, min, max, step = 1, unit = 'px' }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <Field label={`${label}: ${value}${unit}`}>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} className="w-full" />
    </Field>
  );
}

function AlignmentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Field label="Alignment">
      <div className="flex gap-1">
        {['left', 'center', 'right'].map(a => (
          <Button key={a} variant={value === a ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs capitalize"
            onClick={() => onChange(a)}>{a}</Button>
        ))}
      </div>
    </Field>
  );
}

/* ── Gradient presets ── */
const GRADIENTS = [
  { label: 'Purple', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { label: 'Sunset', value: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { label: 'Ocean', value: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { label: 'Forest', value: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { label: 'Fire', value: 'linear-gradient(135deg, #f12711, #f5af19)' },
  { label: 'Lavender', value: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { label: 'Midnight', value: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  { label: 'Teal', value: 'linear-gradient(135deg, #0093E9, #80D0C7)' },
];

/* ── Image upload ── */
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from('email-images').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('email-images').getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Field label="Image URL">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="h-8 text-xs" />
      </Field>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" disabled={uploading}
          onClick={() => fileRef.current?.click()}>
          <Upload className="h-3 w-3 mr-1" />{uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
    </div>
  );
}

/* ── Per-block property editors ── */
function TextProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  return (
    <div className="space-y-4">
      <SliderField label="Font Size" value={p.fontSize || 16} onChange={(v) => updateProps(selectedBlock.id, { fontSize: v })} min={10} max={48} />
      <ColorField label="Text Color" value={p.color || '#333333'} onChange={(v) => updateProps(selectedBlock.id, { color: v })} />
      <ColorField label="Background" value={p.bgColor || ''} onChange={(v) => updateProps(selectedBlock.id, { bgColor: v })} />
      <AlignmentPicker value={p.alignment || 'left'} onChange={(v) => updateProps(selectedBlock.id, { alignment: v })} />
      <SliderField label="Padding" value={p.padding || 0} onChange={(v) => updateProps(selectedBlock.id, { padding: v })} min={0} max={48} />
      <SliderField label="Border Radius" value={p.borderRadius || 0} onChange={(v) => updateProps(selectedBlock.id, { borderRadius: v })} min={0} max={32} />
    </div>
  );
}

function HeroProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Icon / Emoji"><Input value={p.icon || ''} onChange={(e) => up('icon', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Title"><Input value={p.title || ''} onChange={(e) => up('title', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Subtitle"><Input value={p.subtitle || ''} onChange={(e) => up('subtitle', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Background Gradient">
        <div className="grid grid-cols-4 gap-1.5">
          {GRADIENTS.map(g => (
            <button key={g.label} className="h-7 rounded-md border border-border/50 transition-all hover:scale-105"
              style={{ background: g.value }} title={g.label}
              onClick={() => up('gradient', g.value)} />
          ))}
        </div>
      </Field>
      <Field label="CTA Text"><Input value={p.ctaText || ''} onChange={(e) => up('ctaText', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="CTA Link"><Input value={p.ctaLink || ''} onChange={(e) => up('ctaLink', e.target.value)} className="h-8 text-xs" /></Field>
      <ColorField label="CTA Background" value={p.ctaBgColor || '#ffffff'} onChange={(v) => up('ctaBgColor', v)} />
      <ColorField label="CTA Text Color" value={p.ctaTextColor || '#667eea'} onChange={(v) => up('ctaTextColor', v)} />
    </div>
  );
}

function InfoBoxProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Icon"><Input value={p.icon || ''} onChange={(e) => up('icon', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Title"><Input value={p.title || ''} onChange={(e) => up('title', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Description"><Input value={p.description || ''} onChange={(e) => up('description', e.target.value)} className="h-8 text-xs" /></Field>
      <ColorField label="Border Color" value={p.borderColor || '#3b82f6'} onChange={(v) => up('borderColor', v)} />
      <ColorField label="Background" value={p.bgColor || '#eff6ff'} onChange={(v) => up('bgColor', v)} />
    </div>
  );
}

function FeatureCardProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  const bullets = normalizeBullets(p.bullets || []);
  return (
    <div className="space-y-4">
      <Field label="Icon"><Input value={p.icon || ''} onChange={(e) => up('icon', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Title"><Input value={p.title || ''} onChange={(e) => up('title', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Description"><Input value={p.description || ''} onChange={(e) => up('description', e.target.value)} className="h-8 text-xs" /></Field>

      <div className="border-t pt-3">
        <Label className="text-xs font-semibold text-foreground">Colors</Label>
        <div className="space-y-3 mt-2">
          <ColorField label="Card Background" value={p.bgColor || '#ffffff'} onChange={(v) => up('bgColor', v)} />
          <ColorField label="Border" value={p.borderColor || '#e5e7eb'} onChange={(v) => up('borderColor', v)} />
          <ColorField label="Accent / Bullet" value={p.accentColor || '#3b82f6'} onChange={(v) => { up('accentColor', v); up('bulletColor', v); }} />
          <ColorField label="Icon Background" value={p.iconBgColor || '#eff6ff'} onChange={(v) => up('iconBgColor', v)} />
          <ColorField label="Title Color" value={p.titleColor || '#1a1a2e'} onChange={(v) => up('titleColor', v)} />
          <ColorField label="Description Color" value={p.descColor || '#555555'} onChange={(v) => up('descColor', v)} />
        </div>
      </div>

      <div className="border-t pt-3">
        <SliderField label="Inner Spacing" value={p.spacing || 20} onChange={(v) => up('spacing', v)} min={0} max={48} />
      </div>

      <div className="border-t pt-3">
        <Label className="text-xs font-semibold text-foreground">Bullet Points</Label>
        <div className="space-y-2 mt-2">
          {bullets.map((b, i) => (
            <div key={i} className="border rounded-md p-2 space-y-1">
              <div className="flex gap-1">
                <Input value={b.text} className="h-7 text-xs flex-1" placeholder="Bullet text"
                  onChange={(e) => {
                    const newBullets = [...bullets];
                    newBullets[i] = { ...newBullets[i], text: e.target.value };
                    up('bullets', newBullets);
                  }} />
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => {
                  up('bullets', bullets.filter((_, j) => j !== i));
                }}><X className="h-3 w-3" /></Button>
              </div>
              <Input value={b.subtext || ''} className="h-7 text-xs" placeholder="Subtext (optional)"
                onChange={(e) => {
                  const newBullets = [...bullets];
                  newBullets[i] = { ...newBullets[i], subtext: e.target.value };
                  up('bullets', newBullets);
                }} />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => up('bullets', [...bullets, { text: '', subtext: '' }])}>
            <Plus className="h-3 w-3 mr-1" />Add Bullet
          </Button>
        </div>
      </div>
    </div>
  );
}

const ASPECT_RATIOS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Landscape 16:9', value: '16/9' },
  { label: 'Landscape 4:3', value: '4/3' },
  { label: 'Square 1:1', value: '1/1' },
  { label: 'Portrait 3:4', value: '3/4' },
  { label: 'Phone 9:16', value: '9/16' },
  { label: 'Banner 3:1', value: '3/1' },
];

function ImageProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <ImageUpload value={p.src || ''} onChange={(url) => up('src', url)} />
      <Field label="Alt Text"><Input value={p.alt || ''} onChange={(e) => up('alt', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Caption"><Input value={p.caption || ''} onChange={(e) => up('caption', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Aspect Ratio">
        <div className="grid grid-cols-2 gap-1">
          {ASPECT_RATIOS.map(a => (
            <Button key={a.value} variant={(p.aspectRatio || 'auto') === a.value ? 'default' : 'outline'} size="sm" className="h-7 text-[10px]"
              onClick={() => up('aspectRatio', a.value)}>{a.label}</Button>
          ))}
        </div>
      </Field>
      <AlignmentPicker value={p.alignment || 'center'} onChange={(v) => up('alignment', v)} />
      <SliderField label="Max Width" value={p.maxWidth || 100} onChange={(v) => up('maxWidth', v)} min={20} max={100} unit="%" />
      <SliderField label="Border Radius" value={p.borderRadius || 0} onChange={(v) => up('borderRadius', v)} min={0} max={32} />
    </div>
  );
}

function VideoProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Video URL"><Input value={p.videoUrl || ''} onChange={(e) => up('videoUrl', e.target.value)} className="h-8 text-xs" placeholder="https://youtube.com/..." /></Field>
      <ImageUpload value={p.thumbnailSrc || ''} onChange={(url) => up('thumbnailSrc', url)} />
      <Field label="Aspect Ratio">
        <div className="grid grid-cols-2 gap-1">
          {ASPECT_RATIOS.map(a => (
            <Button key={a.value} variant={(p.aspectRatio || '16/9') === a.value ? 'default' : 'outline'} size="sm" className="h-7 text-[10px]"
              onClick={() => up('aspectRatio', a.value)}>{a.label}</Button>
          ))}
        </div>
      </Field>
      <Field label="Play Button Style">
        <div className="flex gap-2">
          {['circle', 'rounded'].map(s => (
            <Button key={s} variant={p.playButtonStyle === s ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs capitalize"
              onClick={() => up('playButtonStyle', s)}>{s}</Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function DividerProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <SliderField label="Thickness" value={p.thickness || 1} onChange={(v) => up('thickness', v)} min={1} max={8} />
      <ColorField label="Color" value={p.color || '#e5e7eb'} onChange={(v) => up('color', v)} />
      <SliderField label="Margin" value={p.margin || 16} onChange={(v) => up('margin', v)} min={0} max={64} />
    </div>
  );
}

function SpacerProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  return (
    <div className="space-y-4">
      <SliderField label="Height" value={p.height || 32} onChange={(v) => updateProps(selectedBlock.id, { height: v })} min={8} max={120} />
    </div>
  );
}

function ButtonProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Label"><Input value={p.label || ''} onChange={(e) => up('label', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Link URL"><Input value={p.link || ''} onChange={(e) => up('link', e.target.value)} className="h-8 text-xs" /></Field>
      <ColorField label="Background" value={p.bgColor || '#3b82f6'} onChange={(v) => up('bgColor', v)} />
      <ColorField label="Text Color" value={p.textColor || '#ffffff'} onChange={(v) => up('textColor', v)} />
      <SliderField label="Border Radius" value={p.borderRadius || 6} onChange={(v) => up('borderRadius', v)} min={0} max={32} />
      <AlignmentPicker value={p.alignment || 'center'} onChange={(v) => up('alignment', v)} />
      <Field label="Full Width">
        <Button variant={p.fullWidth ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
          onClick={() => up('fullWidth', !p.fullWidth)}>{p.fullWidth ? 'Yes' : 'No'}</Button>
      </Field>
    </div>
  );
}

function StatusCardProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <Field label="Icon"><Input value={p.icon || ''} onChange={(e) => up('icon', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Title"><Input value={p.title || ''} onChange={(e) => up('title', e.target.value)} className="h-8 text-xs" /></Field>
      <Field label="Description"><Input value={p.description || ''} onChange={(e) => up('description', e.target.value)} className="h-8 text-xs" /></Field>
      <ColorField label="Accent Color" value={p.accentColor || '#10b981'} onChange={(v) => up('accentColor', v)} />
      <ColorField label="Background" value={p.bgColor || '#f0fdf4'} onChange={(v) => up('bgColor', v)} />
      <ColorField label="Title Color" value={p.titleColor || '#1a1a2e'} onChange={(v) => up('titleColor', v)} />
      <ColorField label="Description Color" value={p.descColor || '#555555'} onChange={(v) => up('descColor', v)} />
    </div>
  );
}

function HeaderProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <Label className="text-xs font-semibold text-foreground mb-2 block">Primary Logo</Label>
        <ImageUpload value={p.logoSrc || ''} onChange={(url) => up('logoSrc', url)} />
        <div className="mt-2"><Field label="Alt Text"><Input value={p.logoAlt || ''} onChange={(e) => up('logoAlt', e.target.value)} className="h-8 text-xs" /></Field></div>
        <div className="mt-2"><SliderField label="Max Width" value={p.logoMaxWidth || 150} onChange={(v) => up('logoMaxWidth', v)} min={40} max={400} /></div>
      </div>
      <div className="border-b pb-3">
        <Label className="text-xs font-semibold text-foreground mb-2 block">Partner Logo</Label>
        <ImageUpload value={p.logo2Src || ''} onChange={(url) => up('logo2Src', url)} />
        <div className="mt-2"><Field label="Alt Text"><Input value={p.logo2Alt || ''} onChange={(e) => up('logo2Alt', e.target.value)} className="h-8 text-xs" /></Field></div>
        <div className="mt-2"><SliderField label="Max Width" value={p.logo2MaxWidth || 120} onChange={(v) => up('logo2MaxWidth', v)} min={30} max={300} /></div>
      </div>
      <Field label="Show Logo Divider">
        <Button variant={p.showLogoDivider !== false ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
          onClick={() => up('showLogoDivider', !(p.showLogoDivider !== false))}>{p.showLogoDivider !== false ? 'Yes' : 'No'}</Button>
      </Field>
      <div className="border-b pb-3">
        <Label className="text-xs font-semibold text-foreground mb-2 block">Right Label</Label>
        <Field label="Text"><Input value={p.labelText || ''} onChange={(e) => up('labelText', e.target.value)} className="h-8 text-xs" /></Field>
        <div className="mt-2"><ColorField label="Color" value={p.labelColor || '#1a6fa8'} onChange={(v) => up('labelColor', v)} /></div>
      </div>
      <ColorField label="Background" value={p.bgColor || '#ffffff'} onChange={(v) => up('bgColor', v)} />
      <SliderField label="Padding" value={p.padding || 16} onChange={(v) => up('padding', v)} min={0} max={48} />
      <Field label="Show Bottom Divider">
        <Button variant={p.showDivider ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
          onClick={() => up('showDivider', !p.showDivider)}>{p.showDivider ? 'Yes' : 'No'}</Button>
      </Field>
    </div>
  );
}

function FooterProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  const links = p.links || [];
  return (
    <div className="space-y-4">
      <ImageUpload value={p.logoSrc || ''} onChange={(url) => up('logoSrc', url)} />
      <Field label="Logo Alt Text"><Input value={p.logoAlt || ''} onChange={(e) => up('logoAlt', e.target.value)} className="h-8 text-xs" /></Field>
      <AlignmentPicker value={p.logoAlignment || 'center'} onChange={(v) => up('logoAlignment', v)} />
      <SliderField label="Logo Max Width" value={p.logoMaxWidth || 100} onChange={(v) => up('logoMaxWidth', v)} min={30} max={300} />
      <Field label="Footer Text"><Input value={p.text || ''} onChange={(e) => up('text', e.target.value)} className="h-8 text-xs" /></Field>
      <ColorField label="Background" value={p.bgColor || '#f8f9fa'} onChange={(v) => up('bgColor', v)} />
      <ColorField label="Text Color" value={p.textColor || '#888888'} onChange={(v) => up('textColor', v)} />
      <SliderField label="Padding" value={p.padding || 24} onChange={(v) => up('padding', v)} min={0} max={48} />
      <Field label="Show Divider">
        <Button variant={p.showDivider ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
          onClick={() => up('showDivider', !p.showDivider)}>{p.showDivider ? 'Yes' : 'No'}</Button>
      </Field>
      <div className="border-t pt-3">
        <Label className="text-xs font-semibold text-foreground">Links</Label>
        <div className="space-y-2 mt-2">
          {links.map((link: { label: string; url: string }, i: number) => (
            <div key={i} className="flex gap-1">
              <Input value={link.label} className="h-7 text-xs flex-1" placeholder="Label"
                onChange={(e) => { const nl = [...links]; nl[i] = { ...nl[i], label: e.target.value }; up('links', nl); }} />
              <Input value={link.url} className="h-7 text-xs flex-1" placeholder="URL"
                onChange={(e) => { const nl = [...links]; nl[i] = { ...nl[i], url: e.target.value }; up('links', nl); }} />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0"
                onClick={() => up('links', links.filter((_: any, j: number) => j !== i))}><X className="h-3 w-3" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full h-7 text-xs"
            onClick={() => up('links', [...links, { label: '', url: '#' }])}>
            <Plus className="h-3 w-3 mr-1" />Add Link
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionBoxProps() {
  const { selectedBlock, updateProps } = useBuilder();
  if (!selectedBlock) return null;
  const p = selectedBlock.props;
  const up = (k: string, v: any) => updateProps(selectedBlock.id, { [k]: v });
  return (
    <div className="space-y-4">
      <ColorField label="Background Color" value={p.bgColor || '#f8f9fa'} onChange={(v) => up('bgColor', v)} />
      <Field label="Background Gradient">
        <div className="grid grid-cols-4 gap-1.5">
          <button className="h-7 rounded-md border border-border/50 bg-transparent text-[8px] text-muted-foreground"
            onClick={() => up('gradient', '')}>None</button>
          {GRADIENTS.map(g => (
            <button key={g.label} className="h-7 rounded-md border border-border/50 transition-all hover:scale-105"
              style={{ background: g.value }} title={g.label}
              onClick={() => up('gradient', g.value)} />
          ))}
        </div>
      </Field>
      <SliderField label="Padding" value={p.padding || 24} onChange={(v) => up('padding', v)} min={0} max={64} />
      <SliderField label="Border Radius" value={p.borderRadius || 12} onChange={(v) => up('borderRadius', v)} min={0} max={32} />
      <SliderField label="Border Width" value={p.borderWidth || 0} onChange={(v) => up('borderWidth', v)} min={0} max={4} />
      {(p.borderWidth > 0) && <ColorField label="Border Color" value={p.borderColor || '#e5e7eb'} onChange={(v) => up('borderColor', v)} />}
      <p className="text-[10px] text-muted-foreground">Drag blocks into the section, or click + inside it on the canvas.</p>
    </div>
  );
}

const BLOCK_LABELS: Record<string, string> = {
  text: 'Text Block', hero: 'Hero Block', 'info-box': 'Info Box', 'feature-card': 'Feature Card',
  image: 'Image Block', video: 'Video Block', divider: 'Divider', spacer: 'Spacer',
  button: 'Button', 'status-card': 'Status Card', 'two-column': '2-Column Layout', 'three-column': '3-Column Layout',
  'section-box': 'Section Box', 'header': 'Header', 'footer': 'Footer',
};

function BlockPropsEditor() {
  const { selectedBlock } = useBuilder();
  if (!selectedBlock) return null;
  switch (selectedBlock.type) {
    case 'text': return <TextProps />;
    case 'hero': return <HeroProps />;
    case 'info-box': return <InfoBoxProps />;
    case 'feature-card': return <FeatureCardProps />;
    case 'image': return <ImageProps />;
    case 'video': return <VideoProps />;
    case 'divider': return <DividerProps />;
    case 'spacer': return <SpacerProps />;
    case 'button': return <ButtonProps />;
    case 'status-card': return <StatusCardProps />;
    case 'header': return <HeaderProps />;
    case 'footer': return <FooterProps />;
    case 'section-box': return <SectionBoxProps />;
    case 'two-column': case 'three-column':
      return <p className="text-xs text-muted-foreground">Click a block inside a column to edit its properties. Drag blocks into the columns, or use the + button inside each column.</p>;
    default: return null;
  }
}

/* ── Wrapper settings ── */
function WrapperSettings() {
  const { state, dispatch } = useBuilder();
  const w = state.present.wrapper;
  const up = (k: string, v: any) => dispatch({ type: 'UPDATE_WRAPPER', wrapper: { [k]: v } });
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Email Wrapper</h3>
      <SliderField label="Max Width" value={w.maxWidth} onChange={(v) => up('maxWidth', v)} min={400} max={900} />
      <ColorField label="Content Background" value={w.bgColor} onChange={(v) => up('bgColor', v)} />
      <ColorField label="Email Background" value={w.emailBgColor || '#f0f0f5'} onChange={(v) => up('emailBgColor', v)} />
      <SliderField label="Padding" value={w.padding} onChange={(v) => up('padding', v)} min={0} max={64} />
      <SliderField label="Border Radius" value={w.borderRadius} onChange={(v) => up('borderRadius', v)} min={0} max={24} />
    </div>
  );
}

/* ── Preview ── */
function PreviewPane() {
  const { state } = useBuilder();
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const html = generateBuilderHtml(state.present);
  const width = device === 'desktop' ? '100%' : '375px';

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        <Button variant={device === 'desktop' ? 'default' : 'outline'} size="sm" className="flex-1 h-8 text-xs"
          onClick={() => setDevice('desktop')}><Monitor className="h-3 w-3 mr-1" />Desktop</Button>
        <Button variant={device === 'mobile' ? 'default' : 'outline'} size="sm" className="flex-1 h-8 text-xs"
          onClick={() => setDevice('mobile')}><Smartphone className="h-3 w-3 mr-1" />Mobile</Button>
      </div>
      <div className="rounded-lg border bg-muted/30 overflow-hidden flex justify-center p-2">
        <iframe
          title="Email Preview"
          srcDoc={html}
          className="border-0 bg-white"
          style={{ width, height: '500px' }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

/* ── Main Panel ── */
export function PropertiesPanel() {
  const { selectedBlock, selectBlock } = useBuilder();

  return (
    <div className="h-full flex flex-col border-l bg-card">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 mt-3 mb-0 shrink-0">
          <TabsTrigger value="properties" className="flex-1 text-xs">Properties</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1 text-xs">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {selectedBlock ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{BLOCK_LABELS[selectedBlock.type] || selectedBlock.type}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => selectBlock(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <BlockPropsEditor />
            </>
          ) : (
            <WrapperSettings />
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-y-auto p-4 m-0">
          <PreviewPane />
        </TabsContent>
      </Tabs>
    </div>
  );
}
