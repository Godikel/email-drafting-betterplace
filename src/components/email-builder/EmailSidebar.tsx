import { Mail, FileText, PlusCircle, Sparkles } from "lucide-react";
import { iffcoTokioTemplate } from "@/templates/iffcoTokioTemplate";
import type { EmailState } from "@/types/email";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const initialState: EmailState = {
  subject: "",
  recipients: "",
  template: "blank",
  blocks: [],
};

export const templates: Record<string, EmailState> = {
  blank: initialState,
  aiRoadmap: iffcoTokioTemplate,
};

const navItems = [
  { title: "Templates", icon: FileText, id: "templates" },
  { title: "Campaigns", icon: Mail, id: "campaigns" },
  { title: "New Email", icon: PlusCircle, id: "new" },
];

interface EmailSidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  onTemplateLoad?: (templateName: string) => void;
}

export function EmailSidebar({ active, onNavigate, onTemplateLoad }: EmailSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Email Builder
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    className={
                      active === item.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-muted"
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Quick Templates
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("aiRoadmap")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>AI Roadmap Email</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
