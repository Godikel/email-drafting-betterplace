export type BuilderBlockType =
  | 'text'
  | 'hero'
  | 'info-box'
  | 'feature-card'
  | 'image'
  | 'video'
  | 'divider'
  | 'spacer'
  | 'button'
  | 'status-card'
  | 'two-column'
  | 'three-column'
  | 'section-box'
  | 'header'
  | 'footer';

export interface BulletPoint {
  text: string;
  subtext?: string;
}

export type TextContentItemType = 'heading' | 'emoji-desc' | 'pointer' | 'bullet';

export interface TextContentItem {
  id: string;
  type: TextContentItemType;
  text: string;
  // heading
  level?: 1 | 2 | 3;
  // emoji-desc
  emoji?: string;
  // pointer / bullet sub-items
  subItems?: string[];
}

export interface BuilderBlock {
  id: string;
  type: BuilderBlockType;
  props: Record<string, any>;
  children?: BuilderBlock[][];
}

export interface WrapperSettings {
  maxWidth: number;
  bgColor: string;
  padding: number;
  borderRadius: number;
  emailBgColor: string;
}

export interface BuilderEmailState {
  subject: string;
  recipients: string;
  cc: string;
  bcc: string;
  blocks: BuilderBlock[];
  wrapper: WrapperSettings;
}

export const DEFAULT_WRAPPER: WrapperSettings = {
  maxWidth: 680,
  bgColor: '#ffffff',
  padding: 24,
  borderRadius: 8,
  emailBgColor: '#f0f0f5',
};

export function createBlock(type: BuilderBlockType): BuilderBlock {
  const id = `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const defaults: Record<BuilderBlockType, Record<string, any>> = {
    text: { content: 'Enter your text here...', fontSize: 16, color: '#333333', alignment: 'left', items: [] as TextContentItem[] },
    hero: {
      title: 'Your Headline Here', subtitle: 'A compelling subtitle goes here',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🚀',
      ctaText: 'Get Started', ctaLink: '#', ctaBgColor: '#ffffff', ctaTextColor: '#667eea',
    },
    'info-box': { icon: '💡', title: 'Did you know?', description: 'Add important information here.', borderColor: '#3b82f6', bgColor: '#eff6ff' },
    'feature-card': {
      icon: '⚡', title: 'Feature Name', description: 'Describe this feature.',
      bullets: [{ text: 'Point one', subtext: '' }, { text: 'Point two', subtext: '' }],
      columns: 1,
      bgColor: '#ffffff', borderColor: '#e5e7eb', accentColor: '#3b82f6',
      iconBgColor: '#eff6ff', titleColor: '#1a1a2e', descColor: '#555555',
      bulletColor: '#3b82f6', spacing: 20,
    },
    image: { src: '', alt: '', alignment: 'center', maxWidth: 100, borderRadius: 8, caption: '' },
    video: { videoUrl: '', thumbnailSrc: '', playButtonStyle: 'circle' },
    divider: { thickness: 1, color: '#e5e7eb', margin: 16 },
    spacer: { height: 32 },
    button: { label: 'Click Here', link: '#', bgColor: '#3b82f6', textColor: '#ffffff', borderRadius: 6, alignment: 'center', fullWidth: false },
    'status-card': { icon: '✅', title: 'Status Update', description: 'Everything is running smoothly.', accentColor: '#10b981' },
    'two-column': {},
    'three-column': {},
    'section-box': {
      bgColor: '#f8f9fa', gradient: '', borderRadius: 12, padding: 24, borderColor: '', borderWidth: 0,
    },
    'header': {
      logoSrc: '', logoAlt: 'Logo', logoMaxWidth: 150,
      logo2Src: '', logo2Alt: 'Partner Logo', logo2MaxWidth: 120,
      showLogoDivider: true,
      labelText: 'AI Capabilities Update', labelColor: '#1a6fa8',
      bgColor: '#ffffff', padding: 16, showDivider: true,
    },
    'footer': {
      logoSrc: '', logoAlt: 'Logo', logoAlignment: 'center', logoMaxWidth: 100,
      text: '© 2026 Your Company. All rights reserved.',
      links: [{ label: 'Privacy Policy', url: '#' }, { label: 'Unsubscribe', url: '#' }],
      bgColor: '#f8f9fa', textColor: '#888888', padding: 24, showDivider: true,
    },
  };

  const block: BuilderBlock = { id, type, props: { ...defaults[type] } };
  if (type === 'two-column') block.children = [[], []];
  if (type === 'three-column') block.children = [[], [], []];
  if (type === 'section-box') block.children = [[]];
  return block;
}

// Normalize legacy string bullets to BulletPoint objects
export function normalizeBullets(bullets: any[]): BulletPoint[] {
  return (bullets || []).map(b => typeof b === 'string' ? { text: b, subtext: '' } : b);
}

export const BUILDER_TEMPLATES: Record<string, { name: string; description: string; state: BuilderEmailState }> = {
  blank: {
    name: 'Blank Email',
    description: 'Start from scratch',
    state: { subject: '', recipients: '', cc: '', bcc: '', blocks: [], wrapper: { ...DEFAULT_WRAPPER } },
  },
  productUpdate: {
    name: 'Product Update',
    description: 'Announce new features',
    state: {
      subject: 'Exciting Product Updates', recipients: '', cc: '', bcc: '',
      wrapper: { ...DEFAULT_WRAPPER },
      blocks: [
        { id: 't1', type: 'hero', props: { title: 'Product Update', subtitle: "See what's new this month", gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🚀', ctaText: 'Learn More', ctaLink: '#', ctaBgColor: '#ffffff', ctaTextColor: '#667eea' } },
        { id: 't2', type: 'text', props: { content: "Hi there! We've been working hard to bring you some amazing new features. Here's what's new:", fontSize: 16, color: '#333333', alignment: 'left' } },
        { id: 't3', type: 'feature-card', props: { icon: '⚡', title: 'Lightning Fast', description: 'Our new engine is 3x faster.', bullets: [{ text: 'Optimized rendering', subtext: '' }, { text: 'Smart caching', subtext: '' }, { text: 'Lazy loading', subtext: '' }], columns: 1, bgColor: '#ffffff', borderColor: '#e5e7eb', accentColor: '#3b82f6', iconBgColor: '#eff6ff', titleColor: '#1a1a2e', descColor: '#555555', bulletColor: '#3b82f6', spacing: 20 } },
        { id: 't4', type: 'divider', props: { thickness: 1, color: '#e5e7eb', margin: 16 } },
        { id: 't5', type: 'button', props: { label: 'Try It Now', link: '#', bgColor: '#667eea', textColor: '#ffffff', borderRadius: 6, alignment: 'center', fullWidth: false } },
      ],
    },
  },
  announcement: {
    name: 'Release Announcement',
    description: 'Announce a new release',
    state: {
      subject: 'New Release Available', recipients: '', cc: '', bcc: '',
      wrapper: { ...DEFAULT_WRAPPER },
      blocks: [
        { id: 'a1', type: 'hero', props: { title: 'Version 2.0 is Here', subtitle: 'The biggest update yet', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '🎉', ctaText: 'Update Now', ctaLink: '#', ctaBgColor: '#ffffff', ctaTextColor: '#f5576c' } },
        { id: 'a2', type: 'status-card', props: { icon: '✅', title: 'Release Status', description: 'Version 2.0 is live and ready to use.', accentColor: '#10b981' } },
        { id: 'a3', type: 'text', props: { content: "We're excited to announce the release of version 2.0, packed with new features and improvements.", fontSize: 16, color: '#333333', alignment: 'left' } },
        { id: 'a4', type: 'divider', props: { thickness: 1, color: '#e5e7eb', margin: 16 } },
        { id: 'a5', type: 'button', props: { label: 'View Release Notes', link: '#', bgColor: '#f5576c', textColor: '#ffffff', borderRadius: 6, alignment: 'center', fullWidth: false } },
      ],
    },
  },
  partner: {
    name: 'Partner Update',
    description: 'Update partners or stakeholders',
    state: {
      subject: 'Partnership Update', recipients: '', cc: '', bcc: '',
      wrapper: { ...DEFAULT_WRAPPER },
      blocks: [
        { id: 'p1', type: 'hero', props: { title: 'Partner Update', subtitle: 'Monthly progress report', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: '🤝', ctaText: 'View Dashboard', ctaLink: '#', ctaBgColor: '#ffffff', ctaTextColor: '#4facfe' } },
        { id: 'p2', type: 'info-box', props: { icon: '📊', title: 'Key Metrics', description: 'Revenue up 25% MoM. User engagement increased by 40%.', borderColor: '#4facfe', bgColor: '#f0f9ff' } },
        { id: 'p3', type: 'text', props: { content: "Dear Partners, here's our monthly progress update.", fontSize: 16, color: '#333333', alignment: 'left' } },
        { id: 'p4', type: 'feature-card', props: { icon: '📈', title: 'Growth Highlights', description: 'Key achievements this month.', bullets: [{ text: '25% revenue growth', subtext: '' }, { text: '10K new users', subtext: '' }, { text: '99.9% uptime', subtext: '' }], columns: 1, bgColor: '#ffffff', borderColor: '#e5e7eb', accentColor: '#3b82f6', iconBgColor: '#eff6ff', titleColor: '#1a1a2e', descColor: '#555555', bulletColor: '#3b82f6', spacing: 20 } },
        { id: 'p5', type: 'button', props: { label: 'Full Report', link: '#', bgColor: '#4facfe', textColor: '#ffffff', borderRadius: 6, alignment: 'center', fullWidth: false } },
      ],
    },
  },
  newsletter: {
    name: 'Newsletter',
    description: 'Weekly or monthly newsletter',
    state: {
      subject: "This Week's Highlights", recipients: '', cc: '', bcc: '',
      wrapper: { ...DEFAULT_WRAPPER },
      blocks: [
        { id: 'n1', type: 'hero', props: { title: 'Weekly Newsletter', subtitle: 'Your digest of the latest updates', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', icon: '📬', ctaText: '', ctaLink: '', ctaBgColor: '#ffffff', ctaTextColor: '#a18cd1' } },
        { id: 'n2', type: 'text', props: { content: '<b>Top Stories</b><br>Here are this week\'s highlights you don\'t want to miss.', fontSize: 16, color: '#333333', alignment: 'left' } },
        { id: 'n3', type: 'image', props: { src: '', alt: 'Featured image', alignment: 'center', maxWidth: 100, borderRadius: 8, caption: 'Featured article image' } },
        { id: 'n4', type: 'divider', props: { thickness: 1, color: '#e5e7eb', margin: 16 } },
        { id: 'n5', type: 'text', props: { content: '<b>Upcoming Events</b><br>Don\'t miss our upcoming webinar on AI trends.', fontSize: 16, color: '#333333', alignment: 'left' } },
        { id: 'n6', type: 'button', props: { label: 'Read More', link: '#', bgColor: '#a18cd1', textColor: '#ffffff', borderRadius: 6, alignment: 'center', fullWidth: false } },
      ],
    },
  },
};
