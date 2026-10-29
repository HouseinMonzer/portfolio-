export const personal = {
  name: 'Housein Monzer',
  title: 'Full-Stack Developer & AI Visual Creator',
  roles: ['Full-Stack Developer', 'AI Visual Creator', 'React + TypeScript Engineer', 'WordPress Developer'],
  location: 'Lebanon',
  email: 'houseinmonzer@proton.me',
  phone: '+961 81 960 352',
  linkedin: 'https://www.linkedin.com/in/housein-monzer-4b5a7a246/',
  github: 'https://github.com/HouseinMonzer',
  cv: '/Housein_Monzer_CV.pdf',
  summary:
    'Computer Science graduate building production web applications with React, TypeScript and PostgreSQL, and creating AI-powered product imagery, ad visuals and social content for online stores and brands. Currently shipping SouQna, a multi-vendor marketplace for Lebanon, after two years of WordPress development at Synctale.',
}

export type SkillIcon = 'globe' | 'database' | 'code' | 'palette' | 'camera' | 'network' | 'wrench'

export const skillCategories: { title: string; icon: SkillIcon; skills: string[] }[] = [
  {
    title: 'Web Development & CMS',
    icon: 'globe',
    skills: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Zustand', 'WordPress', 'PHP', 'ASP.NET'],
  },
  {
    title: 'Backend & Databases',
    icon: 'database',
    skills: ['Node.js', 'Prisma', 'PostgreSQL (Neon)', 'MySQL', 'JWT Auth', 'REST APIs'],
  },
  {
    title: 'Programming & Scripting',
    icon: 'code',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C'],
  },
  {
    title: 'UI/UX & Design',
    icon: 'palette',
    skills: ['Figma', 'Canva', 'Responsive Design'],
  },
  {
    title: 'AI Visuals & Creative',
    icon: 'camera',
    skills: ['AI Product Imagery', 'Creative Direction', 'Storyboarding', 'Video Prompts (JSON)', 'Photo Retouching', 'Print Layout'],
  },
  {
    title: 'Networking & Systems',
    icon: 'network',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'LAN/WAN', 'VLANs', 'Router & Switch Config'],
  },
  {
    title: 'Tools & Platforms',
    icon: 'wrench',
    skills: ['Git', 'GitHub', 'Netlify', 'UNIX', 'Microsoft Office'],
  },
]

export const experience = [
  {
    role: 'Freelance Developer & AI Visual Creator',
    company: 'Self-employed',
    location: 'Lebanon',
    period: 'July 2024 – Present',
    bullets: [
      'Delivered alitheinsurer.com — a trilingual (EN/AR/FR) marketing site for a licensed insurance consultant, from design to production on Vercel.',
      'Building SouQna, a multi-vendor marketplace for Lebanon: React + TypeScript front end, Node.js/Prisma/Neon Postgres backend, JWT auth.',
      'Creating AI product imagery, social media campaigns and video storyboards for online stores and brands.',
      'Handling the full project cycle solo: client requirements, UI/UX, development, deployment, and post-launch support.',
    ],
  },
  {
    role: 'Web Developer',
    company: 'Synctale',
    location: 'Lebanon',
    period: 'October 2023 – June 2025',
    bullets: [
      'Developed and maintained responsive WordPress websites aligned with SEO best practices.',
      'Collaborated with design and content teams to launch new features and improve UX.',
      'Optimized page speed and performance, reducing load time significantly.',
      'Troubleshot and resolved bugs to ensure consistent website uptime.',
    ],
  },
]

export type Project = {
  name: string
  tagline?: string
  description: string
  tags: string[]
  image?: string
  live?: string | null
  code?: string | null
  featured?: boolean
  status?: string
}

export const projects: Project[] = [
  {
    name: 'SouQna',
    tagline: "Lebanon's multi-vendor marketplace",
    description:
      'Full-stack marketplace where local vendors run their own shops, list products, and manage orders. Vendor dashboard with full CRUD, product/shop/cart pages, and custom JWT auth handled through a Zustand store. Built end-to-end on a modern TypeScript stack with Prisma + Neon Postgres on the backend.',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Zustand', 'Node.js', 'Prisma', 'Neon Postgres', 'JWT'],
    image: '/souqna-preview.webp',
    live: 'https://souqna-smoky.vercel.app/',
    code: null,
    featured: true,
    status: 'In Development',
  },
  {
    name: 'Ali The Insurer',
    tagline: 'Trilingual insurance consultant site',
    description:
      'Marketing website for a licensed Lebanese insurance & financial consultant. Trilingual (English / Arabic / French) with RTL support, a clear Services + FAQ + testimonials layout, and conversion-focused CTAs (Get a Quote, WhatsApp, Instagram). Built as a fast single-page site and deployed on Vercel.',
    tags: ['React', 'Vite', 'TailwindCSS', 'Responsive', 'Multilingual (EN / AR / FR)'],
    image: '/ali.webp',
    live: 'https://alitheinsurer.com/',
    code: null,
    featured: true,
    status: 'Live',
  },
]

// Live WordPress client sites built & maintained during 2 years at Synctale.
export const wordpressSites = [
  { name: 'Ain Wazein Medical Village', tag: 'Healthcare', url: 'https://awmv.org/', image: '/WORDPRESS/AINWZEIN.webp' },
  { name: 'Al Synapse', tag: 'Corporate', url: 'https://al-synapse.com/al-synapse/', image: '/WORDPRESS/alsynapse.webp' },
  { name: 'Casa de Richela', tag: 'Brand', url: 'https://casaderichela.com/', image: '/WORDPRESS/casa.webp' },
  { name: 'Safenet Insurance', tag: 'Insurance brokerage', url: 'https://safenetadvisor.com/', image: '/WORDPRESS/safnet.webp' },
  { name: 'Sterling Bros', tag: 'Investment · UK', url: 'https://sterlingbros.co.uk/', image: '/WORDPRESS/sterling.webp' },
  { name: 'Sanadi', tag: 'Home healthcare', url: 'https://sanadilb.com/', image: '/WORDPRESS/Sanadi.webp' },
]

export const education = [
  {
    degree: 'Bachelor of Science (BSc) in Computer Science',
    institution: 'Lebanese University – Faculty of Science (Hadat)',
    period: '2021 – 2024',
  },
]

export const certifications = [
  {
    name: 'Technical Support Fundamentals',
    issuer: 'Google',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'The Bits and Bytes of Computer Networking',
    issuer: 'Google',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Operating Systems and You: Becoming a Power User',
    issuer: 'Google',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Introduction to CRM with HubSpot',
    issuer: 'Coursera',
    color: 'from-orange-500 to-pink-500',
  },
  {
    name: 'Customer Relationship Management (CRM)',
    issuer: 'Edrak',
    color: 'from-purple-500 to-violet-500',
  },
]

export const languages = [
  { name: 'Arabic', level: 'Native', percent: 100 },
  { name: 'English', level: 'Good Working Knowledge', percent: 75 },
  { name: 'French', level: 'Basic', percent: 30 },
]

// ── Derived stats (computed from the data above so they never go stale) ──
const CAREER_START = new Date(2023, 9, 1) // Synctale, October 2023
export const yearsExperience = Math.max(1, Math.floor((Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 3600 * 1000)))

export const stats = [
  { value: yearsExperience, suffix: '+', label: 'Years shipping for clients' },
  { value: projects.length + wordpressSites.length, suffix: '+', label: 'Live sites delivered' },
  { value: certifications.length, suffix: '', label: 'Certifications' },
  { value: languages.length, suffix: '', label: 'Languages spoken' },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Web Work' },
  { id: 'visuals', label: 'Visuals' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/** Every section in page order (the command palette lists all of them). */
export const sectionLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Web Work' },
  { id: 'visuals', label: 'Visual Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
