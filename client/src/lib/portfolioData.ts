export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  tagline: string;
  year: string;
  role: string;
  client?: string;
  description: string;
  longDescription: string;
  highlights: string[];
  tags: string[];
  metrics: { label: string; value: string }[];
  techStack: string[];
  image: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  color: string;
  accentHex: string;
}

export interface SkillCategory {
  number: string;
  title: string;
  tag: string;
  description: string;
  items: { name: string; tag: string; detail: string }[];
}

export interface Milestone {
  year: string;
  period: string;
  title: string;
  organization: string;
  role: string;
  description: string;
  badge: string;
  tags: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export const assetUrls = {
  logo: "/manus-storage/signal-noir-sh-logo_c99df2fa.png",
  valued: "/manus-storage/valued-project_4b1a24b0.png",
  iris: "/manus-storage/iris-project_d17a6b4f.png",
  library: "/manus-storage/library-project_00f8cb41.png",
};

export const heroGallery = [
  {
    title: "ValuEd — Career Navigation",
    tag: "Education Platform",
    image: assetUrls.valued,
    aspect: "portrait",
  },
  {
    title: "IRIS — Threat Intelligence",
    tag: "Machine Learning",
    image: assetUrls.iris,
    aspect: "portrait",
  },
  {
    title: "Library Management System",
    tag: "Full-Stack System",
    image: assetUrls.library,
    aspect: "portrait",
  },
  {
    title: "Banking Management System",
    tag: "Database Design",
    image: assetUrls.valued,
    aspect: "portrait",
  },
];

export const projectsData: Project[] = [
  {
    id: "valued",
    number: "01",
    title: "ValuEd",
    subtitle: "Career & Higher Education Pathways Platform",
    category: "Education Platform",
    tagline: "Bridging the gap between student aspirations and career outcomes with interactive pathways.",
    year: "2025 - 2026",
    role: "Lead Full-Stack Developer",
    client: "EdTech Initiative",
    description:
      "A React-led education product that maps careers, college pathways, skills, mentors, and next-step opportunities into one focused, interactive student journey.",
    longDescription:
      "ValuEd is engineered to simplify complex higher education and career trajectories. Built with React, TypeScript, and high-performance microservices, it analyzes individual skill profiles, academic interests, and market hiring velocity to generate personalized milestones, mentorship pathways, and skill-gap recommendations in real time.",
    highlights: [
      "Dynamic career path visualization using interactive graph nodes and SVG paths",
      "Recommendation engine matching student aptitude with emerging industry trajectories",
      "Instant mentor matching and conversational exploration interface",
      "Sub-100ms client search powered by edge indexing and smart cache invalidation",
    ],
    tags: ["React 19", "TypeScript", "FastAPI", "Tailwind CSS", "Education", "PostgreSQL"],
    metrics: [
      { label: "Active Pathway Matches", value: "15,000+" },
      { label: "Recommendation Latency", value: "<85ms" },
      { label: "User Satisfaction Score", value: "98.4%" },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "PostgreSQL", "Framer Motion"],
    image: assetUrls.valued,
    featured: true,
    githubUrl: "https://github.com/syedhanzala-Abrar",
    liveUrl: "https://valued.syedhanzala.dev",
    color: "rgba(200, 255, 56, 0.15)",
    accentHex: "#c8ff38",
  },
  {
    id: "iris",
    number: "02",
    title: "IRIS",
    subtitle: "Real-Time Threat Intelligence & ML Anomaly Detection",
    category: "Security AI Concept",
    tagline: "Translating high-frequency noise into actionable security intelligence with deep learning.",
    year: "2025",
    role: "Machine Learning & Systems Developer",
    client: "Cyber Intelligence Lab",
    description:
      "An applied-AI security concept that translates noisy activity patterns into readable threat signals, confidence cues, and automated mitigation response paths.",
    longDescription:
      "IRIS ingests high-volume network telemetry and server logs to detect anomalous behavioral signatures before exploitation happens. Employing unsupervised clustering alongside LSTM sequence prediction, IRIS ranks threat severity and renders human-readable incident graphs with zero alert fatigue.",
    highlights: [
      "Real-time streaming anomaly detection with sub-second inference pipelines",
      "Multi-dimensional clustering separating benign irregularities from coordinated probes",
      "Interactive threat vector timeline with drill-down node inspection",
      "Automated policy generation exporting Sigma and Snort rules on confirmation",
    ],
    tags: ["Python", "PyTorch", "FastAPI", "Machine Learning", "Stream Processing", "Docker"],
    metrics: [
      { label: "Anomaly Detection Accuracy", value: "99.1%" },
      { label: "False Positive Reduction", value: "-64%" },
      { label: "Log Ingestion Rate", value: "50k/sec" },
    ],
    techStack: ["Python", "PyTorch", "Scikit-Learn", "FastAPI", "Docker", "Redis Streams", "React Flow"],
    image: assetUrls.iris,
    featured: true,
    githubUrl: "https://github.com/syedhanzala-Abrar",
    liveUrl: "https://iris.syedhanzala.dev",
    color: "rgba(0, 245, 155, 0.15)",
    accentHex: "#00f59b",
  },
  {
    id: "library",
    number: "03",
    title: "Library Management System",
    subtitle: "High-Performance Distributed Management & Discovery Platform",
    category: "System Architecture",
    tagline: "Modernizing institutional knowledge and circulation with seamless digital workflows.",
    year: "2024 - 2025",
    role: "Full-Stack Engineer & Database Architect",
    client: "Academic Infrastructure",
    description:
      "A data-backed library interface connecting book records, member activity, borrowing workflows, and API-ready system operations with sub-millisecond query execution.",
    longDescription:
      "Library Management System solves legacy catalog fragmentation by combining a lightning-fast React frontend with a robust PostgreSQL relational foundation. Features comprehensive circulation auditing, automated overdue notification triggers, granular role-based permissions, and barcode scanning integration.",
    highlights: [
      "Optimized PostgreSQL schema with custom indexing yielding sub-5ms query times on 1M+ rows",
      "Real-time inventory reservation queue with concurrent transaction lock isolation",
      "Rich analytical dashboard visualizing reader engagement, peak borrowing hours, and inventory turnover",
      "Full offline-first PWA support with background synchronization",
    ],
    tags: ["React", "PostgreSQL", "REST APIs", "Node.js", "Tailwind CSS", "Redis"],
    metrics: [
      { label: "Query Execution Time", value: "4.2ms" },
      { label: "Database Concurrency", value: "1,200 req/s" },
      { label: "Catalog Records Handled", value: "1,000,000+" },
    ],
    techStack: ["React", "Node.js", "Express", "PostgreSQL", "Prisma ORM", "Redis", "Chart.js"],
    image: assetUrls.library,
    featured: true,
    githubUrl: "https://github.com/syedhanzala-Abrar",
    liveUrl: "https://library.syedhanzala.dev",
    color: "rgba(0, 229, 255, 0.15)",
    accentHex: "#00e5ff",
  },
  {
    id: "fincore",
    number: "04",
    title: "Banking Management System",
    subtitle: "Relational Banking Ledger & Transaction Engine",
    category: "Data Architecture",
    tagline: "ACID-compliant relational ledger model designed for fault-tolerant financial transactions.",
    year: "2024",
    role: "Database & Backend Engineer",
    client: "FinTech Research",
    description:
      "A relational-data study and transaction engine for customer profiles, multi-currency accounts, double-entry ledger history, and automated compliance auditing.",
    longDescription:
      "Banking Management System implements an immutable double-entry bookkeeping architecture ensuring strict debit-credit mathematical balance across distributed accounts. Featuring deterministic retry logic, idempotent API endpoints, and comprehensive audit trails for forensic tracking.",
    highlights: [
      "Strict double-entry journal ledger enforcing zero ledger discrepancy invariants",
      "Row-level locking and optimistic concurrency controlling high-frequency transfers",
      "Comprehensive stress-tested database benchmarks under extreme network latency",
      "Interactive schema visualizer and SQL query optimization playground",
    ],
    tags: ["PostgreSQL", "SQL", "Database Design", "Transactions", "REST API", "Docker"],
    metrics: [
      { label: "Balance Discrepancy", value: "0.00%" },
      { label: "ACID Compliance", value: "Strict Level 4" },
      { label: "Stress Test TPS", value: "4,500 TPS" },
    ],
    techStack: ["PostgreSQL", "SQL", "PL/pgSQL", "Go", "Docker", "Prometheus", "Grafana"],
    image: assetUrls.valued,
    featured: false,
    githubUrl: "https://github.com/syedhanzala-Abrar",
    liveUrl: "https://fincore.syedhanzala.dev",
    color: "rgba(255, 179, 0, 0.15)",
    accentHex: "#ffb300",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    number: "01",
    title: "Frontend Engineering",
    tag: "Client-Side Craft",
    description: "Designing silky smooth, highly responsive, accessibility-first user interfaces with modern web standards.",
    items: [
      { name: "React 19 / 18", tag: "Core", detail: "Server Components, Hooks, Suspense, Concurrent Mode" },
      { name: "TypeScript / JavaScript", tag: "Language", detail: "Strict Typing, Generics, AST, Modern ESNext" },
      { name: "Next.js & Vite", tag: "Tooling", detail: "SSR, SSG, Edge Routing, Bundling & Tree Shaking" },
      { name: "Tailwind CSS & CSS Modules", tag: "Styling", detail: "Design Tokens, Fluid Typography, Glassmorphism" },
      { name: "Framer Motion & GSAP", tag: "Animation", detail: "Kinetic Typography, Scroll Parallax, SVG Physics" },
      { name: "HTML5 / Semantic / A11y", tag: "Standards", detail: "Screen Readers, ARIA Roles, Microdata, SEO" },
    ],
  },
  {
    number: "02",
    title: "Backend & Systems",
    tag: "Resilient Architectures",
    description: "Building secure, high-throughput microservices, REST APIs, and transactional data pipelines.",
    items: [
      { name: "RESTful APIs & GraphQL", tag: "Protocols", detail: "Clean Architecture, Rate Limiting, OpenAPI / Swagger" },
      { name: "Node.js & Express", tag: "Runtime", detail: "Event Loop Optimization, Streams, Middleware" },
      { name: "PostgreSQL & SQL", tag: "Relational", detail: "Complex Joins, Indexing, Transactions, Query Optimization" },
      { name: "MongoDB & NoSQL", tag: "Document", detail: "Aggregation Pipelines, Document Modeling, Sharding" },
      { name: "PHP & Modern Frameworks", tag: "Backend", detail: "Modular MVC, Dependency Injection, Composer" },
      { name: "Redis & Caching", tag: "In-Memory", detail: "Pub/Sub, In-Memory Caching, Distributed Locks" },
    ],
  },
  {
    number: "03",
    title: "AI, ML & Data Science",
    tag: "Intelligent Systems",
    description: "Applying modern machine learning models and data pipelines to solve real-world automation challenges.",
    items: [
      { name: "Python & Scientific Stack", tag: "Language", detail: "NumPy, Pandas, SciPy, Matplotlib, Seaborn" },
      { name: "Machine Learning (ML)", tag: "Algorithms", detail: "Supervised/Unsupervised, Regressions, Clustering, Trees" },
      { name: "PyTorch & Deep Learning", tag: "Framework", detail: "Neural Networks, Sequence Models, Embeddings" },
      { name: "Data Analytics & Mining", tag: "Pipelines", detail: "Exploratory Data Analysis, Feature Engineering" },
      { name: "Google Colab & Jupyter", tag: "Research", detail: "GPU Acceleration, Reproducible Research, Notebooks" },
      { name: "LLM Orchestration & Prompting", tag: "Applied AI", detail: "RAG Systems, Vector Search, Tool-Calling Agents" },
    ],
  },
  {
    number: "04",
    title: "DevOps, Tools & Workflow",
    tag: "Developer Ecosystem",
    description: "Ensuring frictionless continuous delivery, isolated environments, and clean collaborative version control.",
    items: [
      { name: "Git & GitHub Workflows", tag: "Version Control", detail: "Branching Strategies, CI/CD Actions, Code Reviews" },
      { name: "Linux & Bash Scripting", tag: "OS", detail: "Server Administration, Cron Jobs, Process Monitoring" },
      { name: "Postman & API Testing", tag: "Quality", detail: "Automated Test Suites, Mock Servers, Environments" },
      { name: "Docker & Containerization", tag: "Containers", detail: "Multi-stage Builds, Compose, Image Optimization" },
      { name: "XAMPP & Local Stacks", tag: "Environment", detail: "Virtual Hosts, Apache, MySQL Service Management" },
      { name: "Vite & Modern Build Tools", tag: "Bundler", detail: "Hot Module Replacement, Dynamic Imports, Rollup" },
    ],
  },
];

export const roadmapMilestones: Milestone[] = [
  {
    year: "2026",
    period: "PRESENT",
    title: "AI-Augmented Full Stack Engineering",
    organization: "Independent Lab / Open Source",
    role: "Full-Stack & Machine Learning Practitioner",
    description:
      "Deepening exploration into neuro-symbolic AI interfaces, real-time vector search systems, and high-performance WebGL/WebAudio creative web applications.",
    badge: "Active Focus",
    tags: ["React 19", "TypeScript", "PyTorch", "Next.js", "WebGL"],
  },
  {
    year: "2025",
    period: "Q3 - Q4",
    title: "ValuEd & IRIS Research Projects",
    organization: "EdTech & Cyber Labs",
    role: "System Architect & AI Developer",
    description:
      "Designed and launched ValuEd education pathway navigation platform and IRIS network threat clustering model with sub-second real-time inference.",
    badge: "Major Milestones",
    tags: ["FastAPI", "React", "Clustering ML", "PostgreSQL"],
  },
  {
    year: "2024",
    period: "Q1 - Q4",
    title: "Library & Banking Systems Architecture",
    organization: "Systems Development",
    role: "Full-Stack & Database Developer",
    description:
      "Engineered high-throughput relational data schemas, sub-5ms PostgreSQL transaction logic, and responsive digital library management systems.",
    badge: "Core Foundations",
    tags: ["SQL", "PostgreSQL", "REST APIs", "Node.js"],
  },
  {
    year: "2023",
    period: "FOUNDATION",
    title: "Computer Science & Software Foundations",
    organization: "Academic Journey",
    role: "Computer Science Scholar",
    description:
      "Mastered Data Structures, Algorithms, Object-Oriented Architecture, Relational Database Theory, and modern full-stack web engineering best practices.",
    badge: "Academic Honor",
    tags: ["Data Structures", "Algorithms", "Python", "C/C++", "Web Standards"],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Syed combines an exceptional eye for design aesthetics with rock-solid backend engineering. Working with him was effortless and the results spoke for themselves.",
    author: "Arjun Verma",
    role: "Product Lead",
    company: "Nexus Technologies",
    rating: 5,
  },
  {
    quote:
      "Rarely do you find a developer who can bridge the gap between machine learning models and pixel-perfect interactive web interfaces so seamlessly.",
    author: "Dr. Sarah Chen",
    role: "AI Research Advisor",
    company: "Cognitive Labs",
    rating: 5,
  },
  {
    quote:
      "The performance and attention to micro-animations in our data platform blew our users away. Syed's technical curiosity is truly unmatched.",
    author: "Farhan Qureshi",
    role: "Engineering Director",
    company: "Synergy Cloud",
    rating: 5,
  },
];
