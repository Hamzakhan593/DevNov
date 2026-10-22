import siteOverrides from './siteConfig.json' with { type: 'json' };

/**
 * DevNov static content store (Module 1).
 * Update this file to publish verified company, team, service and project content.
 * Never invent clients, testimonials, certifications, metrics or review scores.
 */

const agencyDefaults = {
  brandName: 'DevNov',
  legalName: '', // Add a verified legal business name, if applicable.
  headline: 'Thoughtful software. Built to move business forward.',
  summary: 'We design and develop web apps, mobile experiences, business software and AI-powered workflows.',
  audience: ['United States', 'United Kingdom', 'Europe', 'Pakistan'],
  email: '', // Add a verified inbox before enabling public contact CTAs.
  calendlyUrl: '',
  socialLinks: [], // Example: { id: 'github', label: 'GitHub', url: 'https://github.com/...' }
  navigation: [
    { id: 'work', label: 'Work', href: '#work' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'process', label: 'Process', href: '#process' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],
};

export const agency = { ...agencyDefaults, ...siteOverrides };

export const services = [
  {
    id: 'web-apps',
    title: 'Websites & Web Applications',
    description: 'Responsive marketing websites and custom web platforms.',
    capabilities: ['React', 'Next.js', 'ASP.NET Core'],
  },
  {
    id: 'business-software',
    title: 'Business Software',
    description: 'Purpose-built operational systems, dashboards and APIs.',
    capabilities: ['.NET', 'SQL Server', 'REST APIs'],
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Applications',
    description: 'Mobile-first product experiences for Android and beyond.',
    capabilities: ['Mobile UI', 'API integration', 'Product engineering'],
  },
  {
    id: 'ai-automation',
    title: 'AI & Workflow Automation',
    description: 'Assistants, intelligent workflows and practical AI integrations.',
    capabilities: ['AI integration', 'Automations', 'Chatbots'],
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    description: 'Reliable frontends, services and databases built together.',
    capabilities: ['MERN', 'Node.js', 'Database design'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Modernization',
    description: 'Improve, extend and support existing digital products.',
    capabilities: ['Refactoring', 'Performance', 'Deployment'],
  },
  {
    id: 'crm-erp',
    title: 'CRM & ERP Solutions',
    description: 'Organize customers, inventory, operations and team workflows in one connected system.',
    capabilities: ['CRM', 'ERP', 'Automation'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce & Booking',
    description: 'Build smooth online storefronts, reservation flows and secure checkout journeys.',
    capabilities: ['Online stores', 'Bookings', 'Payments'],
  },
  {
    id: 'product-design',
    title: 'Product Strategy & UI/UX',
    description: 'Turn ideas into polished wireframes, prototypes and intuitive product interfaces.',
    capabilities: ['UX research', 'Figma', 'Prototyping'],
  },
  {
    id: 'api-integrations',
    title: 'API & Platform Integrations',
    description: 'Connect apps, third-party systems, payment providers and business tools.',
    capabilities: ['REST APIs', 'Webhooks', 'Integrations'],
  },
  {
    id: 'analytics',
    title: 'Reporting & Dashboards',
    description: 'Make business information easier to act on with tailored reports and dashboards.',
    capabilities: ['Analytics', 'Data visualization', 'SQL'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud, Hosting & DevOps',
    description: 'Prepare applications for deployment, hosting, monitoring and ongoing maintenance.',
    capabilities: ['Azure', 'VPS', 'CI/CD'],
  },
];

export const technologies = [
  { id: 'dotnet', label: 'ASP.NET Core', category: 'Backend' },
  { id: 'react', label: 'React', category: 'Frontend' },
  { id: 'next', label: 'Next.js', category: 'Frontend' },
  { id: 'node', label: 'Node.js', category: 'Backend' },
  { id: 'mongo', label: 'MongoDB', category: 'Database' },
  { id: 'sql', label: 'SQL Server', category: 'Database' },
  { id: 'python', label: 'Python', category: 'AI / Backend' },
];

// Add ONLY actual projects, with approved screenshots, verifiable links and real descriptions.
// Shape: { id, slug, title, summary, category, technologies: [], image: '/projects/file.webp', liveUrl: '', repositoryUrl: '', featured: true }
export const projects = [];

// Add genuine owner/team profiles only after confirming bio, job title and image permissions.
// Shape: { id, name, role, summary, image: '/team/file.webp', links: [] }
export const team = [];

// Do not fabricate social proof.
// Shape: { id, quote, client, role, company, permissionGranted: true }
export const testimonials = [];

export const processSteps = [
  { id: 'discover', title: 'Discover', description: 'Understand the business goal and scope.' },
  { id: 'plan', title: 'Plan', description: 'Define milestones, architecture and outcomes.' },
  { id: 'build', title: 'Build', description: 'Implement, review and refine.' },
  { id: 'launch', title: 'Launch', description: 'Verify deployment and hand over.' },
];

export const faq = [
  {
    id: 'services',
    question: 'What can DevNov build?',
    answer: 'We work on websites, web applications, business systems, mobile applications, and AI-powered automation.',
  },
  {
    id: 'start',
    question: 'How does a project start?',
    answer: 'We begin by reviewing the goal, constraints, priorities, and expected deliverables.',
  },
];

export const contact = {
  provider: 'web3forms', // Planned, not connected in Module 1.
  accessKey: '', // Later supplied from a public VITE_ env variable for Web3Forms.
  successMessage: 'Thanks for reaching out. We will respond as soon as possible.',
};