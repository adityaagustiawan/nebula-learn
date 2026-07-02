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
  externalUrl?: string;
}

export const courses: Course[] = [
  { slug: "ai-engineering-bootcamp", title: "AI Engineering Bootcamp", category: "Artificial Intelligence", level: "Intermediate", hours: 42, rating: 4.9, enrolled: 12480, instructor: "Dr. Maya Lin", description: "Build production-grade LLM apps with RAG, agents, and evals.", tag: "Trending", externalUrl: "https://www.dicoding.com/academies/machine-learning" },
  { slug: "cyber-defense-fundamentals", title: "Cyber Defense Fundamentals", category: "Cybersecurity", level: "Beginner", hours: 28, rating: 4.8, enrolled: 9320, instructor: "Arif Pratama", description: "Network defense, threat modeling, and incident response basics.", tag: "New", externalUrl: "https://www.dicoding.com/academies/cyber-security" },
  { slug: "data-science-365", title: "Data Science 365", category: "Data Science", level: "Intermediate", hours: 56, rating: 4.9, enrolled: 22110, instructor: "Sara Okafor", description: "From SQL & statistics to ML in a structured 12-week path.", tag: "Bestseller", externalUrl: "https://365datascience.com/courses/" },
  { slug: "cloud-architect-aws", title: "Cloud Architect on AWS", category: "Cloud", level: "Advanced", hours: 36, rating: 4.7, enrolled: 7800, instructor: "Kenji Tanaka", description: "Design resilient, secure, cost-optimized AWS architectures.", tag: "", externalUrl: "https://aws.amazon.com/training/path-cloud-architect/" },
  { slug: "fullstack-react-tanstack", title: "Full-Stack React with TanStack", category: "Web Dev", level: "Intermediate", hours: 34, rating: 4.8, enrolled: 5430, instructor: "Lina Hartono", description: "SSR, type-safe routing, server functions, and edge deployment.", tag: "New", externalUrl: "https://tanstack.com/router/latest" },
  { slug: "ethical-hacking-pro", title: "Ethical Hacking Pro", category: "Cybersecurity", level: "Advanced", hours: 48, rating: 4.9, enrolled: 8950, instructor: "Marcus Chen", description: "Hands-on penetration testing across web, network, and cloud.", tag: "Pro", externalUrl: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" },
  { slug: "ml-foundations", title: "Machine Learning Foundations", category: "Artificial Intelligence", level: "Beginner", hours: 32, rating: 4.7, enrolled: 18200, instructor: "Dr. Priya Sharma", description: "Linear algebra to neural nets — taught through real datasets.", tag: "", externalUrl: "https://www.coursera.org/learn/machine-learning" },
  { slug: "prompt-engineering", title: "Prompt Engineering for Builders", category: "Artificial Intelligence", level: "Beginner", hours: 14, rating: 4.6, enrolled: 31420, instructor: "Daniel Park", description: "Patterns, evaluations, and tools for production prompts.", tag: "Trending", externalUrl: "https://lablab.ai/t/prompt-engineering" },
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
  status: "Open" | "Live" | "Closing soon" | "Upcoming" | "End";
  externalUrl?: string;
  imageUrl?: string;
  competitionType?: string;
  description?: string;
}

export const competitions: Competition[] = [
  { 
    slug: "global-ai-hack-2026", 
    title: "Global AI Hack 2026", 
    host: "NebulaLearn × LabLab", 
    prize: "$120,000", 
    starts: "Jun 14", 
    daysLeft: 9, 
    participants: 14200, 
    tags: ["AI", "Agents", "Open"], 
    status: "Closing soon", 
    externalUrl: "https://lablab.ai/ai-hackathons/global-ai-hack-2026",
    imageUrl: "https://storage.googleapis.com/lablab-static-eu/images/events/mo83rq6y28xa14ceg51kzzht/mo83rq6y28xa14ceg51kzzht_thumbnailLink_d31vyxzddio7vx6m3c38d4hk.jpg",
    competitionType: "HACKATHON",
    description: "Build the next generation of Autonomous Agents in the heart of Europe’s AI Revolution. 📅 June 14–21, 2026."
  },
  { 
    slug: "techex-intelligent-enterprise-solutions-hackathon", 
    title: "Transforming Enterprise Through AI", 
    host: "TechEx × LabLab", 
    prize: "$10,000", 
    starts: "May 11 - 19", 
    daysLeft: 1, 
    participants: 3039, 
    tags: ["Enterprise", "AI", "TechEx"], 
    status: "Live", 
    externalUrl: "https://lablab.ai/ai-hackathons/techex-intelligent-enterprise-solutions-hackathon",
    imageUrl: "https://storage.googleapis.com/lablab-static-eu/images/events/v8t9p3r2q6z15f7m/thumbnail.jpg",
    competitionType: "HACKATHON",
    description: "Design, prototype, and showcase enterprise-ready innovation. Hybrid event with on-site phase in San Jose. 📅 May 11–19, 2026."
  },
  { 
    slug: "brightdata-ai-agents-web-data-hackathon", 
    title: "Web Data UNLOCKED Hackathon", 
    host: "Bright Data × LabLab", 
    prize: "$5,000", 
    starts: "May 25 - 31", 
    daysLeft: 14, 
    participants: 589, 
    tags: ["Web Data", "Agents", "SF"], 
    status: "Open", 
    externalUrl: "https://lablab.ai/ai-hackathons/brightdata-ai-agents-web-data-hackathon",
    imageUrl: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/466540cbd5a7812296059c1ea190caa0~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1784210920&x-signature=Ichma0X4wtgZjcZoy8VGZuc7BQc%3D",
    competitionType: "HACKATHON",
    description: "Learn how modern AI agents interact with the live web through hands-on workshops and real infrastructure in San Francisco. 📅 May 25–31, 2026."
  },
  { 
    slug: "amd-gpu-marathon", 
    title: "AMD GPU Marathon", 
    host: "AMD Academy", 
    prize: "GPUs + $40k", 
    starts: "Aug 05", 
    daysLeft: 61, 
    participants: 2100, 
    tags: ["GPU", "Perf"], 
    status: "Upcoming", 
    externalUrl: "https://www.amd.com/en/corporate/university-relations.html",
    imageUrl: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/e491a3134a229d9b1d93720f18c6c753~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1784210920&x-signature=Llw7XSYiYyApYbzQYL2S31xeZ%2B4%3D",
    competitionType: "MARATHON",
    description: "Optimize high-performance computing on the latest AMD hardware."
  },
  { 
    slug: "web3-skill-wallet", 
    title: "Web3 Skill Wallet Jam", 
    host: "Skill Wallet", 
    prize: "$15,000", 
    starts: "Live now", 
    daysLeft: 3, 
    participants: 980, 
    tags: ["Web3"], 
    status: "Live", 
    externalUrl: "https://skillwallet.id",
    imageUrl: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/6eb334e7a8cc2b1627df676ca855f469~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1784210920&x-signature=U%2FBBBw5OjZQ09rMrpqUQKL2c6Bk%3D",
    competitionType: "JAM",
    description: "Build decentralized identity and credentialing solutions."
  },
  { 
    slug: "ruang-ai-bootcamp", 
    title: "RuangAI Indonesia Bootcamp", 
    host: "RuangAI", 
    prize: "Rp 250 jt", 
    starts: "Jun 30", 
    daysLeft: 25, 
    participants: 5300, 
    tags: ["AI", "Indonesia"], 
    status: "Open", 
    externalUrl: "https://ruangai.id",
    imageUrl: "https://p19-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/5fdcf765f0e183fef9a4f0fbd5834477~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1784210920&x-signature=rSTfJwZJvNXiMMvpXfKujIeg69o%3D",
    competitionType: "BOOTCAMP",
    description: "The largest AI development bootcamp in Indonesia."
  },
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
  externalUrl?: string;
}

export const webinars: Webinar[] = [
  { slug: "agents-in-production", title: "Agents in Production: Lessons from 1M users", speaker: "Marie Dubois", role: "Staff Engineer, Anthropic", startsAt: "Live now", durationMin: 60, attendees: 4820, status: "Live", topic: "AI", externalUrl: "https://anthropic.com/webinars" },
  { slug: "zero-trust-2026", title: "Zero Trust Architecture in 2026", speaker: "Reza Aulia", role: "CISO, Cyberkarta", startsAt: "Today · 19:00", durationMin: 45, attendees: 1200, status: "Upcoming", topic: "Security", externalUrl: "https://cyberkarta.com/events" },
  { slug: "design-systems-at-scale", title: "Design Systems at Scale", speaker: "Anya Petrova", role: "Design Lead, Linear", startsAt: "Tomorrow · 15:00", durationMin: 60, attendees: 980, status: "Upcoming", topic: "Design", externalUrl: "https://linear.app/webinars" },
  { slug: "rag-replay", title: "Building RAG from Scratch", speaker: "Tom Becker", role: "Founder, VectorLabs", startsAt: "Replay", durationMin: 75, attendees: 12400, status: "Replay", topic: "AI", externalUrl: "https://vectorlabs.ai/replay/rag" },
];
