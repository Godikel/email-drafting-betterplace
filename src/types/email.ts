export type ContentBlockType = "hero" | "features" | "callout" | "text";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
}

export interface EmailState {
  subject: string;
  recipients: string;
  template: string;
  blocks: ContentBlock[];
}
