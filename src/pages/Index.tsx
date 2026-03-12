import { useState, useCallback, useRef, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmailSidebar, templates } from "@/components/email-builder/EmailSidebar";
import { EmailEditor } from "@/components/email-builder/EmailEditor";
import { EmailPreview, generateEmailHtml } from "@/components/email-builder/EmailPreview";
import { VisualEmailEditor } from "@/components/email-builder/VisualEmailEditor";
import { EmailActionBar } from "@/components/email-builder/EmailActionBar";
import { useEmailTemplates } from "@/hooks/useEmailTemplates";
import { toast } from "sonner";
import type { EmailState, ContentBlockType } from "@/types/email";

const initialState: EmailState = {
  subject: "",
  recipients: "",
  template: "blank",
  blocks: [],
  rawHtml: undefined,
};

const EMAIL_LOGO_URL = "https://radiant-reply-room.lovable.app/images/skillbetter-logo.png";

let blockIdCounter = 0;

const Index = () => {
  const [activeNav, setActiveNav] = useState("new");
  const [email, setEmail] = useState<EmailState>(initialState);
  const [isSending, setIsSending] = useState(false);
  const [dragState, setDragState] = useState<{ dragging: string | null; over: string | null }>({ dragging: null, over: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | undefined>();
  const { savedTemplates, fetchTemplates, saveTemplate, deleteTemplate } = useEmailTemplates();

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleHtmlUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      toast.error("Please upload an HTML file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = ev.target?.result as string;
      setEmail((prev) => ({ ...prev, rawHtml: html, blocks: [] }));
      toast.success(`Loaded "${file.name}" as raw HTML`);
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-uploaded
    e.target.value = "";
  }, []);

  const handleClearRawHtml = useCallback(() => {
    setEmail((prev) => ({ ...prev, rawHtml: undefined }));
    toast.info("Switched back to block editor");
  }, []);

  const handleChange = useCallback((update: Partial<EmailState>) => {
    setEmail((prev) => ({ ...prev, ...update }));
  }, []);

  const handleBlockChange = useCallback((id: string, content: string) => {
    setEmail((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }));
  }, []);

  const handleBlockMetaChange = useCallback((id: string, meta: string) => {
    setEmail((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, meta } : b)),
    }));
  }, []);

  const handleBlockRemove = useCallback((id: string) => {
    setEmail((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));
  }, []);

  const handleBlockAdd = useCallback((type: ContentBlockType) => {
    blockIdCounter++;
    setEmail((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { id: `block-${blockIdCounter}`, type, content: "" }],
    }));
  }, []);

  const handleBlockReorder = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;
    setEmail((prev) => {
      const blocks = [...prev.blocks];
      const fromIndex = blocks.findIndex((b) => b.id === fromId);
      const toIndex = blocks.findIndex((b) => b.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...prev, blocks };
    });
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDragState({ dragging: id, over: null });
  }, []);

  const handleDragOver = useCallback((id: string) => {
    setDragState((prev) => ({ ...prev, over: id }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState((prev) => {
      if (prev.dragging && prev.over && prev.dragging !== prev.over) {
        handleBlockReorder(prev.dragging, prev.over);
      }
      return { dragging: null, over: null };
    });
  }, [handleBlockReorder]);

  const handleTemplateLoad = useCallback((templateName: string) => {
    const tpl = templates[templateName];
    if (tpl) {
      setEmail({ ...tpl, blocks: tpl.blocks.map((b) => ({ ...b })) });
      toast.success(`Loaded "${templateName}" template`);
    }
  }, []);

  const buildEmailHtml = useCallback(() => {
    if (email.rawHtml) return email.rawHtml;
    return generateEmailHtml(email, EMAIL_LOGO_URL);
  }, [email]);

  const handlePreview = () => {
    const html = buildEmailHtml();
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleSave = async () => {
    const name = prompt("Template name:", email.subject || "Untitled Template");
    if (!name) return;
    await saveTemplate(name, email, currentTemplateId);
  };

  const handleLoadSaved = useCallback((tpl: { id: string; name: string; template_data: EmailState }) => {
    setEmail(tpl.template_data);
    setCurrentTemplateId(tpl.id);
    toast.success(`Loaded "${tpl.name}"`);
  }, []);

  const handleSend = async () => {
    if (!email.subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!email.recipients.trim()) {
      toast.error("Please enter at least one recipient.");
      return;
    }

    setIsSending(true);
    try {
      const html = buildEmailHtml();
      const payloadSize = new Blob([html]).size;
      if (payloadSize > 100000) {
        toast.warning(`HTML is large (${(payloadSize / 1024).toFixed(0)} KB). Gmail may truncate or reject emails over ~100 KB.`);
      }
      await fetch(
        "https://script.google.com/macros/s/AKfycbzrlKhp_vdMTE8vkupLjB5TWZ5B67qKdTg86N7f6LdN0scAzT0CcknB72EPF7kOosEy/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            subject: email.subject,
            recipients: email.recipients,
            html,
          }),
        },
      );
      toast.info("Email request sent! Due to CORS, delivery can't be confirmed — please check the recipient inbox.");
    } catch {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EmailSidebar active={activeNav} onNavigate={setActiveNav} onTemplateLoad={handleTemplateLoad} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-base font-semibold text-foreground">Email Builder</h1>
            </div>
            <EmailActionBar
              onPreview={handlePreview}
              onSave={handleSave}
              onSend={handleSend}
              isSending={isSending}
              onUploadHtml={() => fileInputRef.current?.click()}
              hasRawHtml={!!email.rawHtml}
              onClearRawHtml={handleClearRawHtml}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              className="hidden"
              onChange={handleHtmlUpload}
            />
          </header>

          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-auto">
            {email.template === "ai-roadmap-editable" ? (
              /* ── Visual Editor Mode: full-width WYSIWYG ── */
              <>
                <div className="min-w-0 overflow-auto max-h-[calc(100vh-5rem)]">
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <input
                        id="subject"
                        placeholder="Enter email subject…"
                        value={email.subject}
                        onChange={(e) => handleChange({ subject: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="recipients" className="text-sm font-medium">Recipients</label>
                      <input
                        id="recipients"
                        placeholder="e.g. team@company.com, user@example.com"
                        value={email.recipients}
                        onChange={(e) => handleChange({ recipients: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                  <VisualEmailEditor
                    blocks={email.blocks}
                    onBlockMetaChange={handleBlockMetaChange}
                    onBlockRemove={handleBlockRemove}
                    onBlockReorder={handleBlockReorder}
                  />
                </div>
                <div className="min-w-0">
                  <EmailPreview email={email} logoUrl={EMAIL_LOGO_URL} />
                </div>
              </>
            ) : (
              /* ── Standard Editor + Preview ── */
              <>
                <div className="min-w-0 overflow-auto max-h-[calc(100vh-5rem)]">
                  {email.rawHtml ? (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-foreground">Raw HTML Mode</h2>
                      <p className="text-sm text-muted-foreground">
                        An HTML file is loaded. Fill in subject & recipients, then preview or send.
                      </p>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                          <input
                            id="subject"
                            placeholder="Enter email subject…"
                            value={email.subject}
                            onChange={(e) => handleChange({ subject: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="recipients" className="text-sm font-medium">Recipients</label>
                          <input
                            id="recipients"
                            placeholder="e.g. team@company.com, user@example.com"
                            value={email.recipients}
                            onChange={(e) => handleChange({ recipients: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmailEditor
                      email={email}
                      onChange={handleChange}
                      onBlockChange={handleBlockChange}
                      onBlockMetaChange={handleBlockMetaChange}
                      onBlockRemove={handleBlockRemove}
                      onBlockAdd={handleBlockAdd}
                      onBlockReorder={handleBlockReorder}
                      dragState={dragState}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  {email.rawHtml ? (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Live Preview</h3>
                      <div className="rounded-lg border bg-card shadow-card overflow-hidden">
                        <iframe
                          title="Raw HTML Preview"
                          srcDoc={email.rawHtml.includes('<meta charset') ? email.rawHtml : `<meta charset="utf-8">${email.rawHtml}`}
                          className="w-full min-h-[600px] border-0"
                          sandbox="allow-same-origin allow-popups"
                        />
                      </div>
                    </div>
                  ) : (
                    <EmailPreview email={email} logoUrl={EMAIL_LOGO_URL} />
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
