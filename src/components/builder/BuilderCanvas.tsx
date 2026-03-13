import { useState, useCallback } from 'react';
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown, ImageIcon, PlayCircle, Plus } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import type { BuilderBlock, BuilderBlockType, BulletPoint, TextContentItem } from '@/types/builder';
import { createBlock, normalizeBullets } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/* ── Drop indicator ── */
function DropLine({ active }: { active: boolean }) {
  return (
    <div className={cn(
      'rounded-full transition-all mx-2',
      active ? 'h-[3px] bg-primary my-1' : 'h-0'
    )} />
  );
}

/* ── Quick add inside columns / section-box ── */
const SIMPLE_TYPES: { type: BuilderBlockType; label: string }[] = [
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'divider', label: 'Divider' },
  { type: 'spacer', label: 'Spacer' },
  { type: 'feature-card', label: 'Feature Card' },
  { type: 'info-box', label: 'Info Box' },
  { type: 'status-card', label: 'Status Card' },
];

/* ── Block content renderers ── */
function RenderBlock({ block, onUpdate, onSelect }: { block: BuilderBlock; onUpdate: (p: Record<string, any>) => void; onSelect?: (id: string) => void }) {
  const { addBlockToColumn, removeBlock, updateProps, selectBlock } = useBuilder();
  const p = block.props;

  const handleChildClick = (e: React.MouseEvent, childId: string) => {
    e.stopPropagation();
    selectBlock(childId);
  };

  switch (block.type) {
    case 'text':
      return (
        <div className="rounded" style={{
          backgroundColor: p.bgColor || 'transparent',
          padding: p.padding || 0,
          borderRadius: p.borderRadius || 0,
        }}>
          <div
            contentEditable suppressContentEditableWarning
            className="outline-none min-h-[1.5em]"
            style={{ fontSize: p.fontSize, color: p.color, textAlign: p.alignment, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: p.content }}
            onBlur={(e) => onUpdate({ content: e.currentTarget.innerHTML })}
          />
        </div>
      );

    case 'hero':
      return (
        <div className="rounded-lg p-8 text-center" style={{ background: p.gradient }}>
          {p.icon && <div className="text-4xl mb-3">{p.icon}</div>}
          <div contentEditable suppressContentEditableWarning className="text-2xl font-bold text-white outline-none mb-2"
            onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
          <div contentEditable suppressContentEditableWarning className="text-white/80 outline-none mb-4"
            onBlur={(e) => onUpdate({ subtitle: e.currentTarget.textContent || '' })}>{p.subtitle}</div>
          {p.ctaText && (
            <span className="inline-block px-6 py-2.5 rounded-md font-semibold text-sm"
              style={{ backgroundColor: p.ctaBgColor, color: p.ctaTextColor }}>{p.ctaText}</span>
          )}
        </div>
      );

    case 'info-box':
      return (
        <div className="rounded-lg p-4 border-l-4" style={{ borderColor: p.borderColor, backgroundColor: p.bgColor }}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <div contentEditable suppressContentEditableWarning className="font-semibold outline-none"
                style={{ color: '#1a1a2e' }} onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
              <div contentEditable suppressContentEditableWarning className="text-sm text-muted-foreground outline-none mt-1"
                onBlur={(e) => onUpdate({ description: e.currentTarget.textContent || '' })}>{p.description}</div>
            </div>
          </div>
        </div>
      );

    case 'feature-card': {
      const bullets = normalizeBullets(p.bullets || []);
      return (
        <div className="rounded-lg p-5" style={{
          backgroundColor: p.bgColor || '#ffffff',
          border: `1px solid ${p.borderColor || '#e5e7eb'}`,
        }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg" style={{
              backgroundColor: p.iconBgColor || '#eff6ff',
            }}>{p.icon}</span>
            <div contentEditable suppressContentEditableWarning className="font-semibold outline-none"
              style={{ color: p.titleColor || '#1a1a2e' }}
              onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
          </div>
          <div contentEditable suppressContentEditableWarning className="text-sm outline-none mb-3"
            style={{ color: p.descColor || '#555555' }}
            onBlur={(e) => onUpdate({ description: e.currentTarget.textContent || '' })}>{p.description}</div>
          {bullets.length > 0 && (
            <ul style={{ marginTop: p.spacing || 12 }} className="space-y-2">
              {bullets.map((b: BulletPoint, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: p.bulletColor || p.accentColor || '#3b82f6' }} />
                  <div className="flex-1">
                    <span contentEditable suppressContentEditableWarning className="outline-none"
                      style={{ color: p.titleColor || '#1a1a2e' }}
                      onBlur={(e) => {
                        const newBullets = [...bullets];
                        newBullets[i] = { ...newBullets[i], text: e.currentTarget.textContent || '' };
                        onUpdate({ bullets: newBullets });
                      }}>{b.text}</span>
                    {(b.subtext !== undefined) && (
                      <div contentEditable suppressContentEditableWarning className="outline-none text-xs mt-0.5"
                        style={{ color: p.descColor || '#888888' }}
                        onBlur={(e) => {
                          const newBullets = [...bullets];
                          newBullets[i] = { ...newBullets[i], subtext: e.currentTarget.textContent || '' };
                          onUpdate({ bullets: newBullets });
                        }}>{b.subtext || 'Add subtext...'}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case 'image': {
      const ar = p.aspectRatio && p.aspectRatio !== 'auto' ? p.aspectRatio : undefined;
      return (
        <div style={{ textAlign: p.alignment as any }}>
          {p.src ? (
            <div className="inline-block overflow-hidden" style={{ maxWidth: `${p.maxWidth}%`, borderRadius: p.borderRadius, aspectRatio: ar, width: ar ? `${p.maxWidth}%` : undefined }}>
              <img src={p.src} alt={p.alt} className="block w-full h-full" style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground" style={{ aspectRatio: ar }}>
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Add an image via the properties panel</p>
            </div>
          )}
          {p.caption && <p className="text-xs text-muted-foreground mt-2 text-center">{p.caption}</p>}
        </div>
      );
    }

    case 'video': {
      const ar = p.aspectRatio || '16/9';
      return (
        <div className="relative rounded-lg overflow-hidden bg-muted text-center" style={{ aspectRatio: ar !== 'auto' ? ar : '16/9' }}>
          {p.thumbnailSrc ? (
            <img src={p.thumbnailSrc} alt="Video thumbnail" className="w-full h-full object-cover block" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm">Add video details via properties panel</p>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayCircle className="h-14 w-14 text-white/90 drop-shadow-lg" />
          </div>
        </div>
      );
    }

    case 'divider':
      return <hr style={{ border: 'none', borderTop: `${p.thickness}px solid ${p.color}`, margin: `${p.margin}px 0` }} />;

    case 'spacer':
      return (
        <div style={{ height: p.height }} className="bg-muted/30 rounded border border-dashed border-border/50 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground">{p.height}px</span>
        </div>
      );

    case 'button':
      return (
        <div style={{ textAlign: p.alignment as any }}>
          <span className="inline-block px-6 py-3 font-semibold text-sm cursor-default"
            style={{
              backgroundColor: p.bgColor, color: p.textColor, borderRadius: p.borderRadius,
              width: p.fullWidth ? '100%' : 'auto', textAlign: 'center', display: p.fullWidth ? 'block' : 'inline-block',
            }}
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onUpdate({ label: e.currentTarget.textContent || '' })}
          >{p.label}</span>
        </div>
      );

    case 'status-card':
      return (
        <div className="rounded-lg border p-4" style={{
          borderLeftWidth: 4, borderLeftColor: p.accentColor,
          backgroundColor: p.bgColor || '#f0fdf4',
        }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{p.icon}</span>
            <div>
              <div contentEditable suppressContentEditableWarning className="font-semibold outline-none"
                style={{ color: p.titleColor || '#1a1a2e' }}
                onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
              <div contentEditable suppressContentEditableWarning className="text-sm outline-none"
                style={{ color: p.descColor || '#555555' }}
                onBlur={(e) => onUpdate({ description: e.currentTarget.textContent || '' })}>{p.description}</div>
            </div>
          </div>
        </div>
      );

    case 'header': {
      return (
        <div className="rounded-lg" style={{ backgroundColor: p.bgColor || '#ffffff', padding: p.padding || 16 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {p.logoSrc ? (
                <img src={p.logoSrc} alt={p.logoAlt || 'Logo'} className="block" style={{ maxWidth: p.logoMaxWidth || 150, height: 'auto' }} />
              ) : (
                <div className="border-2 border-dashed border-border rounded px-3 py-2 text-muted-foreground">
                  <p className="text-xs">Logo 1</p>
                </div>
              )}
              {(p.showLogoDivider !== false) && <div className="w-px h-7 bg-border" />}
              {p.logo2Src ? (
                <img src={p.logo2Src} alt={p.logo2Alt || 'Partner Logo'} className="block" style={{ maxWidth: p.logo2MaxWidth || 120, height: 'auto' }} />
              ) : (
                <div className="border-2 border-dashed border-border rounded px-3 py-2 text-muted-foreground">
                  <p className="text-xs">Logo 2</p>
                </div>
              )}
            </div>
            {p.labelText && (
              <span className="text-xs font-bold whitespace-nowrap" style={{ color: p.labelColor || '#1a6fa8' }}>{p.labelText}</span>
            )}
          </div>
          {p.showDivider && <hr className="mt-3 border-border/50" />}
        </div>
      );
    }

    case 'footer': {
      const align = p.logoAlignment || 'center';
      return (
        <div className="rounded-lg" style={{ backgroundColor: p.bgColor || '#f8f9fa', padding: p.padding || 24 }}>
          {p.showDivider && <hr className="mb-4 border-border/50" />}
          {p.logoSrc && (
            <div style={{ textAlign: align as any }} className="mb-3">
              <img src={p.logoSrc} alt={p.logoAlt || 'Logo'} className="inline-block" style={{ maxWidth: p.logoMaxWidth || 100 }} />
            </div>
          )}
          <div contentEditable suppressContentEditableWarning className="text-xs outline-none text-center mb-2"
            style={{ color: p.textColor || '#888888' }}
            onBlur={(e) => onUpdate({ text: e.currentTarget.textContent || '' })}>{p.text}</div>
          {(p.links || []).length > 0 && (
            <div className="text-center space-x-3">
              {(p.links || []).map((link: { label: string; url: string }, i: number) => (
                <span key={i} className="text-xs underline cursor-pointer" style={{ color: p.textColor || '#888888' }}>{link.label}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'section-box': {
      const cols = block.children || [[]];
      const bg = p.gradient || p.bgColor || '#f8f9fa';
      return (
        <div className="rounded-lg" style={{
          background: bg,
          borderRadius: p.borderRadius || 12,
          padding: p.padding || 24,
          border: p.borderWidth ? `${p.borderWidth}px solid ${p.borderColor || '#e5e7eb'}` : 'none',
        }}>
          <div
            className="min-h-[60px] space-y-2"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation();
              const bt = e.dataTransfer.getData('builder/new-block') as BuilderBlockType;
              if (bt && bt !== 'two-column' && bt !== 'three-column' && bt !== 'section-box') {
                addBlockToColumn(block.id, 0, bt);
              }
            }}
          >
            {cols[0].length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60px] gap-2 text-muted-foreground">
                <span className="text-xs">Drag blocks here</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full border border-dashed border-border">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-36 p-1" align="center">
                    {SIMPLE_TYPES.map(t => (
                      <button key={t.type} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                        onClick={() => addBlockToColumn(block.id, 0, t.type)}>{t.label}</button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            ) : cols[0].map(child => (
              <div key={child.id} className="relative group/child"
                onClick={(e) => handleChildClick(e, child.id)}>
                <div className="absolute -right-1 -top-1 opacity-0 group-hover/child:opacity-100 z-10">
                  <Button variant="ghost" size="icon" className="h-5 w-5 bg-destructive/10 hover:bg-destructive/20"
                    onClick={(e) => { e.stopPropagation(); removeBlock(child.id); }}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                <RenderBlock block={child} onUpdate={(props) => updateProps(child.id, props)} onSelect={(id) => selectBlock(id)} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'two-column':
    case 'three-column': {
      const colCount = block.type === 'two-column' ? 2 : 3;
      const cols = block.children || [];
      return (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
          {cols.map((col, ci) => (
            <div
              key={ci}
              className="min-h-[80px] border-2 border-dashed border-border/40 rounded-lg p-2 space-y-2"
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault(); e.stopPropagation();
                const bt = e.dataTransfer.getData('builder/new-block') as BuilderBlockType;
                if (bt && bt !== 'two-column' && bt !== 'three-column') {
                  addBlockToColumn(block.id, ci, bt);
                }
              }}
            >
              {col.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  <span className="text-xs">Column {ci + 1}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full border border-dashed border-border">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-1" align="center">
                      {SIMPLE_TYPES.map(t => (
                        <button key={t.type} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                          onClick={() => addBlockToColumn(block.id, ci, t.type)}>{t.label}</button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
              ) : col.map(child => (
                <div key={child.id} className="relative group/child"
                  onClick={(e) => handleChildClick(e, child.id)}>
                  <div className="absolute -right-1 -top-1 opacity-0 group-hover/child:opacity-100 z-10">
                    <Button variant="ghost" size="icon" className="h-5 w-5 bg-destructive/10 hover:bg-destructive/20"
                      onClick={(e) => { e.stopPropagation(); removeBlock(child.id); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <RenderBlock block={child} onUpdate={(props) => updateProps(child.id, props)} onSelect={(id) => selectBlock(id)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    default:
      return <div className="p-4 text-muted-foreground text-sm">Unknown block</div>;
  }
}

/* ── Main Canvas ── */
export function BuilderCanvas() {
  const { state, addBlock, moveBlock, selectBlock, removeBlock, duplicateBlock, updateProps } = useBuilder();
  const { blocks, wrapper } = state.present;
  const selectedId = state.selectedBlockId;
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    const newType = e.dataTransfer.getData('builder/new-block') as BuilderBlockType;
    if (newType) { addBlock(newType, index); return; }
    const reorderStr = e.dataTransfer.getData('builder/reorder');
    if (reorderStr !== '') {
      const from = parseInt(reorderStr);
      if (!isNaN(from) && from !== index) {
        moveBlock(from, from < index ? index - 1 : index);
      }
    }
  }, [addBlock, moveBlock]);

  return (
    <div
      className="flex-1 overflow-y-auto p-6 min-h-0"
      style={{ backgroundColor: wrapper.emailBgColor || 'hsl(220 20% 95%)' }}
      onClick={() => selectBlock(null)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className="mx-auto transition-all"
        style={{
          maxWidth: wrapper.maxWidth,
          backgroundColor: wrapper.bgColor,
          padding: wrapper.padding,
          borderRadius: wrapper.borderRadius,
          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {blocks.length === 0 && dragOverIdx === null && (
          <div
            className="border-2 border-dashed border-border rounded-xl p-16 text-center"
            onDragOver={(e) => { e.preventDefault(); setDragOverIdx(0); }}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div className="text-5xl mb-4">📧</div>
            <p className="text-foreground font-semibold mb-1">Drag blocks here to start building</p>
            <p className="text-sm text-muted-foreground">Or click a block in the library panel</p>
          </div>
        )}

        {blocks.map((block, index) => (
          <div key={block.id}>
            {/* Drop zone above */}
            <div
              className="h-2 relative"
              onDragOver={(e) => { e.preventDefault(); setDragOverIdx(index); }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <DropLine active={dragOverIdx === index} />
            </div>

            {/* Block */}
            <div
              className={cn(
                'relative group rounded-lg transition-all',
                selectedId === block.id ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-border/60',
              )}
              onClick={(e) => { e.stopPropagation(); selectBlock(block.id); }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('builder/reorder', String(index));
                e.dataTransfer.effectAllowed = 'move';
                setDragIdx(index);
              }}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              style={{ opacity: dragIdx === index ? 0.35 : 1 }}
            >
              {/* Side controls */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-card border rounded shadow-sm p-0.5 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6 bg-card border shadow-sm" title="Duplicate"
                  onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                  <Copy className="h-3 w-3" />
                </Button>
                {index > 0 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 bg-card border shadow-sm" title="Move up"
                    onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1); }}>
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                )}
                {index < blocks.length - 1 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 bg-card border shadow-sm" title="Move down"
                    onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1); }}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6 bg-card border shadow-sm text-destructive hover:text-destructive" title="Delete"
                  onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="p-1">
                <RenderBlock block={block} onUpdate={(props) => updateProps(block.id, props)} onSelect={(id) => selectBlock(id)} />
              </div>
            </div>
          </div>
        ))}

        {/* Bottom drop zone */}
        {blocks.length > 0 && (
          <div
            className="h-8 relative"
            onDragOver={(e) => { e.preventDefault(); setDragOverIdx(blocks.length); }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => handleDrop(e, blocks.length)}
          >
            <DropLine active={dragOverIdx === blocks.length} />
          </div>
        )}
      </div>
    </div>
  );
}
