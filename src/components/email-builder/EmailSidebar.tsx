import { Mail, FileText, PlusCircle, Sparkles, Pencil, Save, Trash2 } from "lucide-react";
import { iffcoTokioTemplate } from "@/templates/iffcoTokioTemplate";
import { iffcoTokioEditableTemplate } from "@/templates/iffcoTokioEditableTemplate";
import { iffcoTokioV2Template } from "@/templates/iffcoTokioV2Template";
import { navbackTemplate } from "@/templates/navbackTemplate";
import { purplleTemplate } from "@/templates/purplleTemplate";
import { biiGenderInclusivityTemplate } from "@/templates/biiGenderInclusivityTemplate";
import type { EmailState } from "@/types/email";
import type { SavedTemplate } from "@/hooks/useEmailTemplates";
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
  aiRoadmapEditable: iffcoTokioEditableTemplate,
  aiRoadmapV2: iffcoTokioV2Template,
  navback: navbackTemplate,
  purplle: purplleTemplate,
  biiGenderInclusivity: biiGenderInclusivityTemplate,
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
  savedTemplates?: SavedTemplate[];
  onLoadSaved?: (tpl: SavedTemplate) => void;
  onDeleteSaved?: (id: string) => void;
}

export function EmailSidebar({ active, onNavigate, onTemplateLoad, savedTemplates = [], onLoadSaved, onDeleteSaved }: EmailSidebarProps) {
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
                  <span>AI Roadmap (Original)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("aiRoadmapEditable")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>AI Roadmap (Visual Edit)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("aiRoadmapV2")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>AI Roadmap V2</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("navback")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Navback</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("purplle")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Purplle</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTemplateLoad?.("biiGenderInclusivity")}
                  className="text-sidebar-foreground hover:bg-muted"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>BII Gender Inclusivity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {savedTemplates.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Saved Templates
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {savedTemplates.map((tpl) => (
                  <SidebarMenuItem key={tpl.id}>
                    <SidebarMenuButton
                      onClick={() => onLoadSaved?.(tpl)}
                      className="text-sidebar-foreground hover:bg-muted"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      <span className="truncate flex-1">{tpl.name}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5"
                        onClick={(e) => { e.stopPropagation(); onDeleteSaved?.(tpl.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
