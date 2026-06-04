export const personal = {
  name: 'Housein Monzer',
  title: 'Full-Stack Web Developer',
  roles: ['Full-Stack Developer', 'React + TypeScript', 'WordPress Expert', 'IT Support Specialist'],
  location: 'Beirut, Lebanon',
  email: 'houseinmonzer@proton.me',
  phone: '+961 81 960 352',
  linkedin: 'https://www.linkedin.com/in/housein-monzer-4b5a7a246/',
  github: 'https://github.com/HouseinMonzer',
  cv: '/Housein_Monzer_CV.pdf',
  summary:
    'Computer Science graduate building production web applications with React, TypeScript, and PostgreSQL. Currently shipping SouQna, a multi-vendor marketplace for Lebanon. Two years of WordPress development at Synctale and a working foundation in IT support and networking from hands-on practice and Google certifications.',
}

export const skillCategories = [
  {
    title: 'Web Development & CMS',
    icon: '🌐',
    skills: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Zustand', 'WordPress', 'PHP', 'ASP.NET'],
  },
  {
    title: 'Backend & Databases',
    icon: '🗄️',
    skills: ['Node.js', 'Prisma', 'PostgreSQL (Neon)', 'MySQL', 'JWT Auth', 'REST APIs'],
  },
  {
    title: 'Programming & Scripting',
    icon: '💻',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C'],
  },
  {
    title: 'UI/UX & Design',
    icon: '🎨',
    skills: ['Figma', 'Canva', 'Responsive Design'],
  },
  {
    title: 'Networking & Systems',
    icon: '🔌',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'LAN/WAN', 'VLANs', 'Router & Switch Config'],
  },
  {
    title: 'Tools & Platforms',
    icon: '🛠️',
    skills: ['Git', 'GitHub', 'Netlify', 'UNIX', 'Microsoft Office'],
  },
]

export const experience = [
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
    image: '/souqna-preview.png',
    live: null,
    code: null,
    featured: true,
    status: 'Coming Soon',
  },
  {
    name: 'Synctale Client Sites',
    tagline: 'WordPress development at scale',
    description:
      'Designed, built, and maintained responsive WordPress sites for Synctale clients over two years. Theme customization, plugin integration, on-page SEO, and load-time optimization across the portfolio.',
    tags: ['WordPress', 'PHP', 'SEO', 'CSS'],
    live: null,
    code: null,
  },
  {
    name: 'Restaurant Reservation System',
    tagline: 'PHP + MySQL full-stack site',
    description:
      'Restaurant website with menu management, a reservation flow, and mobile-first responsive design. Backed by a MySQL schema and a custom PHP admin panel.',
    tags: ['PHP', 'MySQL', 'HTML', 'CSS'],
    live: null,
    code: null,
  },
  {
    name: 'Networking Lab Configurations',
    tagline: 'Hands-on routing, VLANs, DHCP/DNS',
    description:
      'Designed and simulated virtual networks in GNS3 and Packet Tracer covering TCP/IP, DHCP, DNS, VLANs, and routing. Configured home/office LAN/WAN setups end-to-end as part of IT support training.',
    tags: ['GNS3', 'Packet Tracer', 'TCP/IP', 'DHCP', 'VLANs'],
    live: null,
    code: null,
  },
]

export const education = [
  {
    degree: 'Bachelor of Science (BSc) in Computer Science',
    institution: 'Lebanese University – Faculty of Science (Hadat)',
    period: '2021 – 2024',
    icon: '🎓',
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
