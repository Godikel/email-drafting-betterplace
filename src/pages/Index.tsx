import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmailSidebar, templates } from "@/components/email-builder/EmailSidebar";
import { EmailEditor } from "@/components/email-builder/EmailEditor";
import { EmailPreview, generateEmailHtml } from "@/components/email-builder/EmailPreview";
import { EmailActionBar } from "@/components/email-builder/EmailActionBar";
import { toast } from "sonner";
import type { EmailState, ContentBlockType } from "@/types/email";

const initialState: EmailState = {
  subject: "",
  recipients: "",
  template: "blank",
  blocks: [],
};

const EMAIL_LOGO_URL = "https://id-preview--2581eb34-fe6b-415e-88af-86e442116d87.lovable.app/assets/skillbetter-Cv_rj9ZC.png";

let blockIdCounter = 0;

const Index = () => {
  const [activeNav, setActiveNav] = useState("new");
  const [email, setEmail] = useState<EmailState>(initialState);
  const [isSending, setIsSending] = useState(false);
  const [dragState, setDragState] = useState<{ dragging: string | null; over: string | null }>({ dragging: null, over: null });

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

  const buildEmailHtml = useCallback(() => generateEmailHtml(email, EMAIL_LOGO_URL), [email]);

  const handlePreview = () => {
    const html = buildEmailHtml();
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleSave = () => {
    toast.success("Template saved successfully!");
  };

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
      toast.success("Email sent successfully!");
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
            <EmailActionBar onPreview={handlePreview} onSave={handleSave} onSend={handleSend} isSending={isSending} />
          </header>

          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-auto">
            <div className="min-w-0 overflow-auto max-h-[calc(100vh-5rem)]">
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
            </div>
            <div className="min-w-0">
              <EmailPreview email={email} logoUrl={EMAIL_LOGO_URL} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
