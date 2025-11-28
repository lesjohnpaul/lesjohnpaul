// Portfolio Data - Customize this file with your actual information

export const personalInfo = {
  name: "Les John Paul Oliver",
  title: "IT Expert & Software Engineer",
  tagline: "Building systems that scale. Crafting solutions that matter.",
  email: "contact@yoursite.com",
  location: "Philippines",
  availability: "Available for select projects",
  resumeUrl: "/resume.pdf",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
};

export const heroStats = [
  { label: "Years Experience", value: "8+" },
  { label: "Projects Delivered", value: "50+" },
  { label: "Cloud Migrations", value: "25+" },
  { label: "Systems Optimized", value: "100+" },
];

export const coreSkills = [
  {
    category: "Cloud Engineering",
    icon: "Cloud",
    description: "Architecting scalable cloud infrastructure on AWS, GCP, and Azure",
    skills: ["AWS", "Google Cloud", "Azure", "Terraform", "Kubernetes", "Docker", "CI/CD", "CloudFormation"],
    highlight: true,
  },
  {
    category: "Database Administration",
    icon: "Database",
    description: "Optimizing data systems for performance, reliability, and scale",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Database Design", "Query Optimization", "Data Migration"],
    highlight: true,
  },
  {
    category: "Full Stack Development",
    icon: "Code",
    description: "Building end-to-end solutions with modern frameworks",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "FastAPI", "REST APIs", "GraphQL"],
    highlight: false,
  },
  {
    category: "System Architecture",
    icon: "Layers",
    description: "Designing robust, maintainable, and scalable systems",
    skills: ["Microservices", "Event-Driven", "Domain-Driven Design", "System Design", "API Design", "Performance Optimization"],
    highlight: false,
  },
  {
    category: "AI & Automation",
    icon: "Brain",
    description: "Leveraging AI to build intelligent, automated solutions",
    skills: ["OpenAI APIs", "LangChain", "Machine Learning", "Process Automation", "Intelligent Workflows", "Data Processing"],
    highlight: true,
  },
];

export const hiddenTalents = [
  {
    category: "Music Production",
    icon: "Music",
    description: "Composing, arranging, and producing original music",
    skills: ["Music Composition", "Audio Engineering", "DAW (Ableton/FL Studio)", "Sound Design", "Mixing & Mastering"],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Visual Art",
    icon: "Palette",
    description: "Creating visual experiences and digital artwork",
    skills: ["Digital Art", "Graphic Design", "UI/UX Design", "Photography", "Video Editing"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Digital Marketing",
    icon: "TrendingUp",
    description: "Driving growth through strategic digital campaigns",
    skills: ["SEO", "Content Strategy", "Social Media", "Analytics", "Conversion Optimization"],
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Entrepreneurship",
    icon: "Rocket",
    description: "Building and scaling ventures from zero to one",
    skills: ["Business Development", "Product Strategy", "Team Leadership", "Venture Building", "Market Analysis"],
    color: "from-orange-500 to-amber-500",
  },
  {
    category: "Workflow Automation",
    icon: "Workflow",
    description: "Connecting systems and automating complex processes",
    skills: ["n8n", "Zapier", "Make.com", "API Integration", "Process Optimization", "Custom Integrations"],
    color: "from-red-500 to-rose-500",
  },
];

export const experience = [
  {
    role: "Senior Software Engineer",
    company: "Company Name",
    period: "2022 - Present",
    description: "Leading cloud infrastructure and backend development initiatives",
    achievements: [
      "Architected multi-region AWS infrastructure serving 1M+ users",
      "Reduced database query times by 80% through optimization",
      "Implemented CI/CD pipelines reducing deployment time by 70%",
    ],
  },
  {
    role: "Cloud Engineer",
    company: "Previous Company",
    period: "2019 - 2022",
    description: "Managed cloud migrations and DevOps practices",
    achievements: [
      "Led migration of 50+ services to Kubernetes",
      "Designed disaster recovery systems with 99.99% uptime",
      "Built monitoring and alerting systems using Prometheus/Grafana",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "Earlier Company",
    period: "2016 - 2019",
    description: "Developed web applications and APIs",
    achievements: [
      "Built e-commerce platform processing $2M+ annually",
      "Developed real-time collaboration features using WebSockets",
      "Created automated testing suite with 95% coverage",
    ],
  },
];

export const projects = [
  {
    title: "Cloud Migration Platform",
    description: "Automated cloud migration tool that helped enterprises move to AWS with zero downtime",
    tech: ["AWS", "Terraform", "Python", "React"],
    link: "#",
    image: "/images/projects/project1.jpg",
    featured: true,
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "High-performance analytics system processing 10M+ events daily",
    tech: ["Kafka", "ClickHouse", "Next.js", "D3.js"],
    link: "#",
    image: "/images/projects/project2.jpg",
    featured: true,
  },
  {
    title: "AI-Powered Workflow Engine",
    description: "Intelligent automation platform using LLMs for business process optimization",
    tech: ["OpenAI", "LangChain", "FastAPI", "PostgreSQL"],
    link: "#",
    image: "/images/projects/project3.jpg",
    featured: true,
  },
];

export const photoGallery = [
  {
    src: "/images/gallery/speaking-1.jpg",
    alt: "Speaking at tech conference",
    category: "speaking",
    caption: "Tech Conference 2024",
  },
  {
    src: "/images/gallery/office-1.jpg",
    alt: "Working at the office",
    category: "work",
    caption: "Building the future",
  },
  {
    src: "/images/gallery/deployment-1.jpg",
    alt: "Server deployment",
    category: "deployment",
    caption: "Infrastructure deployment",
  },
  {
    src: "/images/gallery/music-1.jpg",
    alt: "Music production session",
    category: "creative",
    caption: "Late night production",
  },
  {
    src: "/images/gallery/team-1.jpg",
    alt: "Team collaboration",
    category: "work",
    caption: "Team planning session",
  },
  {
    src: "/images/gallery/performance-1.jpg",
    alt: "Live performance",
    category: "creative",
    caption: "Live performance",
  },
];

export const testimonials = [
  {
    quote: "One of the most talented engineers I've worked with. Delivers exceptional results consistently.",
    author: "John Doe",
    role: "CTO, Tech Company",
    avatar: "/images/testimonials/person1.jpg",
  },
  {
    quote: "Transformed our infrastructure and reduced costs by 40% while improving performance.",
    author: "Jane Smith",
    role: "VP Engineering, Startup",
    avatar: "/images/testimonials/person2.jpg",
  },
];

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "#contact" },
];
