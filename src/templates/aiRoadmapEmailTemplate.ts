import type { EmailState } from "@/types/email";

export const aiRoadmapTemplate: EmailState = {
  subject: "AI Capabilities Roadmap – Iffco Tokio",

  recipients: "",

  template: "ai-roadmap",

  blocks: [
    {
      id: "hero",
      type: "hero",
      content: `
🚀 Product Roadmap Update

What's Live, What's Coming Next — and Why It Matters

Dear Iffco Tokio Team,

We are excited to share a candid update on our AI capabilities — what is live and working today, what is on the near horizon.
`,
    },

    {
      id: "live-now",
      type: "text",
      content: `
✅ Live Now

Your AI Chatbot is Up and Running

We are pleased to confirm that the AI Chatbot is live across your organisation.
`,
    },

    {
      id: "coming-next",
      type: "features",
      content: `
🔜 Coming Next

Scheduler – Automated communication campaigns

Reels-style learning feed – Bite-sized training
`,
    },

    {
      id: "ai-assessment",
      type: "features",
      content: `
🧠 AI Driven Skill Assessments

Product knowledge assessments  
Underwriting & risk awareness  
Compliance readiness  
Claims proficiency
`,
    },

    {
      id: "ai-simulation",
      type: "features",
      content: `
🎯 AI Sales Training Simulations

Motor insurance roleplay  
Health insurance objection handling  
Cross-sell conversations  
Claims communication
`,
    },
  ],
};
