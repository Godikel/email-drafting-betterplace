import type { EmailState } from "@/types/email";

/**
 * EDITABLE COPY of the Iffco Tokio AI Roadmap template.
 * The original (iffcoTokioTemplate.ts) is preserved untouched.
 * This version is used with the Visual Editor for direct UI manipulation.
 */
export const iffcoTokioEditableTemplate: EmailState = {
  subject: "AI Capabilities Roadmap – Iffco Tokio × skillBetter",
  recipients: "",
  template: "ai-roadmap-editable",
  blocks: [
    {
      id: "e-topbar",
      type: "topbar",
      content: "skillBetter × IFFCO-TOKIO",
      meta: JSON.stringify({
        brandName: "skillBetter",
        byline: "by BetterPlace",
        partnerName: "IFFCO-TOKIO",
        partnerSub: "Muskurate Raho",
        label: "AI Capabilities Update",
      }),
    },
    {
      id: "e-hero",
      type: "hero",
      content: "",
      meta: JSON.stringify({
        pill: "PRODUCT ROADMAP",
        pillEmoji: "🚀",
        title: "What's Live, What's Coming Next —",
        titleHighlight: "and Why It Matters",
        body: "Dear Iffco Tokio Team,\n\nWe are excited to share a candid update on our AI capabilities — what is live today, what is on the near horizon, and how we are building AI that genuinely moves the needle for your people.",
        pointers: [
          {
            text: "AI Chatbot — Live & Deployed",
            subItems: ["Conversational engagement", "Interactive learning on-demand"],
          },
          {
            text: "Scheduler & Reels Feed — Coming Soon",
            subItems: ["Automated nudges & reminders", "Short-form video learning"],
          },
          {
            text: "AI Assessments & Sales Simulations — May Release",
            subItems: ["Role-based skill scorecards", "Real-world conversation practice"],
          },
        ],
      }),
    },
    {
      id: "e-live-now-section",
      type: "text",
      content: "",
      meta: JSON.stringify({
        eyebrow: "LIVE NOW",
        eyebrowEmoji: "✅",
        title: "Your AI Chatbot is Up and Running",
        body: "The AI Chatbot is live and ready to use across your organisation. It supports rich conversational engagement and interactive learning — giving your teams a smarter, more responsive way to learn, explore, and get answers on the go.",
      }),
    },
    {
      id: "e-live-card",
      type: "live-status",
      content: "",
      meta: JSON.stringify({
        title: "Chatbot Status: Active & Deployed",
        items: [
          "Conversational engagement ✓",
          "Interactive learning ✓",
          "On-demand access ✓",
        ],
      }),
    },
    {
      id: "e-divider-1",
      type: "divider",
      content: "",
    },
    {
      id: "e-coming-next-intro",
      type: "text",
      content: "",
      meta: JSON.stringify({
        eyebrow: "COMING NEXT",
        eyebrowEmoji: "🔜",
        title: "Two Powerful Features in the Pipeline",
        body: "",
      }),
    },
    {
      id: "e-scheduler-card",
      type: "feature-card",
      content: "",
      meta: JSON.stringify({
        icon: "📅",
        iconColor: "teal",
        name: "Scheduler",
        subtitle: "Automated communications & engagement",
        badge: "COMING SOON",
        description: "",
        bullets: [
          { text: "Scheduled learning nudges — automatically push reminders to agents before renewal seasons or product launches", check: "teal" },
          { text: "Course completion reminders — reduce drop-offs with timely, automated follow-ups", check: "teal" },
          { text: "Automated communication sequences — run targeted engagement campaigns without manual effort", check: "teal" },
        ],
      }),
    },
    {
      id: "e-reels-card",
      type: "feature-card",
      content: "",
      meta: JSON.stringify({
        icon: "🎬",
        iconColor: "navy",
        name: "Reels-Style Learning Feed",
        subtitle: "Bite-sized content for modern learners",
        badge: "COMING SOON",
        description: "A short-form content feed — built like Reels or Shorts — so your teams consume knowledge in the format they already love.",
        bullets: [
          { text: "Short video explainers on insurance products, policy terms, and claims processes", check: "navy" },
          { text: "Quick compliance refreshers in a swipeable, engaging format", check: "navy" },
          { text: "Higher engagement rates vs traditional e-learning modules", check: "navy" },
        ],
      }),
    },
    {
      id: "e-divider-2",
      type: "divider",
      content: "",
    },
    {
      id: "e-ai-philosophy",
      type: "strategy-box",
      content: "",
      meta: JSON.stringify({
        eyebrow: "OUR AI PHILOSOPHY",
        eyebrowEmoji: "💡",
        title: "Building AI That Creates Real Value",
        subtitleEmoji: "💬",
        subtitle: "A Word on AI Content Generation",
        body: "AI-generated course content doesn't yet match the quality of human-crafted learning — so we're not going there. Instead, we are channelling our AI investment into assessment, simulation, and personalised skill development: capabilities with clear, measurable impact for your teams.",
      }),
    },
    {
      id: "e-divider-3",
      type: "divider",
      content: "",
    },
    {
      id: "e-may-release-intro",
      type: "text",
      content: "",
      meta: JSON.stringify({
        eyebrow: "PLANNED: MAY RELEASE",
        eyebrowEmoji: "🗓",
        eyebrowPill: true,
        title: "AI Capabilities Built for Insurance Teams",
        body: "Two high-impact AI capabilities launching inside the chatbot — purpose-built for Iffco Tokio's roles and training needs.",
      }),
    },
    {
      id: "e-ai-assessment-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "purple",
        label: "AI POWERED",
        labelEmoji: "🧠",
        title: "AI-Driven Skill Assessments",
        subtitle: "Conversational assessments that generate skill scorecards and evaluation reports — tailored for Iffco Tokio's roles and products.",
        bullets: [
          { title: "Product Knowledge Assessments", text: "evaluate agent understanding of motor, health, travel, home, and crop insurance across your full portfolio", check: "purple" },
          { title: "Underwriting & Risk Awareness", text: "test relationship managers and underwriters on risk evaluation, policy structuring, and exception handling", check: "purple" },
          { title: "Regulatory & Compliance Readiness", text: "assess teams on IRDAI guidelines, disclosure norms, and documentation requirements through conversational scenarios", check: "purple" },
          { title: "Claims Process Proficiency", text: "evaluate claims handlers on policy interpretation, documentation checklists, and TAT-awareness", check: "purple" },
          { title: "Skill Scorecards by Role", text: "generate detailed, downloadable evaluation reports for agents, frontline managers, and HO teams", check: "purple" },
        ],
      }),
    },
    {
      id: "e-ai-simulation-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "navy",
        label: "AI POWERED",
        labelEmoji: "🎯",
        title: "AI-Powered Sales Training Simulations",
        subtitle: "Real-world conversation practice with instant feedback — built for insurance sales and customer-facing roles at Iffco Tokio.",
        bullets: [
          { title: "Motor Insurance Sales Roleplay", text: "simulate a customer comparing quotes, asking about IDV, add-ons (zero depreciation, roadside assistance), and renewal benefits", check: "teal" },
          { title: "Health Insurance Pitch Practice", text: "handle objections around waiting periods, pre-existing conditions, cashless network queries, and premium justification", check: "teal" },
          { title: "Cross-sell & Upsell Conversations", text: "practice recommending bundled covers (home + motor, or health + personal accident) naturally within a conversation", check: "teal" },
          { title: "Claims Conversation Simulations", text: "help teams practice empathetic, clear communication with policyholders filing or tracking claims", check: "teal" },
          { title: "Instant Feedback & Coaching", text: "after each simulation, agents receive a structured debrief: what worked, what to improve, and suggested language", check: "teal" },
        ],
      }),
    },
    {
      id: "e-footer",
      type: "footer",
      content: "",
      meta: JSON.stringify({
        brandName: "skillBetter",
        byline: "by BetterPlace",
        tagline: "Thank you for being part of our journey. We're excited to continue building and growing together.",
        note: "You are receiving this as a valued partner.",
      }),
    },
  ],
};
