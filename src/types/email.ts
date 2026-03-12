export type ContentBlockType =
  | "hero"
  | "features"
  | "callout"
  | "text"
  | "topbar"
  | "live-status"
  | "feature-card"
  | "strategy-box"
  | "ai-card"
  | "footer"
  | "divider"
  | "image-placeholder";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  /** Optional metadata as JSON string for complex blocks */
  meta?: string;
}

export interface EmailState {
  subject: string;
  recipients: string;
  cc?: string;
  bcc?: string;
  template: string;
  blocks: ContentBlock[];
  rawHtml?: string;
}
