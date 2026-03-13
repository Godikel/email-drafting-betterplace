import {
  Type, Layout, Info, Star, CheckCircle, ImageIcon, Play,
  MousePointerClick, Minus, MoveVertical, Columns2, Columns3,
} from 'lucide-react';
import type { BuilderBlockType } from '@/types/builder';

const categories = [
  {
    name: 'Content',
    blocks: [
      { type: 'text' as BuilderBlockType, label: 'Text', icon: Type },
      { type: 'hero' as BuilderBlockType, label: 'Hero', icon: Layout },
      { type: 'info-box' as BuilderBlockType, label: 'Info Box', icon: Info },
      { type: 'feature-card' as BuilderBlockType, label: 'Feature Card', icon: Star },
      { type: 'status-card' as BuilderBlockType, label: 'Status Card', icon: CheckCircle },
    ],
  },
  {
    name: 'Media',
    blocks: [
      { type: 'image' as BuilderBlockType, label: 'Image', icon: ImageIcon },
      { type: 'video' as BuilderBlockType, label: 'Video', icon: Play },
      { type: 'button' as BuilderBlockType, label: 'Button', icon: MousePointerClick },
    ],
  },
  {
    name: 'Layout',
    blocks: [
      { type: 'divider' as BuilderBlockType, label: 'Divider', icon: Minus },
      { type: 'spacer' as BuilderBlockType, label: 'Spacer', icon: MoveVertical },
      { type: 'two-column' as BuilderBlockType, label: '2 Columns', icon: Columns2 },
      { type: 'three-column' as BuilderBlockType, label: '3 Columns', icon: Columns3 },
    ],
  },
];

interface Props {
  onAddBlock: (type: BuilderBlockType) => void;
}

export function BlockLibrary({ onAddBlock }: Props) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-5">
      <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">Blocks</h2>
      {categories.map(cat => (
        <div key={cat.name}>
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat.name}</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {cat.blocks.map(block => (
              <button
                key={block.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('builder/new-block', block.type);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAddBlock(block.type)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border/60 bg-card hover:bg-accent hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing"
              >
                <block.icon className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-medium text-foreground leading-tight">{block.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-3 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Drag blocks to the canvas or click to add. Use <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">Ctrl+Z</kbd> to undo.
        </p>
      </div>
    </div>
  );
}
