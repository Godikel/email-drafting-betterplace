import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { BuilderBlock, BuilderEmailState, WrapperSettings, BuilderBlockType } from '@/types/builder';
import { createBlock, DEFAULT_WRAPPER } from '@/types/builder';

interface BuilderState {
  present: BuilderEmailState;
  past: BuilderEmailState[];
  future: BuilderEmailState[];
  selectedBlockId: string | null;
}

type Action =
  | { type: 'ADD_BLOCK'; block: BuilderBlock; index?: number }
  | { type: 'ADD_BLOCK_TO_COLUMN'; parentId: string; columnIndex: number; block: BuilderBlock }
  | { type: 'REMOVE_BLOCK'; id: string }
  | { type: 'UPDATE_PROPS'; id: string; props: Record<string, any> }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'DUPLICATE_BLOCK'; id: string }
  | { type: 'SELECT'; id: string | null }
  | { type: 'UPDATE_WRAPPER'; wrapper: Partial<WrapperSettings> }
  | { type: 'UPDATE_EMAIL'; fields: Partial<Pick<BuilderEmailState, 'subject' | 'recipients' | 'cc' | 'bcc'>> }
  | { type: 'LOAD'; state: BuilderEmailState }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const MAX_HISTORY = 50;

function snapshot(state: BuilderState): BuilderState {
  return { ...state, past: [...state.past.slice(-MAX_HISTORY), state.present], future: [] };
}

function removeBlockRec(blocks: BuilderBlock[], id: string): BuilderBlock[] {
  return blocks
    .filter(b => b.id !== id)
    .map(b => b.children ? { ...b, children: b.children.map(col => removeBlockRec(col, id)) } : b);
}

function updatePropsRec(blocks: BuilderBlock[], id: string, props: Record<string, any>): BuilderBlock[] {
  return blocks.map(b => {
    if (b.id === id) return { ...b, props: { ...b.props, ...props } };
    if (b.children) return { ...b, children: b.children.map(col => updatePropsRec(col, id, props)) };
    return b;
  });
}

function dupId() {
  return `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function deepCloneBlock(b: BuilderBlock): BuilderBlock {
  return {
    ...b,
    id: dupId(),
    props: { ...b.props },
    children: b.children?.map(col => col.map(deepCloneBlock)),
  };
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const s = snapshot(state);
      const blocks = [...s.present.blocks];
      blocks.splice(action.index ?? blocks.length, 0, action.block);
      return { ...s, present: { ...s.present, blocks }, selectedBlockId: action.block.id };
    }
    case 'ADD_BLOCK_TO_COLUMN': {
      const s = snapshot(state);
      const blocks = s.present.blocks.map(b => {
        if (b.id === action.parentId && b.children) {
          const children = b.children.map((col, i) =>
            i === action.columnIndex ? [...col, action.block] : col
          );
          return { ...b, children };
        }
        return b;
      });
      return { ...s, present: { ...s.present, blocks }, selectedBlockId: action.block.id };
    }
    case 'REMOVE_BLOCK': {
      const s = snapshot(state);
      return {
        ...s,
        present: { ...s.present, blocks: removeBlockRec(s.present.blocks, action.id) },
        selectedBlockId: state.selectedBlockId === action.id ? null : state.selectedBlockId,
      };
    }
    case 'UPDATE_PROPS': {
      const s = snapshot(state);
      return { ...s, present: { ...s.present, blocks: updatePropsRec(s.present.blocks, action.id, action.props) } };
    }
    case 'MOVE_BLOCK': {
      const s = snapshot(state);
      const blocks = [...s.present.blocks];
      const [moved] = blocks.splice(action.fromIndex, 1);
      blocks.splice(action.toIndex, 0, moved);
      return { ...s, present: { ...s.present, blocks } };
    }
    case 'DUPLICATE_BLOCK': {
      const s = snapshot(state);
      const idx = s.present.blocks.findIndex(b => b.id === action.id);
      if (idx === -1) return state;
      const dup = deepCloneBlock(s.present.blocks[idx]);
      const blocks = [...s.present.blocks];
      blocks.splice(idx + 1, 0, dup);
      return { ...s, present: { ...s.present, blocks }, selectedBlockId: dup.id };
    }
    case 'SELECT':
      return { ...state, selectedBlockId: action.id };
    case 'UPDATE_WRAPPER': {
      const s = snapshot(state);
      return { ...s, present: { ...s.present, wrapper: { ...s.present.wrapper, ...action.wrapper } } };
    }
    case 'UPDATE_EMAIL':
      return { ...state, present: { ...state.present, ...action.fields } };
    case 'LOAD':
      return { present: action.state, past: [], future: [], selectedBlockId: null };
    case 'UNDO': {
      if (!state.past.length) return state;
      return {
        present: state.past[state.past.length - 1],
        past: state.past.slice(0, -1),
        future: [state.present, ...state.future],
        selectedBlockId: state.selectedBlockId,
      };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      return {
        present: state.future[0],
        past: [...state.past, state.present],
        future: state.future.slice(1),
        selectedBlockId: state.selectedBlockId,
      };
    }
    default:
      return state;
  }
}

interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<Action>;
  addBlock: (type: BuilderBlockType, index?: number) => void;
  addBlockToColumn: (parentId: string, columnIndex: number, type: BuilderBlockType) => void;
  removeBlock: (id: string) => void;
  updateProps: (id: string, props: Record<string, any>) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  duplicateBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  selectedBlock: BuilderBlock | null;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children, initialState }: { children: React.ReactNode; initialState?: BuilderEmailState }) {
  const defaultEmail: BuilderEmailState = initialState || {
    subject: '', recipients: '', cc: '', bcc: '',
    blocks: [],
    wrapper: { ...DEFAULT_WRAPPER },
  };

  const [state, dispatch] = useReducer(reducer, {
    present: defaultEmail,
    past: [],
    future: [],
    selectedBlockId: null,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.metaKey || e.ctrlKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedBlockId && !isEditable) {
        e.preventDefault();
        dispatch({ type: 'REMOVE_BLOCK', id: state.selectedBlockId });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && state.selectedBlockId) {
        e.preventDefault();
        dispatch({ type: 'DUPLICATE_BLOCK', id: state.selectedBlockId });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedBlockId]);

  const findBlock = useCallback((id: string): BuilderBlock | null => {
    const search = (blocks: BuilderBlock[]): BuilderBlock | null => {
      for (const b of blocks) {
        if (b.id === id) return b;
        if (b.children) {
          for (const col of b.children) {
            const found = search(col);
            if (found) return found;
          }
        }
      }
      return null;
    };
    return search(state.present.blocks);
  }, [state.present.blocks]);

  const value: BuilderContextValue = {
    state,
    dispatch,
    addBlock: (type, index) => dispatch({ type: 'ADD_BLOCK', block: createBlock(type), index }),
    addBlockToColumn: (parentId, columnIndex, type) =>
      dispatch({ type: 'ADD_BLOCK_TO_COLUMN', parentId, columnIndex, block: createBlock(type) }),
    removeBlock: (id) => dispatch({ type: 'REMOVE_BLOCK', id }),
    updateProps: (id, props) => dispatch({ type: 'UPDATE_PROPS', id, props }),
    moveBlock: (from, to) => dispatch({ type: 'MOVE_BLOCK', fromIndex: from, toIndex: to }),
    duplicateBlock: (id) => dispatch({ type: 'DUPLICATE_BLOCK', id }),
    selectBlock: (id) => dispatch({ type: 'SELECT', id }),
    selectedBlock: state.selectedBlockId ? findBlock(state.selectedBlockId) : null,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider');
  return ctx;
}
