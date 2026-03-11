export interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  status: "planned" | "in_progress" | "completed";
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high" | "critical";
  dueDate?: string;
}

export interface AiRoadmapData {
  projectName: string;
  vision: string;
  phases: RoadmapPhase[];
  resources: Resource[];
  risks: Risk[];
  metrics: Metric[];
}

export interface Resource {
  id: string;
  name: string;
  type: "human" | "technical" | "financial" | "data";
  allocation: string;
  status: "available" | "needed" | "allocated";
}

export interface Risk {
  id: string;
  description: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "critical";
  mitigation: string;
}

export interface Metric {
  id: string;
  name: string;
  target: string;
  current?: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
}

export const defaultAiRoadmap: AiRoadmapData = {
  projectName: "AI Initiative",
  vision: "Leverage artificial intelligence to drive business value and competitive advantage",
  phases: [
    {
      id: "phase-1",
      name: "Foundation",
      description: "Establish data infrastructure and team capabilities",
      timeframe: "Months 1-3",
      status: "planned",
      milestones: [
        {
          id: "m1",
          title: "Data Audit",
          description: "Complete assessment of existing data assets and quality",
          completed: false,
          priority: "critical",
        },
        {
          id: "m2",
          title: "Team Formation",
          description: "Hire or train core AI/ML team members",
          completed: false,
          priority: "high",
        },
      ],
    },
    {
      id: "phase-2",
      name: "Pilot Projects",
      description: "Deploy initial AI use cases with measurable ROI",
      timeframe: "Months 4-6",
      status: "planned",
      milestones: [
        {
          id: "m3",
          title: "First Model Deployment",
          description: "Launch production ML model for single use case",
          completed: false,
          priority: "high",
        },
      ],
    },
    {
      id: "phase-3",
      name: "Scale",
      description: "Expand AI capabilities across the organization",
      timeframe: "Months 7-12",
      status: "planned",
      milestones: [
        {
          id: "m4",
          title: "Platform Architecture",
          description: "Build reusable ML platform and pipelines",
          completed: false,
          priority: "medium",
        },
      ],
    },
  ],
  resources: [
    {
      id: "r1",
      name: "Data Engineers",
      type: "human",
      allocation: "2-3 FTEs",
      status: "needed",
    },
    {
      id: "r2",
      name: "ML Platform",
      type: "technical",
      allocation: "Cloud infrastructure",
      status: "needed",
    },
  ],
  risks: [
    {
      id: "risk-1",
      description: "Data quality issues delay model training",
      probability: "medium",
      impact: "high",
      mitigation: "Implement data validation pipeline early",
    },
    {
      id: "risk-2",
      description: "Regulatory compliance for AI models",
      probability: "medium",
      impact: "critical",
      mitigation: "Engage legal team and establish AI governance",
    },
  ],
  metrics: [
    {
      id: "metric-1",
      name: "Model Accuracy",
      target: "> 85%",
      frequency: "weekly",
    },
    {
      id: "metric-2",
      name: "Time to Production",
      target: "< 4 weeks",
      frequency: "monthly",
    },
    {
      id: "metric-3",
      name: "Business ROI",
      target: "300%",
      frequency: "quarterly",
    },
  ],
};

export function calculatePhaseProgress(phase: RoadmapPhase): number {
  if (phase.milestones.length === 0) return 0;
  const completed = phase.milestones.filter((m) => m.completed).length;
  return Math.round((completed / phase.milestones.length) * 100);
}

export function calculateOverallProgress(phases: RoadmapPhase[]): number {
  if (phases.length === 0) return 0;
  const totalProgress = phases.reduce((sum, phase) => {
    return sum + calculatePhaseProgress(phase);
  }, 0);
  return Math.round(totalProgress / phases.length);
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
  };
  return colors[priority] || colors.low;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planned: "bg-slate-100 text-slate-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };
  return colors[status] || colors.planned;
}
