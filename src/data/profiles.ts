import type { CompetitorProfilePage } from '../lib/claudeAnalysis';

export const hardcodedProfiles: Record<string, CompetitorProfilePage> = {
  linear: {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'Dev-native PM tool', detail: 'Linear is purpose-built for software teams — every feature is designed around engineering workflows, not adapted from generic project management.' },
        { lead: 'AI agent platform launch', detail: 'Linear recently shipped "Linear Agent" across all plans, embedding AI directly into issue triage, sprint planning, and code review workflows.' },
        { lead: '$35/user/month ceiling', detail: 'Pricing tops out at $16/user/month (Business), making it accessible for high-headcount engineering orgs but still premium vs. Jira.' },
        { lead: 'Rapid enterprise push', detail: 'SAML, SCIM, and priority support are locked to Enterprise (custom pricing), signalling an upmarket motion targeting 200+ seat engineering orgs.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: 'NorthLane Digital vs Linear',
      points: [
        { lead: 'Tool vs. strategy layer', detail: 'Linear manages developer tasks. NorthLane manages marketing pipeline — we sit above the tooling layer and connect execution to revenue outcomes.' },
        { lead: 'SaaS-specific GTM', detail: 'Linear is a product for SaaS companies; NorthLane is a partner that runs marketing for them. We understand their growth model, their ICP, and their sales cycle from the inside.' },
        { lead: 'Pipeline accountability', detail: 'Linear tracks velocity. NorthLane ties marketing contracts to pipeline numbers — our client agreements are outcome-based, not activity-based.' },
        { lead: 'Complementary, not competing', detail: 'Many NorthLane clients use Linear internally. We often recommend it. The risk is Linear expanding into marketing or ops use cases, which is not their current motion.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: 'When we beat Linear',
      points: [
        { lead: 'CMO is the buyer', detail: 'When the decision-maker is a CMO or Head of Marketing rather than a VP Eng, NorthLane wins — Linear has no GTM story for marketing leaders.' },
        { lead: 'Pipeline gap is the pain', detail: 'When the client\'s problem is "we\'re not generating enough qualified pipeline," Linear\'s sprint tooling is irrelevant. NorthLane directly solves that.' },
        { lead: 'MarTech stack is broken', detail: 'When HubSpot, Marketo, or 6sense isn\'t working and the team doesn\'t have the expertise to fix it, NorthLane\'s implementation depth wins immediately.' },
        { lead: 'Senior team matters', detail: 'When a past agency experience involved juniors doing the work, NorthLane\'s senior-only delivery model is an instant differentiator in the sales conversation.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Brand prestige in dev', detail: 'Linear has cult status among engineers and technical founders — it\'s aspirational tooling that top-tier startups default to.' },
        { lead: 'Keyboard-first UX', detail: 'The keyboard-driven interface and speed are consistently praised; power users find it significantly faster than Jira or Shortcut.' },
        { lead: 'AI shipped, not promised', detail: 'Linear Agent and Code Intelligence are live features, not roadmap slides — this gives them credibility in AI-native product positioning.' },
        { lead: 'Clean pricing structure', detail: 'Three clear tiers with transparent per-user pricing makes procurement simple for finance and ops teams at growth-stage SaaS.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Engineering-only ICP', detail: 'Linear has no meaningful story for marketing, sales, or ops teams — limiting seat expansion and cross-departmental stickiness within clients.' },
        { lead: 'No CRM or pipeline view', detail: 'There is no revenue, deal, or pipeline visibility — clients needing a unified view of engineering + GTM execution can\'t get it in Linear.' },
        { lead: 'Weak reporting depth', detail: 'Compared to Jira or Monday.com, Linear\'s analytics and custom reporting capabilities are limited for large enterprises with complex compliance needs.' },
        { lead: 'Small company risk', detail: 'Linear remains a private company without disclosed profitability — enterprise buyers increasingly flag this in security and vendor risk reviews.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: 'Our positioning when Linear comes up in conversation',
      points: [
        { lead: 'We\'re not in the same category', detail: 'Tell clients: "Linear is a great tool for your eng team — we\'re the partner that makes your marketing engine work. Those aren\'t competing decisions."' },
        { lead: 'Anchor on outcomes, not tasks', detail: 'Linear tracks what got done. NorthLane answers: "Did it move pipeline?" Position yourself as the accountability layer above the tooling.' },
        { lead: 'Use their AI story against stagnation', detail: 'If a prospect is excited about Linear Agent, point out their marketing stack almost certainly has no equivalent AI layer — and NorthLane builds that.' },
        { lead: 'SaaS-only is the wedge', detail: '"We only work with B2B SaaS. That means we understand your comp model, your sales cycle, and your ICP without a discovery ramp." Generic agencies can\'t say that.' },
      ],
    },
  },

  shortcut: {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'Jira alternative for agile teams', detail: 'Shortcut targets software teams who find Jira too heavy — positioning itself as faster, cleaner, and better suited to modern agile workflows.' },
        { lead: 'Korey AI agent launched', detail: 'Shortcut recently launched "Korey," an AI agent that writes and breaks down Stories from natural language input — their first major AI product investment.' },
        { lead: 'Competitive pricing pressure', detail: 'Team tier rose from $9 to $10/user/month — a minor but signal-worthy move given their value prop is being more affordable than Jira.' },
        { lead: 'Stories-Epics-Objectives framework', detail: 'Their proprietary three-layer hierarchy (Stories → Epics → Objectives) is a core differentiator vs. competitors with less structured workflow models.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: 'NorthLane Digital vs Shortcut',
      points: [
        { lead: 'Dev workflow vs. growth engine', detail: 'Shortcut manages software delivery. NorthLane manages B2B demand generation. We operate in entirely different functional layers of a SaaS company.' },
        { lead: 'Shared SaaS focus', detail: 'Both companies specifically target SaaS teams, which means Shortcut customers are exactly NorthLane\'s ICP — a strong referral and partnership angle.' },
        { lead: 'Activity vs. pipeline', detail: 'Shortcut measures story points and velocity. NorthLane measures MQLs, pipeline coverage, and sourced ARR. Different definitions of "done."' },
        { lead: 'No channel conflict', detail: 'NorthLane often sits alongside Shortcut in the client\'s tool stack — we\'ve never lost a deal because a client used Shortcut for engineering.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: 'When we beat Shortcut',
      points: [
        { lead: 'Marketing is the bottleneck', detail: 'When the SaaS company\'s constraint is demand generation — not sprint delivery — NorthLane is the right hire. Shortcut doesn\'t solve marketing problems.' },
        { lead: 'GTM infrastructure is broken', detail: 'When HubSpot scoring is off, attribution is missing, or the SDR-to-marketing handoff is broken, NorthLane\'s MarTech depth wins over any PM tool.' },
        { lead: 'Board-level pipeline pressure', detail: 'When a CMO is under ARR pressure from the board, "we need better sprint tooling" is not the answer. NorthLane frames itself as the pipeline solution.' },
        { lead: 'Post-Series A maturity gap', detail: 'Series A–B SaaS companies often have engineering infrastructure but no real marketing infrastructure. That\'s NorthLane\'s sweet spot, not Shortcut\'s.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Clean, opinionated UX', detail: 'Shortcut\'s interface is consistently rated as cleaner and easier to adopt than Jira — reducing onboarding friction for fast-moving teams.' },
        { lead: 'Korey AI differentiator', detail: 'Korey\'s ability to generate and decompose Stories from plain English is a genuinely useful workflow shortcut for small engineering teams without PMs.' },
        { lead: 'Agile-native structure', detail: 'The Stories/Epics/Objectives hierarchy maps directly to modern agile and OKR frameworks — easier for teams to adopt without methodology retraining.' },
        { lead: 'Strong GitHub/GitLab sync', detail: 'Deep integration with code review and PR workflows means engineers can stay in their dev tools while keeping Shortcut updated automatically.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Narrow buyer persona', detail: 'Shortcut\'s ICP is almost exclusively engineering teams — no expansion motion into marketing, ops, or executive layers limits their ACV and retention risk.' },
        { lead: 'Brand awareness deficit', detail: 'Shortcut lacks the brand recognition of Linear or Jira in enterprise buying cycles — harder to get on shortlists without a champion inside the company.' },
        { lead: 'Limited analytics depth', detail: 'Reporting capabilities lag behind Jira and Monday.com for orgs that need custom dashboards, compliance reporting, or cross-team analytics.' },
        { lead: 'Price increase perception risk', detail: 'The Team tier price increase to $10/user risks churn from cost-sensitive startups who adopted Shortcut specifically for affordable Jira alternatives.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: 'Our positioning when Shortcut comes up in conversation',
      points: [
        { lead: 'Acknowledge then redirect', detail: '"Shortcut is a solid choice for your eng team. The bigger question is: what\'s running your marketing engine?" Reframe the conversation to the unsolved problem.' },
        { lead: 'Same ICP, different layer', detail: 'Point out that Shortcut and NorthLane serve the same SaaS company — but NorthLane is the partner that makes the product\'s growth work, not just its delivery.' },
        { lead: 'Korey vs. NorthLane\'s AI layer', detail: 'Korey automates story-writing. NorthLane uses AI to surface competitor intelligence, score leads, and optimise campaign spend. Completely different value layers.' },
        { lead: 'Outcome-based vs. activity-based', detail: '"Our contracts are tied to pipeline numbers, not retainer hours. Shortcut tracks story points — we track whether your marketing makes money."' },
      ],
    },
  },

  monday: {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'AI rebrand across the platform', detail: 'Monday.com has repositioned from "Work OS" to "AI-powered platform" — AI assistant features are now bundled into Standard tier and above, signalling a platform-wide AI push.' },
        { lead: 'Broad horizontal ICP', detail: 'Monday.com targets teams of all sizes across any industry — a deliberate generalist play that prioritises seat volume over vertical depth.' },
        { lead: 'Five-tier pricing complexity', detail: 'Monday.com has five pricing tiers (Free → Basic → Standard → Pro → Enterprise) — more complex than most competitors, designed to capture value at every company size.' },
        { lead: 'CRM and marketing expansion', detail: 'Monday CRM and Monday Marketing are separate paid products built on the same Work OS — active expansion into CRM territory that directly overlaps with NorthLane\'s client stack.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: 'NorthLane Digital vs Monday.com',
      points: [
        { lead: 'Generalist vs. specialist', detail: 'Monday.com\'s strength is flexibility for any team. NorthLane\'s strength is B2B SaaS marketing depth — we know the playbooks, the tools, and the metrics that Monday.com doesn\'t.' },
        { lead: 'Monday CRM is the overlap', detail: 'Monday CRM is the product most likely to compete for budget with NorthLane\'s MarTech consulting work — clients may try to self-serve on Monday CRM instead of hiring NorthLane.' },
        { lead: 'Tool enablement vs. strategy', detail: 'NorthLane can implement Monday.com as part of a MarTech stack. That\'s a service Monday.com can\'t offer — we can be additive, not just competitive.' },
        { lead: 'Pipeline accountability gap', detail: 'Monday.com tracks activity and workflows. It doesn\'t tie marketing execution to sourced ARR. NorthLane\'s contracts do — that\'s a fundamentally different value proposition.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: 'When we beat Monday.com',
      points: [
        { lead: 'Monday CRM failed or stalled', detail: 'Many SaaS companies try Monday CRM and find it too generic for their sales process. NorthLane wins when that fails and they need a proper HubSpot or Salesforce implementation.' },
        { lead: 'SaaS-specific demand gen needed', detail: 'When the need is B2B SaaS pipeline generation — ABM, content strategy, paid acquisition — Monday.com has no offering. NorthLane does.' },
        { lead: 'CMO is under ARR pressure', detail: 'Monday.com is bought by ops or project teams. When the CMO is the buyer and pipeline is the problem, Monday.com isn\'t in the conversation.' },
        { lead: 'Agency experience > tool investment', detail: 'When a prospect has already spent on Monday.com but still lacks pipeline, NorthLane wins by offering what a tool never could — strategic execution with senior expertise.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Brand recognition and scale', detail: 'Monday.com is one of the most recognised work management brands globally — easy to get on shortlists and trusted by procurement teams with no SaaS-specific knowledge.' },
        { lead: 'AI across all paid tiers', detail: 'By bundling AI assistant into Standard and above, Monday.com gives SMBs access to AI workflows without premium pricing — a strong competitive move against Notion and Asana.' },
        { lead: 'Platform breadth', detail: 'Work OS, CRM, Marketing, Dev, and Service products on one platform create cross-sell opportunities and reduce churn through multi-product stickiness.' },
        { lead: 'No-code automation', detail: 'Monday.com\'s automation builder is one of the most accessible on the market — non-technical teams can build complex workflows without engineering support.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Jack of all trades positioning', detail: 'Claiming to work for "any team in any industry" makes Monday.com easy to dismiss for buyers who want a specialist — including NorthLane\'s SaaS CMO ICP.' },
        { lead: 'Monday CRM is thin', detail: 'Monday CRM lacks the depth of HubSpot or Salesforce for complex B2B sales cycles — it works for simple pipelines but fails for multi-touch enterprise deals.' },
        { lead: 'Pricing complexity creates confusion', detail: 'Five tiers with per-seat pricing, annual billing requirements, and add-on products create procurement friction and price-anchoring challenges in enterprise sales.' },
        { lead: 'AI features are shallow', detail: 'Monday\'s AI assistant (250–500 actions/month at lower tiers) is quota-gated and general-purpose — not domain-specific enough to compete with purpose-built AI tools.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: 'Our positioning when Monday.com comes up in conversation',
      points: [
        { lead: 'Specialisation beats flexibility', detail: '"Monday.com can run any workflow for any team. We run B2B SaaS demand generation specifically — and that specialisation means no onboarding ramp and no generic playbooks."' },
        { lead: 'CRM failure is our opening', detail: 'If a prospect tried Monday CRM and it didn\'t stick, use that: "Monday\'s CRM works for simple pipelines. If you need a proper HubSpot implementation tied to pipeline, that\'s us."' },
        { lead: 'Outcomes over workflows', detail: '"Monday.com builds workflows. NorthLane builds pipeline. We\'re not in the same category — we\'re the reason your Monday.com dashboards show green."' },
        { lead: 'Senior delivery is the moat', detail: '"Every Monday.com workflow still needs someone to run the marketing strategy behind it. That\'s us — and we only put senior people on accounts, not coordinators."' },
      ],
    },
  },

  notion: {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'AI-first workspace repositioning', detail: 'Notion has shifted its hero copy from "write, plan, share" to explicitly leading with AI — changing its primary CTA from "Get Notion free" to "Start with AI," signalling a full platform pivot.' },
        { lead: 'AI on all plans including free', detail: 'Basic AI features are available on the free tier, with unlimited AI responses unlocked at Plus ($10/user/month) — one of the most aggressive AI access models in the market.' },
        { lead: 'Docs-wiki-projects convergence', detail: 'Notion continues to expand from a docs tool into a full workspace covering wikis, databases, project management, and now AI-powered planning — competing with Linear, Shortcut, and Confluence simultaneously.' },
        { lead: 'Custom websites as a surprise feature', detail: 'Notion Plus now includes custom websites built directly from pages — an unexpected expansion into publishing and web presence tooling.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: 'NorthLane Digital vs Notion',
      points: [
        { lead: 'Internal tooling vs. external pipeline', detail: 'Notion is where SaaS teams write their strategy. NorthLane is the team that executes it and measures whether it generates pipeline. Adjacent roles, not competing ones.' },
        { lead: 'NorthLane often works inside Notion', detail: 'Many NorthLane clients use Notion as their company wiki and project tracker. We frequently deliver client-facing docs, playbooks, and reports in Notion.' },
        { lead: 'AI in Notion vs. AI in NorthLane\'s stack', detail: 'Notion\'s AI is generative text and editing. NorthLane uses AI for competitive intelligence, lead scoring, and campaign optimisation — different use cases, different value.' },
        { lead: 'Content strategy overlap is real', detail: 'Notion\'s AI writing features could displace some content brief and copywriting work. NorthLane needs to position its content strategy as strategic and audience-specific, not just generative.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: 'When we beat Notion',
      points: [
        { lead: 'Pipeline is the problem, not documentation', detail: 'When the CMO\'s mandate is ARR growth, Notion\'s docs and wikis aren\'t the solution. NorthLane is hired when the problem is demand generation, not knowledge management.' },
        { lead: 'Execution gap after strategy is written', detail: 'Notion is great for writing the GTM strategy. NorthLane executes it — handling paid, content, MarTech, and ABM that a wiki tool never touches.' },
        { lead: 'MarTech implementation need', detail: 'No amount of Notion AI replaces a proper HubSpot implementation, sales attribution model, or 6sense configuration. When the stack is broken, NorthLane wins.' },
        { lead: 'Accountability is the differentiator', detail: 'Notion tracks what was planned. NorthLane\'s contracts are tied to what was delivered in pipeline. That accountability model is impossible to replicate with a docs tool.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Deepest AI integration in class', detail: 'Notion\'s AI is embedded into every page, database, and document — not a bolt-on feature but a native part of the product experience across all paid tiers.' },
        { lead: 'Flexibility as a superpower', detail: 'Notion\'s block-based architecture means it can be a CRM, a wiki, a project tracker, a website, or a personal todo list — extremely high perceived value per seat.' },
        { lead: 'Strong brand among builders', detail: 'Notion is aspirational tooling for startup founders, product teams, and content creators — word-of-mouth growth and high NPS among its core demographic.' },
        { lead: 'Freemium acquisition machine', detail: 'Unlimited pages and blocks on the free tier drive massive top-of-funnel — Notion acquires individual users who later pull in their teams and upgrade.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Slow and bloated at scale', detail: 'Large Notion workspaces with heavy databases are notoriously slow — a recurring complaint from enterprise users that Notion has not fully resolved.' },
        { lead: 'No real project management depth', detail: 'Notion\'s project views (timeline, board, calendar) lag behind Linear, Shortcut, and Asana for teams that need proper sprint planning or engineering workflow management.' },
        { lead: 'AI quality is inconsistent', detail: 'Notion AI\'s writing quality varies significantly — it works well for simple rewrites but struggles with domain-specific content, technical writing, or strategic briefs.' },
        { lead: 'Search is still broken', detail: 'Notion\'s internal search remains a persistent weakness — finding content across large workspaces is unreliable, reducing the value of it as a knowledge base.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: 'Our positioning when Notion comes up in conversation',
      points: [
        { lead: 'Docs don\'t generate pipeline', detail: '"Notion is where you document your strategy. NorthLane is where your strategy becomes pipeline. You need both — but only one of us moves your ARR number."' },
        { lead: 'AI writing vs. AI strategy', detail: '"Notion\'s AI helps you write faster. NorthLane\'s AI surfaces competitor moves, scores your leads, and tells you where to spend your next $50K. Those are different problems."' },
        { lead: 'Execution is the gap', detail: 'Ask: "Who\'s executing the GTM strategy you wrote in Notion?" That\'s usually the gap — and NorthLane fills it with a senior team tied to pipeline targets.' },
        { lead: 'We often work inside Notion', detail: 'Position as additive: "We deliver our client playbooks, competitive briefs, and campaign reports in Notion. We\'re not replacing it — we\'re the team making it useful."' },
      ],
    },
  },

  height: {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'Autonomous AI positioning', detail: 'Height positions itself as "the autonomous project collaboration tool" — leaning harder into AI-native product identity than any other PM tool in the market.' },
        { lead: 'Scrape currently unavailable', detail: 'Height\'s pricing page was unavailable during our last scan — likely a JS-rendered or gated page. Profile is based on last-known data.' },
        { lead: 'Small team, premium focus', detail: 'Height\'s Team tier at $8.50/user/month targets small, technical teams who want advanced AI without enterprise overhead or Jira-level complexity.' },
        { lead: 'GitHub-first workflow', detail: 'Height\'s deepest integration is with GitHub — reinforcing its identity as a tool built by and for software engineers, not adapted for them.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: 'NorthLane Digital vs Height',
      points: [
        { lead: 'No functional overlap', detail: 'Height is a dev workflow tool for small engineering teams. NorthLane is a B2B SaaS marketing agency. These are purchased by different buyers for different problems.' },
        { lead: 'Both AI-forward', detail: 'Height leads with autonomous AI; NorthLane uses AI for competitive intelligence and campaign optimisation. Different domains, but a shared positioning language around AI-as-differentiator.' },
        { lead: 'NorthLane\'s clients may use Height', detail: 'Small SaaS engineering teams (~10-30 eng) are a typical Height customer — and often the same companies that hire NorthLane for demand gen. No conflict, possible referral pathway.' },
        { lead: 'Height is a monitoring signal, not a threat', detail: 'Height\'s AI positioning is worth watching for inspiration on how to frame AI as autonomous rather than assistive — relevant to how NorthLane talks about RivalIQ to clients.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: 'When we beat Height',
      points: [
        { lead: 'Marketing is the buyer', detail: 'Height has no story for CMOs, demand gen leads, or marketing ops. The moment the buyer is in marketing, NorthLane is the only relevant option in the room.' },
        { lead: 'Pipeline is the problem', detail: 'Height solves task management and dev collaboration. If the pain is "we\'re not generating qualified pipeline," Height isn\'t even in the consideration set.' },
        { lead: 'Scale beyond 50 eng', detail: 'Height\'s two-tier model caps out early for fast-growing teams. NorthLane serves SaaS companies through and beyond that growth phase on the marketing side.' },
        { lead: 'MarTech complexity', detail: 'When a client needs HubSpot, 6sense, or Marketo expertise, Height offers nothing. NorthLane\'s implementation depth is a clear and uncontested win.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Genuine AI-native architecture', detail: 'Unlike tools that bolt AI on, Height\'s autonomous task management was built AI-first — giving it a credible claim to being the most AI-native PM tool in the market.' },
        { lead: 'Clean two-tier pricing', detail: 'Free and Team. No pricing complexity, no enterprise sales motion to navigate. Makes it extremely fast to adopt for small technical teams.' },
        { lead: 'Cult following in technical founders', detail: 'Height has strong word-of-mouth among early-stage technical founders and engineering-led startups — a valuable beachhead for enterprise expansion.' },
        { lead: 'Real-time collaboration', detail: 'Height\'s real-time collaboration experience is notably smoother than Jira and Asana for small, co-located or async engineering teams.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Brand visibility is minimal', detail: 'Height has very low awareness outside of technical founder communities — difficult to get on shortlists in procurement-driven enterprise buying without significant brand investment.' },
        { lead: 'Five-person member cap on free', detail: 'Free tier caps at 5 members — limiting viral growth and PLG expansion compared to Linear (unlimited members) and Notion (unlimited pages free).' },
        { lead: 'No enterprise motion visible', detail: 'Height shows no public enterprise tier, dedicated CSM, or SAML/SSO offering — putting a ceiling on ACV and limiting expansion into larger engineering orgs.' },
        { lead: 'Website reliability issues', detail: 'Height\'s pricing page has had recurring scrape failures, suggesting possible infrastructure instability or aggressive bot-blocking that may frustrate legitimate users.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: 'Our positioning when Height comes up in conversation',
      points: [
        { lead: 'Different buyers, different problems', detail: '"Height is bought by your CTO for the eng team. NorthLane is hired by your CMO to build pipeline. These are separate decisions and separate budgets."' },
        { lead: 'AI-native is a shared value', detail: 'Rather than fighting the AI framing, align with it: "We use AI the same way Height does — to automate the repeatable work so the senior team can focus on strategy." Then show RivalIQ.' },
        { lead: 'Stability and track record', detail: 'For clients evaluating Height, NorthLane\'s multi-year track record with B2B SaaS CMOs is a stability argument: "We\'ve delivered for companies at your stage before."' },
        { lead: 'Growth stage alignment', detail: '"Height is great at seed and Series A. Our best clients are Series A through C — we scale with you from first marketing hire through to a full demand gen function."' },
      ],
    },
  },
};

export function generatePlaceholderProfile(name: string): CompetitorProfilePage {
  return {
    overview: {
      heading: 'Overview',
      points: [
        { lead: 'Recently added competitor', detail: `${name} has been added to your tracking list. Profile data will be enriched as more information is gathered.` },
        { lead: 'Initial monitoring active', detail: `RivalIQ is now tracking ${name}'s pricing page, hero copy, and feature claims for changes week-over-week.` },
        { lead: 'Baseline snapshot captured', detail: 'A baseline has been set for this competitor. Any changes detected from this point will appear in your Change Feed and Weekly Digest.' },
        { lead: 'Manual enrichment recommended', detail: 'For a full competitive profile, upload a brief or notes document to the Knowledge Base to calibrate signal scoring for this competitor.' },
      ],
    },
    howWeCompare: {
      heading: 'How We Compare',
      subheading: `NorthLane Digital vs ${name}`,
      points: [
        { lead: 'B2B SaaS specialisation', detail: `NorthLane only works with B2B SaaS — unlike ${name}, we have no onboarding ramp for clients in our target market.` },
        { lead: 'Pipeline-tied contracts', detail: 'NorthLane\'s contracts are tied to pipeline outcomes, not activity hours. Most competitors and agencies bill on retainer without performance accountability.' },
        { lead: 'MarTech implementation depth', detail: 'NorthLane brings hands-on HubSpot, Marketo, and 6sense expertise — not just strategy consulting but actual implementation and optimisation.' },
        { lead: 'Senior team delivery', detail: 'Every NorthLane account is handled by senior strategists. No bait-and-switch to junior coordinators after the pitch.' },
      ],
    },
    howWeWin: {
      heading: 'How We Win',
      subheading: `When we beat ${name}`,
      points: [
        { lead: 'CMO is the buyer', detail: `When the decision-maker is a CMO with a pipeline mandate, NorthLane's marketing-specific expertise outweighs ${name}'s broader positioning.` },
        { lead: 'MarTech stack needs fixing', detail: 'When HubSpot, Marketo, or attribution is broken, NorthLane\'s implementation depth wins immediately against generalist alternatives.' },
        { lead: 'Pipeline gap is the pain', detail: `If the client's problem is qualified pipeline generation, NorthLane directly solves it. ${name} may not have a clear answer for this.` },
        { lead: 'Senior team is a requirement', detail: 'When a client has been burned by junior-heavy delivery before, NorthLane\'s senior-only model closes the deal.' },
      ],
    },
    strengths: {
      heading: 'Strengths',
      points: [
        { lead: 'Actively monitoring', detail: `${name} is now being tracked — strengths will be populated as competitive intelligence is gathered from their pricing page and marketing assets.` },
        { lead: 'Competitor added to tracking', detail: 'Check back after the next weekly scan to see scored signals and changes detected from this competitor\'s public pages.' },
        { lead: 'Knowledge Base calibration', detail: 'Upload a document about this competitor to the Knowledge Base to improve signal scoring accuracy for their category.' },
        { lead: 'Manual notes can be added', detail: 'Use the Knowledge Base to upload any existing research, call notes, or competitive briefs you already have on this competitor.' },
      ],
    },
    weaknesses: {
      heading: 'Weaknesses',
      points: [
        { lead: 'Insufficient data yet', detail: `${name} was just added — weaknesses will appear after the first full weekly scan cycle completes.` },
        { lead: 'Enrich via Knowledge Base', detail: 'Upload competitive research, lost-deal notes, or analyst reports to the Knowledge Base to populate this section with real intelligence.' },
        { lead: 'Check Change Feed next week', detail: 'After the next scan, any pricing, feature, or positioning changes will be scored and appear in the Change Feed for this competitor.' },
        { lead: 'Community intelligence welcome', detail: 'If your sales team has intel on this competitor, add it as a TXT file to the Knowledge Base — it will calibrate scoring for future scans.' },
      ],
    },
    howToDifferentiate: {
      heading: 'How to Differentiate',
      subheading: `Our positioning when ${name} comes up in conversation`,
      points: [
        { lead: 'Lead with SaaS specialisation', detail: `"We only work with B2B SaaS — that means we understand your comp model, your ICP, and your sales cycle without a learning curve. Does ${name} offer that?"` },
        { lead: 'Anchor on pipeline outcomes', detail: '"Our contracts are tied to pipeline numbers, not retainer hours. Ask any competitor what happens if they don\'t hit your MQL target. We have an answer for that."' },
        { lead: 'Senior team is the proof point', detail: '"The person who pitches you is the person who runs your account. No juniors, no coordinators. That\'s unusual in this space."' },
        { lead: 'MarTech depth closes the gap', detail: '"If your stack isn\'t working — HubSpot scoring off, attribution broken, 6sense underutilised — we fix that as part of the engagement. That\'s implementation depth most agencies don\'t have."' },
      ],
    },
  };
}
