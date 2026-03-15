import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Undo2, Redo2, Eye, Send, ChevronDown, ChevronUp, Trash2, FileText, Clock, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { BlockLibrary } from '@/components/builder/BlockLibrary';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { generateBuilderHtml } from '@/lib/generateBuilderHtml';
import { BUILDER_TEMPLATES } from '@/types/builder';
import type { BuilderBlockType, BuilderEmailState } from '@/types/builder';
import { useBuilderDrafts } from '@/hooks/useBuilderDrafts';
import { useScriptSettings } from '@/hooks/useScriptSettings';
import { useAuth } from '@/contexts/AuthContext';
import { ScriptSettingsDialog } from '@/components/ScriptSettingsDialog';
import { toast } from 'sonner';

function BuilderInner() {
  const { state, dispatch, addBlock, canUndo, canRedo } = useBuilder();
  const email = state.present;
  const { signOut } = useAuth();
  const [showRecipients, setShowRecipients] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!email.blocks.length);
  const { drafts, loading: draftsLoading, deleteDraft, autosave, setActiveDraft, draftId } = useBuilderDrafts();
  const { scriptUrl } = useScriptSettings();
  const prevEmailRef = useRef<string>('');

  // Auto-save on email state changes
  useEffect(() => {
    const serialized = JSON.stringify(email);
    if (serialized !== prevEmailRef.current) {
      prevEmailRef.current = serialized;
      autosave(email);
    }
  }, [email, autosave]);

  const up = (fields: Record<string, string>) => dispatch({ type: 'UPDATE_EMAIL', fields });

  const handlePreview = () => {
    const html = generateBuilderHtml(email);
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const handleSend = async () => {
    if (!scriptUrl.trim()) { toast.error('Please configure your Script URL in Script Settings first.'); return; }
    if (!email.subject.trim()) { toast.error('Please enter a subject.'); return; }
    if (!email.recipients.trim()) { toast.error('Please enter recipients.'); return; }
    setIsSending(true);
    try {
      const html = generateBuilderHtml(email);
      await fetch(
        scriptUrl,
        {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
          body: JSON.stringify({
            subject: email.subject.replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{FE00}-\u{FEFF}|\u{1F900}-\u{1F9FF}]/gu, '').trim(),
            recipients: email.recipients,
            cc: email.cc || '',
            bcc: email.bcc || '',
            html,
          }),
        },
      );
      toast.info('Email request sent! Check recipient inbox.');
    } catch {
      toast.error('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const loadTemplate = (key: string) => {
    const tpl = BUILDER_TEMPLATES[key];
    if (tpl) {
      dispatch({ type: 'LOAD', state: { ...tpl.state, blocks: tpl.state.blocks.map(b => ({ ...b, props: { ...b.props } })) } });
      setActiveDraft(null);
      setShowTemplates(false);
      toast.success(`Loaded "${tpl.name}" template`);
    }
  };

  const loadDraft = (draft: { id: string; template_data: BuilderEmailState }) => {
    dispatch({ type: 'LOAD', state: draft.template_data });
    setActiveDraft(draft.id);
    setShowTemplates(false);
    toast.success('Draft loaded');
  };

  const handleDeleteDraft = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteDraft(id);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* ── Header ── */}
      <header className="shrink-0 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3 px-4 h-12">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-5 w-px bg-border" />
          <Input
            value={email.subject}
            onChange={(e) => up({ subject: e.target.value })}
            placeholder="Email subject..."
            className="h-8 flex-1 max-w-md border-0 bg-transparent text-sm font-medium focus-visible:ring-1 px-2"
          />
          {draftId && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Auto-saving
            </span>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canUndo} onClick={() => dispatch({ type: 'UNDO' })} title="Undo (Ctrl+Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canRedo} onClick={() => dispatch({ type: 'REDO' })} title="Redo (Ctrl+Shift+Z)">
              <Redo2 className="h-4 w-4" />
            </Button>
            <div className="h-5 w-px bg-border mx-1" />
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowRecipients(!showRecipients)}>
              Recipients {showRecipients ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowTemplates(true)}>
              <FileText className="h-3.5 w-3.5" />Templates
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handlePreview}>
              <Eye className="h-3.5 w-3.5" />Preview
            </Button>
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5" onClick={handleSend} disabled={isSending}>
              <Send className="h-3.5 w-3.5" />{isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
        {showRecipients && (
          <div className="flex items-center gap-3 px-4 pb-2 pt-1">
            <div className="flex-1 flex gap-3">
              <Input value={email.recipients} onChange={(e) => up({ recipients: e.target.value })} placeholder="To: email@example.com" className="h-8 text-xs flex-1" />
              <Input value={email.cc} onChange={(e) => up({ cc: e.target.value })} placeholder="CC" className="h-8 text-xs w-40" />
              <Input value={email.bcc} onChange={(e) => up({ bcc: e.target.value })} placeholder="BCC" className="h-8 text-xs w-40" />
            </div>
          </div>
        )}
      </header>

      {/* ── Template & Drafts picker overlay ── */}
      {showTemplates && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowTemplates(false)}>
          <div className="bg-card rounded-xl shadow-lg border max-w-3xl w-full p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-1">Choose a Template</h2>
            <p className="text-sm text-muted-foreground mb-6">Start with a template or continue from a saved draft.</p>

            {/* Templates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(BUILDER_TEMPLATES).map(([key, tpl]) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className="text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all group"
                >
                  <div className="text-2xl mb-2">{key === 'blank' ? '📄' : key === 'productUpdate' ? '🚀' : key === 'announcement' ? '🎉' : key === 'partner' ? '🤝' : '📬'}</div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tpl.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{tpl.description}</div>
                </button>
              ))}
            </div>

            {/* Drafts */}
            {drafts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Saved Drafts
                </h3>
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => loadDraft(draft)}
                      className={`w-full text-left p-3 rounded-lg border transition-all group flex items-center gap-3 ${
                        draft.id === draftId
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                          {draft.name}
                          {draft.id === draftId && (
                            <span className="ml-2 text-[10px] text-primary font-normal">(current)</span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatDate(draft.updated_at)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive shrink-0"
                        onClick={(e) => handleDeleteDraft(e, draft.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3-Panel Layout ── */}
      <div className="flex-1 flex min-h-0">
        <div className="w-[200px] shrink-0 border-r bg-card overflow-hidden">
          <BlockLibrary onAddBlock={(type: BuilderBlockType) => addBlock(type)} />
        </div>
        <BuilderCanvas />
        <div className="w-[300px] shrink-0 overflow-hidden">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default function Builder() {
  return (
    <BuilderProvider>
      <BuilderInner />
    </BuilderProvider>
  );
}
