export interface PricingTier {
  name: string; price: string; billingNote: string; keyFeatures: string[];
}
export interface CompetitorSnapshot {
  id: string; name: string; url: string; scrapedAt: string;
  extractionConfidence: 'high' | 'medium' | 'low' | 'failed';
  fields: {
    heroCopy: string | null; primaryCTA: string | null;
    pricingTiers: PricingTier[]; keyFeatureClaims: string[]; targetAudience: string | null;
  };
}

export const baselines: CompetitorSnapshot[] = [
  {
    id: 'linear', name: 'Linear', url: 'https://linear.app/pricing',
    scrapedAt: '2026-06-23T09:00:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The project management tool built for high-performance teams.',
      primaryCTA: 'Get started',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Free for everyone', keyFeatures: ['Unlimited members', '2 teams', '250 issues'] },
        { name: 'Basic', price: '$10', billingNote: 'per user/month, billed yearly', keyFeatures: ['All Free features', '5 teams', 'Unlimited issues', 'Unlimited file uploads', 'Admin roles'] },
        { name: 'Business', price: '$16', billingNote: 'per user/month, billed yearly', keyFeatures: ['All Basic features', 'Unlimited teams', 'Private teams and guests', 'Linear Insights', 'Linear Asks'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Annual billing only', keyFeatures: ['All Business features', 'SAML and SCIM', 'Priority support'] },
      ],
      keyFeatureClaims: ['Built for high-performance software teams', 'Keyboard-first design', 'GitHub and GitLab integrations', 'Cycles and sprint planning'],
      targetAudience: 'Software development teams',
    },
  },
  {
    id: 'shortcut', name: 'Shortcut', url: 'https://www.shortcut.com/pricing',
    scrapedAt: '2026-06-23T09:05:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The project management platform built for software teams that want to move fast.',
      primaryCTA: 'Start free trial',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Up to 10 users', keyFeatures: ['Unlimited Stories', '10 users max', 'Core workflow features'] },
        { name: 'Team', price: '$9', billingNote: 'per user/month, billed monthly', keyFeatures: ['Unlimited users', 'Advanced reporting', 'Roadmap view', 'Custom workflows'] },
        { name: 'Business', price: '$16', billingNote: 'per user/month', keyFeatures: ['Everything in Team', 'SSO', 'Advanced analytics', 'Priority support'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['Everything in Business', 'Dedicated CSM', 'Custom SLAs'] },
      ],
      keyFeatureClaims: ['Stories, Epics, and Objectives framework', 'GitHub and GitLab integration', 'Velocity and cycle time reporting', 'Kanban and sprint workflows'],
      targetAudience: 'Agile software development teams',
    },
  },
  {
    id: 'monday', name: 'Monday.com', url: 'https://monday.com/pricing',
    scrapedAt: '2026-06-23T09:08:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The Work OS that lets you run projects, workflows and everyday work.',
      primaryCTA: 'Get started',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Up to 2 seats', keyFeatures: ['Up to 3 boards', 'Unlimited docs', '200+ templates'] },
        { name: 'Basic', price: '$9', billingNote: 'per seat/month, billed annually', keyFeatures: ['Unlimited free viewers', 'Unlimited items', '5GB storage'] },
        { name: 'Standard', price: '$12', billingNote: 'per seat/month, billed annually', keyFeatures: ['Timeline and Gantt views', 'Guest access', 'Automations'] },
        { name: 'Pro', price: '$19', billingNote: 'per seat/month, billed annually', keyFeatures: ['Private boards', 'Chart view', 'Time tracking', 'Formula column'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['Enterprise-scale automations', 'Advanced security', 'Tailored onboarding'] },
      ],
      keyFeatureClaims: ['Work OS for any team', 'No-code automation builder', '200+ integrations', 'Custom workflows for any use case'],
      targetAudience: 'Teams of all sizes across any industry',
    },
  },
  {
    id: 'notion', name: 'Notion', url: 'https://www.notion.so/pricing',
    scrapedAt: '2026-06-23T09:12:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'Write, plan, share. With AI at your side.',
      primaryCTA: 'Get Notion free',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Forever free', keyFeatures: ['Unlimited pages', 'Unlimited blocks', 'Basic AI features', '7-day page history'] },
        { name: 'Plus', price: '$10', billingNote: 'per user/month, billed annually', keyFeatures: ['Unlimited AI responses', '30-day page history', 'Custom websites', 'Unlimited file uploads'] },
        { name: 'Business', price: '$15', billingNote: 'per user/month, billed annually', keyFeatures: ['SAML SSO', '90-day page history', 'Private teamspaces', 'Advanced analytics'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['User provisioning', 'Advanced security', 'Dedicated customer success'] },
      ],
      keyFeatureClaims: ['All-in-one workspace', 'AI writing and editing built in', 'Connected docs, wikis, and projects', 'Works for teams of any size'],
      targetAudience: 'Individuals and teams who want one tool for everything',
    },
  },
  {
    id: 'height', name: 'Height', url: 'https://height.app/pricing',
    scrapedAt: '2026-06-23T09:10:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The autonomous project collaboration tool.',
      primaryCTA: 'Get started free',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Forever', keyFeatures: ['Unlimited tasks', '5 members', 'Basic AI'] },
        { name: 'Team', price: '$8.50', billingNote: 'per user/month', keyFeatures: ['Unlimited members', 'Advanced AI', 'Priority support'] },
      ],
      keyFeatureClaims: ['Autonomous AI task management', 'Real-time collaboration', 'GitHub integration'],
      targetAudience: 'Software teams',
    },
  },
];

export const liveSnapshots: CompetitorSnapshot[] = [
  {
    id: 'linear', name: 'Linear', url: 'https://linear.app/pricing',
    scrapedAt: '2026-06-30T09:00:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The project management tool built for high-performance teams.',
      primaryCTA: 'Get started',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Free for everyone', keyFeatures: ['Unlimited members', '2 teams', '250 issues', 'Agent platform', 'Linear Agent'] },
        { name: 'Basic', price: '$10', billingNote: 'per user/month, billed yearly', keyFeatures: ['All Free features', '5 teams', 'Unlimited issues', 'Unlimited file uploads', 'Admin roles'] },
        { name: 'Business', price: '$16', billingNote: 'per user/month, billed yearly', keyFeatures: ['All Basic features', 'Unlimited teams', 'Private teams and guests', 'Triage Intelligence', 'Linear Agent automations (beta)', 'Code Intelligence (beta)', 'Linear Insights', 'Linear Asks'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Annual billing only', keyFeatures: ['All Business features', 'SAML and SCIM', 'Priority support'] },
      ],
      keyFeatureClaims: ['Built for high-performance software teams', 'Keyboard-first design', 'GitHub and GitLab integrations', 'Cycles and sprint planning', 'AI Agent platform now available on all plans', 'Code Intelligence and Triage Intelligence in beta'],
      targetAudience: 'Software development teams',
    },
  },
  {
    id: 'shortcut', name: 'Shortcut', url: 'https://www.shortcut.com/pricing',
    scrapedAt: '2026-06-30T09:05:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The project management platform built for software teams that want to move fast.',
      primaryCTA: 'Start free trial',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Up to 10 users', keyFeatures: ['Unlimited Stories', '10 users max', 'Core workflow features'] },
        { name: 'Team', price: '$10', billingNote: 'per user/month, billed monthly ($8.50 annual)', keyFeatures: ['Unlimited users', 'Advanced reporting', 'Roadmap view', 'Custom workflows', 'Korey AI agent for story creation'] },
        { name: 'Business', price: '$16', billingNote: 'per user/month', keyFeatures: ['Everything in Team', 'SSO', 'Advanced analytics', 'Priority support'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['Everything in Business', 'Dedicated CSM', 'Custom SLAs'] },
      ],
      keyFeatureClaims: ['Stories, Epics, and Objectives framework', 'GitHub and GitLab integration', 'Velocity and cycle time reporting', 'Kanban and sprint workflows', 'Korey: AI agent that writes and breaks down Stories'],
      targetAudience: 'Agile software development teams',
    },
  },
  {
    id: 'monday', name: 'Monday.com', url: 'https://monday.com/pricing',
    scrapedAt: '2026-06-30T09:08:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'The AI-powered platform built to help any team run their best work.',
      primaryCTA: 'Get started free',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Up to 2 seats', keyFeatures: ['Up to 3 boards', 'Unlimited docs', '200+ templates'] },
        { name: 'Basic', price: '$9', billingNote: 'per seat/month, billed annually', keyFeatures: ['Unlimited free viewers', 'Unlimited items', '5GB storage'] },
        { name: 'Standard', price: '$12', billingNote: 'per seat/month, billed annually', keyFeatures: ['Timeline and Gantt views', 'Guest access', 'Automations', 'AI assistant (250 actions/month)'] },
        { name: 'Pro', price: '$19', billingNote: 'per seat/month, billed annually', keyFeatures: ['Private boards', 'Chart view', 'Time tracking', 'Formula column', 'AI assistant (500 actions/month)'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['Enterprise-scale automations', 'Advanced security', 'Tailored onboarding', 'Unlimited AI actions'] },
      ],
      keyFeatureClaims: ['AI-powered platform for any team', 'AI assistant built into every plan', 'No-code automation builder', '200+ integrations'],
      targetAudience: 'Teams of all sizes looking to work smarter with AI',
    },
  },
  {
    id: 'notion', name: 'Notion', url: 'https://www.notion.so/pricing',
    scrapedAt: '2026-06-30T09:12:00Z', extractionConfidence: 'high',
    fields: {
      heroCopy: 'Write, plan, share. With AI at your side.',
      primaryCTA: 'Start with AI',
      pricingTiers: [
        { name: 'Free', price: '$0', billingNote: 'Forever free', keyFeatures: ['Unlimited pages', 'Unlimited blocks', 'Basic AI features', '7-day page history'] },
        { name: 'Plus', price: '$10', billingNote: 'per user/month, billed annually', keyFeatures: ['Unlimited AI responses', '30-day page history', 'Custom websites', 'Unlimited file uploads'] },
        { name: 'Business', price: '$15', billingNote: 'per user/month, billed annually', keyFeatures: ['SAML SSO', '90-day page history', 'Private teamspaces', 'Advanced analytics'] },
        { name: 'Enterprise', price: 'Custom', billingNote: 'Contact sales', keyFeatures: ['User provisioning', 'Advanced security', 'Dedicated customer success'] },
      ],
      keyFeatureClaims: ['AI-first workspace for modern teams', 'AI writing, editing, and planning built in', 'Connected docs, wikis, and projects', 'Works for teams of any size'],
      targetAudience: 'Individuals and teams who want AI built into every workflow',
    },
  },
  {
    id: 'height', name: 'Height', url: 'https://height.app/pricing',
    scrapedAt: '2026-06-30T09:10:00Z', extractionConfidence: 'failed',
    fields: { heroCopy: null, primaryCTA: null, pricingTiers: [], keyFeatureClaims: [], targetAudience: null },
  },
];
