import { useState, useCallback } from 'react';
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown, ImageIcon, PlayCircle, Plus } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import type { BuilderBlock, BuilderBlockType } from '@/types/builder';
import { createBlock } from '@/types/builder';
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

/* ── Quick add inside columns ── */
const SIMPLE_TYPES: { type: BuilderBlockType; label: string }[] = [
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'divider', label: 'Divider' },
  { type: 'spacer', label: 'Spacer' },
];

/* ── Block content renderers ── */
function RenderBlock({ block, onUpdate }: { block: BuilderBlock; onUpdate: (p: Record<string, any>) => void }) {
  const { addBlockToColumn, removeBlock, updateProps } = useBuilder();
  const p = block.props;

  switch (block.type) {
    case 'text':
      return (
        <div
          contentEditable suppressContentEditableWarning
          className="outline-none min-h-[1.5em]"
          style={{ fontSize: p.fontSize, color: p.color, textAlign: p.alignment, lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: p.content }}
          onBlur={(e) => onUpdate({ content: e.currentTarget.innerHTML })}
        />
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

    case 'feature-card':
      return (
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{p.icon}</span>
            <div contentEditable suppressContentEditableWarning className="font-semibold outline-none"
              onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
          </div>
          <div contentEditable suppressContentEditableWarning className="text-sm text-muted-foreground outline-none mb-3"
            onBlur={(e) => onUpdate({ description: e.currentTarget.textContent || '' })}>{p.description}</div>
          {p.bullets?.length > 0 && (
            <ul className="space-y-1.5">
              {p.bullets.map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span contentEditable suppressContentEditableWarning className="outline-none flex-1"
                    onBlur={(e) => {
                      const bullets = [...p.bullets];
                      bullets[i] = e.currentTarget.textContent || '';
                      onUpdate({ bullets });
                    }}>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'image':
      return (
        <div style={{ textAlign: p.alignment as any }}>
          {p.src ? (
            <img src={p.src} alt={p.alt} className="inline-block" style={{ maxWidth: `${p.maxWidth}%`, borderRadius: p.borderRadius }} />
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Add an image via the properties panel</p>
            </div>
          )}
          {p.caption && <p className="text-xs text-muted-foreground mt-2 text-center">{p.caption}</p>}
        </div>
      );

    case 'video':
      return (
        <div className="relative rounded-lg overflow-hidden bg-muted text-center">
          {p.thumbnailSrc ? (
            <img src={p.thumbnailSrc} alt="Video thumbnail" className="w-full" />
          ) : (
            <div className="py-12 text-muted-foreground">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm">Add video details via properties panel</p>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayCircle className="h-14 w-14 text-white/90 drop-shadow-lg" />
          </div>
        </div>
      );

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
        <div className="rounded-lg border p-4" style={{ borderLeftWidth: 4, borderLeftColor: p.accentColor }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{p.icon}</span>
            <div>
              <div contentEditable suppressContentEditableWarning className="font-semibold outline-none"
                onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || '' })}>{p.title}</div>
              <div contentEditable suppressContentEditableWarning className="text-sm text-muted-foreground outline-none"
                onBlur={(e) => onUpdate({ description: e.currentTarget.textContent || '' })}>{p.description}</div>
            </div>
          </div>
        </div>
      );

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
                <div key={child.id} className="relative group/child">
                  <div className="absolute -right-1 -top-1 opacity-0 group-hover/child:opacity-100 z-10">
                    <Button variant="ghost" size="icon" className="h-5 w-5 bg-destructive/10 hover:bg-destructive/20"
                      onClick={() => removeBlock(child.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <RenderBlock block={child} onUpdate={(props) => updateProps(child.id, props)} />
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
      style={{ backgroundColor: 'hsl(220 20% 95%)' }}
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
                <RenderBlock block={block} onUpdate={(props) => updateProps(block.id, props)} />
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
