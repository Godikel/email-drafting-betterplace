import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Undo2, Redo2, Eye, Save, Send, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { BlockLibrary } from '@/components/builder/BlockLibrary';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { generateBuilderHtml } from '@/lib/generateBuilderHtml';
import { BUILDER_TEMPLATES } from '@/types/builder';
import type { BuilderBlockType } from '@/types/builder';
import { toast } from 'sonner';

function BuilderInner() {
  const { state, dispatch, addBlock, canUndo, canRedo } = useBuilder();
  const email = state.present;
  const [showRecipients, setShowRecipients] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!email.blocks.length);

  const up = (fields: Record<string, string>) => dispatch({ type: 'UPDATE_EMAIL', fields });

  const handlePreview = () => {
    const html = generateBuilderHtml(email);
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const handleSend = async () => {
    if (!email.subject.trim()) { toast.error('Please enter a subject.'); return; }
    if (!email.recipients.trim()) { toast.error('Please enter recipients.'); return; }
    setIsSending(true);
    try {
      const html = generateBuilderHtml(email);
      await fetch(
        'https://script.google.com/macros/s/AKfycbzrlKhp_vdMTE8vkupLjB5TWZ5B67qKdTg86N7f6LdN0scAzT0CcknB72EPF7kOosEy/exec',
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
      setShowTemplates(false);
      toast.success(`Loaded "${tpl.name}" template`);
    }
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
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handlePreview}>
              <Eye className="h-3.5 w-3.5" />Preview
            </Button>
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5" onClick={handleSend} disabled={isSending}>
              <Send className="h-3.5 w-3.5" />{isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
        {/* Recipients row */}
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

      {/* ── Template picker overlay ── */}
      {showTemplates && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowTemplates(false)}>
          <div className="bg-card rounded-xl shadow-lg border max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground mb-1">Choose a Template</h2>
            <p className="text-sm text-muted-foreground mb-6">Start with a pre-built template or a blank canvas.</p>
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
          </div>
        </div>
      )}

      {/* ── 3-Panel Layout ── */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Block Library */}
        <div className="w-[200px] shrink-0 border-r bg-card overflow-hidden">
          <BlockLibrary onAddBlock={(type: BuilderBlockType) => addBlock(type)} />
        </div>

        {/* Center: Canvas */}
        <BuilderCanvas />

        {/* Right: Properties */}
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
