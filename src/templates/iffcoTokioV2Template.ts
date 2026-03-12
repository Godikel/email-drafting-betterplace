import type { EmailState } from "@/types/email";

/**
 * V2 of the Iffco Tokio AI Roadmap template.
 * Updated content per client brief — same block structure as the editable template.
 */
export const iffcoTokioV2Template: EmailState = {
  subject: "🚀 AI Product Roadmap – Your AI Journey on BetterPlace LMS",
  recipients: "",
  template: "ai-roadmap-v2",
  blocks: [
    {
      id: "v2-topbar",
      type: "topbar",
      content: "skillBetter × IFFCO-TOKIO",
      meta: JSON.stringify({
        brandName: "skillBetter",
        byline: "by BetterPlace",
        partnerName: "IFFCO-TOKIO",
        partnerSub: "Muskurate Raho",
        label: "AI Product Roadmap",
      }),
    },
    {
      id: "v2-hero",
      type: "hero",
      content: "",
      meta: JSON.stringify({
        pill: "AI PRODUCT ROADMAP",
        pillEmoji: "🚀",
        title: "Your AI Journey on",
        titleHighlight: "BetterPlace LMS",
        body: "Dear IFFCO Tokio Team,\n\nWe're excited to share the next phase of AI innovation for IFFCO Tokio:",
        pointers: [
          {
            text: "AI Chatbot",
            subItems: [],
          },
          {
            text: "Reels-like Feeds & Automated Communications",
            subItems: [],
          },
          {
            text: "Our AI Roadmap — Sales Simulations and Skill Assessments",
            subItems: [],
          },
        ],
      }),
    },
    {
      id: "v2-hero-closing",
      type: "text",
      content: "",
      meta: JSON.stringify({
        eyebrow: "",
        eyebrowEmoji: "",
        title: "",
        body: "Looking forward to your thoughts as we continue building this journey together! 😇",
      }),
    },
    {
      id: "v2-divider-0",
      type: "divider",
      content: "",
    },
    {
      id: "v2-live-now-section",
      type: "text",
      content: "",
      meta: JSON.stringify({
        eyebrow: "LIVE NOW",
        eyebrowEmoji: "✅",
        title: "Your AI Chatbot is Up and Running",
        body: "The AI Chatbot is now live across your organisation — enabling interactive learning and quick, conversational access to answers on the go. 🚀",
      }),
    },
    {
      id: "v2-live-card",
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
      id: "v2-divider-1",
      type: "divider",
      content: "",
    },
    {
      id: "v2-coming-next-intro",
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
      id: "v2-scheduler-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "teal",
        label: "COMING SOON",
        labelEmoji: "📅",
        title: "Scheduler",
        subtitle: "Automated communications & engagement",
        bullets: [
          { title: "Scheduled learning nudges", text: "timely reminders to agents before renewals, product launches, or compliance deadlines", check: "teal" },
          { title: "Recurring module distribution", text: "auto-assign courses, assessments & surveys at set intervals (weekly/monthly/quarterly)", check: "teal" },
          { title: "Completion reminders", text: "automated follow-ups to reduce drop-offs", check: "teal" },
          { title: "Configurable controls", text: "admins set frequency, start time & number of occurrences", check: "teal" },
          { title: "Example", text: "IRDAI compliance modules auto-assigned every quarter to all frontline agents", check: "teal" },
        ],
      }),
    },
    {
      id: "v2-reels-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "navy",
        label: "COMING SOON",
        labelEmoji: "🎞️",
        title: "Reels-Style Learning Feed",
        subtitle: "Bite-sized content for modern learners",
        bullets: [
          { title: "Short video explainers", text: "quick clips on insurance products, policy terms & claims processes", check: "navy" },
          { title: "AI generation", text: "generate voice overs, images, videos or entire micro-learning content with a simple prompt", check: "navy" },
          { title: "Higher engagement", text: "drives better retention vs traditional e-learning modules", check: "navy" },
          { title: "Policy refreshers", text: "swipeable, engaging format agents actually enjoy", check: "navy" },
          { title: "Example", text: "An agent swipes through a 60-second reel on zero depreciation add-ons, followed by a quick card explaining cashless vs reimbursement claims — all during a lunch break", check: "navy" },
        ],
      }),
    },
    {
      id: "v2-divider-2",
      type: "divider",
      content: "",
    },
    {
      id: "v2-may-release-intro",
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
      id: "v2-ai-assessment-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "purple",
        label: "AI POWERED",
        labelEmoji: "🧠",
        title: "AI-Driven Skill Assessments",
        subtitle: "Conversational assessments tailored for you",
        bullets: [
          { title: "Conversational assessments", text: "evaluate agents through interactive scenarios, not static quizzes", check: "purple" },
          { title: "Structured skill scorecards", text: "auto-generate evaluation reports for each learner", check: "purple" },
          { title: "Role-specific evaluations", text: "covers product knowledge, compliance, underwriting & claims handling", check: "purple" },
          { title: "Standardised scoring", text: "pass/fail thresholds and competency mapping built into the LMS engine", check: "purple" },
          { title: "Example", text: "frontline agent completes a conversational assessment simulating a crop insurance query — receiving a scorecard flagging gaps in policy coverage knowledge and IRDAI disclosure norms", check: "purple" },
        ],
      }),
    },
    {
      id: "v2-ai-simulation-card",
      type: "ai-card",
      content: "",
      meta: JSON.stringify({
        variant: "navy",
        label: "AI POWERED",
        labelEmoji: "🎯",
        title: "AI-Powered Sales Simulations",
        subtitle: "Real-world conversation practice",
        bullets: [
          { title: "Interactive roleplay simulations", text: "practice real customer conversations before stepping into the field", check: "teal" },
          { title: "Scenario-based practice", text: "covers product explanation, handling objections, cross-selling & claims communication", check: "teal" },
          { title: "Instant AI feedback & coaching", text: "highlights strengths and improvement areas after each simulation", check: "teal" },
          { title: "Builds real-world confidence", text: "agents walk into customer conversations prepared, not unprepared", check: "teal" },
          { title: "Example", text: "A motor insurance agent practices handling a customer comparing quotes and asking about IDV & add-ons. A health insurance agent rehearses objection handling around waiting periods and cashless network queries", check: "teal" },
        ],
      }),
    },
    {
      id: "v2-footer",
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
