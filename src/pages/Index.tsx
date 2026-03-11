import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmailSidebar } from "@/components/email-builder/EmailSidebar";
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

let blockIdCounter = 0;

const Index = () => {
  const [activeNav, setActiveNav] = useState("new");
  const [email, setEmail] = useState<EmailState>(initialState);
  const [isSending, setIsSending] = useState(false);

  const handleChange = useCallback((update: Partial<EmailState>) => {
    setEmail((prev) => ({ ...prev, ...update }));
  }, []);

  const handleBlockChange = useCallback((id: string, content: string) => {
    setEmail((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
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

  const handlePreview = () => {
    const html = generateEmailHtml(email);
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
      const html = generateEmailHtml(email);
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
        <EmailSidebar active={activeNav} onNavigate={setActiveNav} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-base font-semibold text-foreground">Email Builder</h1>
            </div>
            <EmailActionBar onPreview={handlePreview} onSave={handleSave} onSend={handleSend} isSending={isSending} />
          </header>

          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-auto">
            <div className="min-w-0">
              <EmailEditor
                email={email}
                onChange={handleChange}
                onBlockChange={handleBlockChange}
                onBlockRemove={handleBlockRemove}
                onBlockAdd={handleBlockAdd}
              />
            </div>
            <div className="min-w-0">
              <EmailPreview email={email} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
