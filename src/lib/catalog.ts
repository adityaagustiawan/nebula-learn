export interface Course {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hours: number;
  rating: number;
  enrolled: number;
  instructor: string;
  description: string;
  tag: string;
}

export const courses: Course[] = [
  { slug: "ai-engineering-bootcamp", title: "AI Engineering Bootcamp", category: "Artificial Intelligence", level: "Intermediate", hours: 42, rating: 4.9, enrolled: 12480, instructor: "Dr. Maya Lin", description: "Build production-grade LLM apps with RAG, agents, and evals.", tag: "Trending" },
  { slug: "cyber-defense-fundamentals", title: "Cyber Defense Fundamentals", category: "Cybersecurity", level: "Beginner", hours: 28, rating: 4.8, enrolled: 9320, instructor: "Arif Pratama", description: "Network defense, threat modeling, and incident response basics.", tag: "New" },
  { slug: "data-science-365", title: "Data Science 365", category: "Data Science", level: "Intermediate", hours: 56, rating: 4.9, enrolled: 22110, instructor: "Sara Okafor", description: "From SQL & statistics to ML in a structured 12-week path.", tag: "Bestseller" },
  { slug: "cloud-architect-aws", title: "Cloud Architect on AWS", category: "Cloud", level: "Advanced", hours: 36, rating: 4.7, enrolled: 7800, instructor: "Kenji Tanaka", description: "Design resilient, secure, cost-optimized AWS architectures.", tag: "" },
  { slug: "fullstack-react-tanstack", title: "Full-Stack React with TanStack", category: "Web Dev", level: "Intermediate", hours: 34, rating: 4.8, enrolled: 5430, instructor: "Lina Hartono", description: "SSR, type-safe routing, server functions, and edge deployment.", tag: "New" },
  { slug: "ethical-hacking-pro", title: "Ethical Hacking Pro", category: "Cybersecurity", level: "Advanced", hours: 48, rating: 4.9, enrolled: 8950, instructor: "Marcus Chen", description: "Hands-on penetration testing across web, network, and cloud.", tag: "Pro" },
  { slug: "ml-foundations", title: "Machine Learning Foundations", category: "Artificial Intelligence", level: "Beginner", hours: 32, rating: 4.7, enrolled: 18200, instructor: "Dr. Priya Sharma", description: "Linear algebra to neural nets — taught through real datasets.", tag: "" },
  { slug: "prompt-engineering", title: "Prompt Engineering for Builders", category: "Artificial Intelligence", level: "Beginner", hours: 14, rating: 4.6, enrolled: 31420, instructor: "Daniel Park", description: "Patterns, evaluations, and tools for production prompts.", tag: "Trending" },
];

export interface Competition {
  slug: string;
  title: string;
  host: string;
  prize: string;
  starts: string;
  daysLeft: number;
  participants: number;
  tags: string[];
  status: "Open" | "Live" | "Closing soon" | "Upcoming";
}

export const competitions: Competition[] = [
  { slug: "global-ai-hack-2026", title: "Global AI Hack 2026", host: "NebulaLearn × LabLab", prize: "$120,000", starts: "Jun 14", daysLeft: 9, participants: 14200, tags: ["AI", "Agents", "Open"], status: "Closing soon" },
  { slug: "secure-the-cloud", title: "Secure The Cloud Challenge", host: "Reply", prize: "$60,000", starts: "Jul 02", daysLeft: 27, participants: 8400, tags: ["Cybersec", "Cloud"], status: "Open" },
  { slug: "data-for-good", title: "Data for Good Sprint", host: "365 Data Science", prize: "$25,000", starts: "Jun 21", daysLeft: 16, participants: 3120, tags: ["Data", "Social"], status: "Open" },
  { slug: "amd-gpu-marathon", title: "AMD GPU Marathon", host: "AMD Academy", prize: "GPUs + $40k", starts: "Aug 05", daysLeft: 61, participants: 2100, tags: ["GPU", "Perf"], status: "Upcoming" },
  { slug: "web3-skill-wallet", title: "Web3 Skill Wallet Jam", host: "Skill Wallet", prize: "$15,000", starts: "Live now", daysLeft: 3, participants: 980, tags: ["Web3"], status: "Live" },
  { slug: "ruang-ai-bootcamp", title: "RuangAI Indonesia Bootcamp", host: "RuangAI", prize: "Rp 250 jt", starts: "Jun 30", daysLeft: 25, participants: 5300, tags: ["AI", "Indonesia"], status: "Open" },
];

export interface Webinar {
  slug: string;
  title: string;
  speaker: string;
  role: string;
  startsAt: string;
  durationMin: number;
  attendees: number;
  status: "Live" | "Upcoming" | "Replay";
  topic: string;
}

export const webinars: Webinar[] = [
  { slug: "agents-in-production", title: "Agents in Production: Lessons from 1M users", speaker: "Marie Dubois", role: "Staff Engineer, Anthropic", startsAt: "Live now", durationMin: 60, attendees: 4820, status: "Live", topic: "AI" },
  { slug: "zero-trust-2026", title: "Zero Trust Architecture in 2026", speaker: "Reza Aulia", role: "CISO, Cyberkarta", startsAt: "Today · 19:00", durationMin: 45, attendees: 1200, status: "Upcoming", topic: "Security" },
  { slug: "design-systems-at-scale", title: "Design Systems at Scale", speaker: "Anya Petrova", role: "Design Lead, Linear", startsAt: "Tomorrow · 15:00", durationMin: 60, attendees: 980, status: "Upcoming", topic: "Design" },
  { slug: "rag-replay", title: "Building RAG from Scratch", speaker: "Tom Becker", role: "Founder, VectorLabs", startsAt: "Replay", durationMin: 75, attendees: 12400, status: "Replay", topic: "AI" },
];
