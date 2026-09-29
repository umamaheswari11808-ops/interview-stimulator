import { InterviewerPersona, DrillItem } from '../types/interview';

export interface PredefinedRole {
  id: string;
  name: string;
  category: 'Engineering' | 'Product & Design' | 'Data & AI' | 'Business & Operations' | 'Leadership';
  icon: string;
  description: string;
  defaultQuestions: string[];
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'Principal Software Architect',
    companyStyle: 'Big Tech / Tier 1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tone: 'Analytical, probing, focused on tradeoffs and scale',
    voiceGender: 'female',
    tagline: 'Deep architectural inquiry with focus on systemic tradeoffs.'
  },
  {
    id: 'marcus-reed',
    name: 'Marcus Reed',
    role: 'VP of Engineering',
    companyStyle: 'High-Growth Unicorn',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    tone: 'Direct, results-oriented, pragmatic and fast-paced',
    voiceGender: 'male',
    tagline: 'Velocity, ownership, failure resilience, and business impact.'
  },
  {
    id: 'maya-patel',
    name: 'Dr. Maya Patel',
    role: 'Head of People & Organizational Culture',
    companyStyle: 'Mission-Driven Global Enterprise',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    tone: 'Empathetic, deep STAR behavioral listener, values alignment',
    voiceGender: 'female',
    tagline: 'Psychological safety, conflict resolution, and leadership maturity.'
  },
  {
    id: 'david-ross',
    name: 'David Ross',
    role: 'Director of Product Management',
    companyStyle: 'Consumer Internet & AI',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    tone: 'Strategic, user-obsessed, hypothesis-driven, metric focused',
    voiceGender: 'male',
    tagline: 'First-principles reasoning, prioritization, and North Star metrics.'
  }
];

export const PREDEFINED_ROLES: PredefinedRole[] = [
  {
    id: 'software-engineer',
    name: 'Full Stack / Software Engineer',
    category: 'Engineering',
    icon: 'Code2',
    description: 'Frontend/backend architecture, state management, API design, scalability, and code quality.',
    defaultQuestions: [
      "Tell me about a complex feature you built from scratch. What technical tradeoffs did you make between velocity and maintainability?",
      "Walk me through a severe production bug or outage you resolved. How did you identify the bottleneck?",
      "How do you ensure web applications maintain fast p99 rendering and network performance under heavy loads?",
      "Describe a time you strongly disagreed with a senior engineer on a technical architectural choice. How was it resolved?"
    ]
  },
  {
    id: 'system-design',
    name: 'Distributed Systems / Backend Architect',
    category: 'Engineering',
    icon: 'Server',
    description: 'High availability, microservices, consensus, database sharding, caching, and resiliency.',
    defaultQuestions: [
      "Design a real-time notification engine capable of handling 50 million concurrent connected clients with low latency.",
      "How do you handle database write amplification and data consistency in an eventual-consistency microservice architecture?",
      "Walk me through your strategy for zero-downtime database migrations on large partitioned tables."
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product & Design',
    icon: 'Layers',
    description: 'User empathy, roadmap prioritization, North Star metrics, cross-functional execution.',
    defaultQuestions: [
      "How do you prioritize your product roadmap when sales demands enterprise features but telemetry shows core retention issues?",
      "Walk me through a product launch that failed to hit its initial adoption targets. What did you learn?",
      "How do you work with engineering teams when technical debt is blocking new customer-facing feature development?"
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist / Machine Learning Engineer',
    category: 'Data & AI',
    icon: 'Cpu',
    description: 'Model evaluation, feature engineering, offline-to-online evaluation, MLOps, LLM integration.',
    defaultQuestions: [
      "Walk me through how you evaluated an ML model in production where offline metrics contradicted online business A/B tests.",
      "How do you handle severe class imbalance and noisy training data in critical classification pipelines?",
      "Describe an instance where you replaced a complex deep learning model with a simpler heuristic or logistic model for business reasons."
    ]
  },
  {
    id: 'frontend-engineer',
    name: 'Senior Frontend Engineer',
    category: 'Engineering',
    icon: 'Layout',
    description: 'React, web performance, accessibility, modern styling, state machines, and UX architecture.',
    defaultQuestions: [
      "How do you diagnose and fix layout thrashing, main-thread blocking, and long tasks in heavy single-page applications?",
      "Walk me through how you design an accessible, keyboard-navigable design system component library.",
      "Describe how you structure client-side state when dealing with optimistic UI updates and intermittent network failure."
    ]
  },
  {
    id: 'engineering-manager',
    name: 'Engineering Manager / Tech Lead',
    category: 'Leadership',
    icon: 'Users',
    description: 'Team topology, hiring, 1-on-1 coaching, stakeholder management, engineering culture.',
    defaultQuestions: [
      "How do you manage an underperforming engineer while protecting team morale and project commitments?",
      "Tell me about a high-friction cross-team project where goals were misaligned. How did you drive consensus?",
      "How do you balance tech debt payback with executive pressure for rapid feature delivery?"
    ]
  },
  {
    id: 'devops-cloud',
    name: 'DevOps / Platform Engineer',
    category: 'Engineering',
    icon: 'Cloud',
    description: 'Kubernetes, CI/CD pipelines, observability, Terraform, cloud security, disaster recovery.',
    defaultQuestions: [
      "How do you design a multi-region failover pipeline with minimal RPO (Recovery Point Objective) and RTO?",
      "Walk me through how you reduced CI/CD build and test times by over 50% across a monolithic codebase.",
      "How do you establish security best practices (least privilege, secret rotation) without slowing developer velocity?"
    ]
  },
  {
    id: 'behavioral-general',
    name: 'Behavioral & Culture Fit (All Roles)',
    category: 'Leadership',
    icon: 'Sparkles',
    description: 'The universal STAR questions: conflict, leadership, failure, initiative, values.',
    defaultQuestions: [
      "Tell me about a time you made a high-impact mistake at work. How did you take ownership and communicate it?",
      "Describe an ambiguous project where requirements were shifting daily. How did you deliver results?",
      "Tell me about a time you went above and beyond your defined job description to unblock a company milestone."
    ]
  }
];

export const DRILL_QUESTIONS_BANK: DrillItem[] = [
  {
    id: 'drill-1',
    question: "Tell me about a time you had a critical conflict with a colleague on your team. How did you handle it?",
    category: "Behavioral (STAR)",
    difficulty: "Medium",
    roleTag: "Universal",
    keyPointsToCover: [
      "Objective description of the root disagreement without personal blame",
      "Private 1-on-1 dialogue to understand their underlying constraints",
      "Using data, benchmarks, or rapid prototyping to test hypotheses",
      "Committing fully to the chosen path with mutual respect"
    ],
    sampleModelAnswer: "In a previous quarter, our lead backend engineer and I disagreed on GraphQL vs REST for our mobile client. He preferred REST for caching simplicity, while I advocated GraphQL to prevent over-fetching on high-latency mobile networks. Rather than escalating, I scheduled a private working session where we defined clear benchmarks. We created a spike test simulating 3G network conditions, which showed GraphQL reduced payload size by 62% without caching penalties. We agreed to adopt GraphQL for mobile while retaining REST for internal batch services. The launch shipped on schedule with zero API regressions."
  },
  {
    id: 'drill-2',
    question: "Describe your biggest professional failure. What did you learn and how did you change your approach?",
    category: "Behavioral (STAR)",
    difficulty: "Hard",
    roleTag: "Universal",
    keyPointsToCover: [
      "Radical ownership without passing blame to others or external factors",
      "Immediate corrective triage and transparent communication to leadership",
      "Root cause analysis (blameless post-mortem)",
      "Long-term systemic guardrails implemented to prevent repeat failures"
    ],
    sampleModelAnswer: "Early in my senior role, I approved a database schema migration that omitted an index on a table with 20 million rows, causing a 12-minute query lock during midday traffic. When alerts fired, I immediately notified the incident response channel, assisted the DBA in killing blocked locks, and rolled back the change. Afterward, I authored a blameless postmortem and built an automated CI linter that verifies index creation on all migrations prior to production staging. It taught me that speed should never bypass automated verification."
  },
  {
    id: 'drill-3',
    question: "How do you approach designing a system that must scale to handle 10x traffic over the next 12 months?",
    category: "System Design",
    difficulty: "Hard",
    roleTag: "Engineering",
    keyPointsToCover: [
      "Clarifying functional requirements, throughput (QPS), and storage bounds",
      "Identifying existing bottlenecks (stateful services, database connections, I/O)",
      "Horizontal scaling, caching layers (CDN, Redis), read replicas, async queues",
      "Observability, circuit breaking, and capacity planning"
    ],
    sampleModelAnswer: "I begin by establishing quantitative baselines: current read/write QPS, peak p99 latencies, and storage growth rates. To support 10x traffic, I look for single points of failure. First, offload static and cacheable read traffic through edge CDNs and a distributed Redis tier. Second, decouple synchronous write paths using durable message queues (like Kafka) with consumer worker pools. Third, partition the primary database by customer tenant or shard key, paired with read-replicas. Finally, I implement distributed tracing, rate-limiting, and auto-scaling policies to maintain SLA under sudden bursts."
  },
  {
    id: 'drill-4',
    question: "Why should we hire you over other qualified candidates who have similar resumes?",
    category: "Career Narrative & Fit",
    difficulty: "Medium",
    roleTag: "Universal",
    keyPointsToCover: [
      "Unique intersection of domain expertise and execution speed",
      "Demonstrated track record of delivering measurable ROI/outcomes",
      "Deep alignment with the company's current phase and strategic problems",
      "Humility, coachability, and force-multiplier effect on team members"
    ],
    sampleModelAnswer: "While many candidates offer strong technical fundamentals, what sets me apart is my ability to bridge high-level product strategy with pragmatic engineering execution. In my last two roles, I reduced onboarding ramp time for new hires by 40% while leading core infrastructure that handled 4x revenue growth. I don't just write robust code; I obsess over customer retention, unblock teammates, and thrive in environments where ambiguity must be converted into clear, shippable milestones."
  },
  {
    id: 'drill-5',
    question: "Tell me about a time you had to deliver an ambitious feature with incomplete or vague requirements.",
    category: "Behavioral (STAR)",
    difficulty: "Medium",
    roleTag: "Product & Engineering",
    keyPointsToCover: [
      "Framing the ambiguous problem and identifying key assumptions",
      "Engaging stakeholders to define non-negotiable success criteria",
      "Iterative prototype / MVP approach to gather rapid feedback",
      "Delivering on time with built-in instrumentation to validate hypotheses"
    ],
    sampleModelAnswer: "Our leadership wanted an 'AI workflow recommendation engine' with only a 1-sentence prompt. Rather than waiting for a formal 30-page spec, I scheduled interviews with 5 active enterprise users to map their most repetitive friction points. Based on their input, I drafted a 1-page PRD defining 3 core automated heuristics, built an interactive Figma click-through in 48 hours to validate with stakeholders, and delivered a phased v1 MVP in 3 weeks. User engagement on the automated flow reached 78% in month one."
  },
  {
    id: 'drill-6',
    question: "How do you explain a highly complex technical architecture or bug to an executive or non-technical client?",
    category: "Communication",
    difficulty: "Easy",
    roleTag: "Universal",
    keyPointsToCover: [
      "Eliminating acronyms and deep domain jargon",
      "Using relatable real-world analogies (e.g. highways, plumbing, restaurant kitchens)",
      "Focusing directly on business impact, risk, and resolution time",
      "Providing clear choices and recommendations with estimated costs"
    ],
    sampleModelAnswer: "I ground the explanation in business impact rather than jargon. For instance, when explaining an asynchronous queue backup that delayed billing emails, I avoided talking about worker thread starvation. Instead, I explained it like a restaurant kitchen: 'Orders were placed faster than the chefs could plate them, creating a line at the counter. No orders were lost, but receipts arrived 20 minutes late. We added two more cooks to the station and cleared the backlog.' Executives appreciate knowing the impact, the risk, and the permanent preventative measure."
  }
];

export const STAR_GUIDE = {
  title: "The STAR Interview Framework",
  subtitle: "The gold-standard answering technique used by Amazon, Google, Meta, and Fortune 500 hiring committees.",
  steps: [
    {
      step: 'S',
      name: 'Situation',
      targetPercent: '15-20%',
      description: 'Set the stage clearly and concisely. Where were you working? What was the project or challenge? Give relevant context without rambling.',
      exampleBad: '"We were building an app and things were kind of a mess with people disagreeing on everything..."',
      exampleGood: '"In Q3 2024 at FinTechCorp, our payment processing gateway was experiencing a 4.2% transaction failure rate during Black Friday peak volumes, putting $1.2M in daily revenue at risk."'
    },
    {
      step: 'T',
      name: 'Task',
      targetPercent: '10-15%',
      description: 'Define your specific responsibility. What goal were YOU personally tasked with achieving? Avoid vague "we had to do it".',
      exampleBad: '"We had to fix the bugs and get everything working again ASAP."',
      exampleGood: '"As the lead backend engineer, my explicit goal was to diagnose the root cause, achieve zero transaction drops, and restore latency under 200ms within a 72-hour window."'
    },
    {
      step: 'A',
      name: 'Action',
      targetPercent: '50-60%',
      description: 'The meat of your answer. Walk through the concrete steps you took. Highlight technical depth, problem-solving, collaboration, and leadership.',
      exampleBad: '"I searched through the logs and found some slow queries so we tweaked the database settings."',
      exampleGood: '"I instrumented distributed tracing with OpenTelemetry, isolated a connection-pool bottleneck caused by unindexed foreign keys, and deployed a Redis caching layer for merchant configs. I also coordinated a daily standup with our infrastructure team to run load simulations up to 10,000 QPS."'
    },
    {
      step: 'R',
      name: 'Result',
      targetPercent: '15-20%',
      description: 'Quantify your outcome. Share concrete metrics: percentage improvement, dollars saved/generated, latency reduced, or team velocity boosted.',
      exampleBad: '"In the end, everyone was happy and things worked much better."',
      exampleGood: '"Transaction drop rates fell from 4.2% to 0.01%, processing latency decreased by 64%, and we processed over $14M during the holiday weekend with 100% uptime. This architecture became the standard template across 4 other service teams."'
    }
  ]
};
