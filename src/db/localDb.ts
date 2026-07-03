import fs from 'fs';
import path from 'path';
import { 
  User, 
  Resume, 
  ResumeVersion, 
  AIHistoryLog, 
  DownloadLog, 
  DashboardStats,
  ResumeData
} from '../types.ts';

const DB_FILE = path.join(process.cwd(), 'src/db/db.json');

interface DatabaseSchema {
  users: User[];
  resumes: Resume[];
  resumeVersions: ResumeVersion[];
  aiHistory: AIHistoryLog[];
  downloads: DownloadLog[];
  templates: { id: string; name: string; description: string; category: string }[];
}

const DEFAULT_RESUME_DATA: ResumeData = {
  personalInformation: {
    firstName: "Amit",
    lastName: "Gupta",
    fullName: "Amit Gupta",
    email: "Akgupta2870@gmail.com",
    phone: "+1 (555) 234-5678",
    address: "123 Tech Boulevard",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94107",
    linkedin: "linkedin.com/in/amit-gupta",
    github: "github.com/amit-gupta",
    portfolio: "amitgupta.dev",
    website: "amitgupta.dev"
  },
  professionalSummary: "Results-driven Senior Full Stack Engineer and AI Solutions Architect with 6+ years of experience designing scalable web architectures and integrating Gemini/OpenAI models. Expert in React, Node.js, and TypeScript with a track record of driving 35% improvements in rendering and application performance.",
  skills: {
    frontend: ["React 19", "TypeScript", "Next.js 15", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Express.js", "GraphQL", "REST APIs"],
    database: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
    cloud: ["Google Cloud Platform", "AWS", "Vercel"],
    devops: ["Docker", "CI/CD", "GitHub Actions"],
    languages: ["JavaScript", "Python", "SQL", "HTML/CSS"],
    frameworks: ["Vite", "NextAuth", "Zod"],
    tools: ["Git", "Webpack", "Figma"],
    others: ["LLMs", "Retrieval-Augmented Generation (RAG)", "Vector Databases"]
  },
  experience: [
    {
      id: "exp-1",
      company: "Innovate AI",
      designation: "Senior AI Solutions Engineer",
      employmentType: "Full-time",
      location: "San Francisco, CA (Hybrid)",
      startDate: "2024-01",
      endDate: "Present",
      currentlyWorking: true,
      technologies: ["React", "TypeScript", "Google GenAI SDK", "Node.js"],
      responsibilities: [
        "Architected an AI-driven resume optimization engine that processes 5,000+ files daily using Gemini models, improving processing speed by 40%.",
        "Designed reusable, responsive component architectures in React 19 and Tailwind CSS, resulting in a 25% reduction in page load times.",
        "Created scalable serverless Express API proxy layers that keep secure key authentication off client bundles."
      ],
      achievements: [
        "Successfully launched 3 core generative AI web micro-services that scaled to 20,000 active monthly users in 6 months.",
        "Earned Employee of the Quarter in Q3 2024 for outstanding technical execution."
      ]
    },
    {
      id: "exp-2",
      company: "CloudCore Systems",
      designation: "Software Engineer II",
      employmentType: "Full-time",
      location: "Austin, TX (Remote)",
      startDate: "2021-06",
      endDate: "2023-12",
      currentlyWorking: false,
      technologies: ["Node.js", "Express", "PostgreSQL", "Docker"],
      responsibilities: [
        "Maintained and optimized low-latency database queries in PostgreSQL, resolving database deadlocks and saving $15k in cloud computing costs.",
        "Built responsive full-stack dashboards using React, which consolidated 12 separate logging interfaces into a single pane of glass.",
        "Integrated secure authentication protocols and automated lint/compile check hooks in CI/CD pipeline."
      ],
      achievements: [
        "Automated deployment workflows via Docker and GitHub Actions, slashing deployment cycle times from 2 hours to 8 minutes.",
        "Mentored 4 junior engineers on clean code guidelines and TypeScript best practices."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "ATS Optimizer & Tracker",
      description: "A full-stack SaaS application that parses resume PDFs, scores them against customized job descriptions, and highlights missing keywords with visual charts.",
      technologies: ["React", "Tailwind CSS", "Gemini 3.5 Flash", "Express"],
      github: "github.com/amit-gupta/ats-optimizer",
      liveDemo: "ats-optimizer.amitgupta.dev",
      features: [
        "Full-screen side-by-side editing pane with live HTML rendering and print layout pagination.",
        "Real-time ATS analysis of missing keywords, action verbs, and formatting scores.",
        "Instant PDF/DOCX/HTML file generation with dynamic templates."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science",
      college: "University of California, Berkeley",
      university: "UC Berkeley",
      year: "2021",
      cgpa: "3.85 / 4.0"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate",
    "Google Cloud Professional Cloud Architect"
  ],
  achievements: [
    "Hackathon Champion (1st Place out of 120 teams) at Berkeley Tech Innovate 2020",
    "Open Source Contributor: Maintained minor modules in React PDF Renderer"
  ],
  languagesKnown: [
    "English (Fluent)",
    "Hindi (Native)",
    "Spanish (Conversational)"
  ],
  interests: [
    "Generative Art",
    "Open Source Contributing",
    "Backpacking & Hiking"
  ],
  references: [
    "Available upon request"
  ]
};

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: "user-default",
      email: "Akgupta2870@gmail.com",
      name: "Amit Gupta",
      createdAt: new Date().toISOString()
    }
  ],
  resumes: [
    {
      id: "resume-default",
      title: "Amit's Tech Resume",
      userId: "user-default",
      data: DEFAULT_RESUME_DATA,
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 days ago
      updatedAt: new Date().toISOString()
    }
  ],
  resumeVersions: [
    {
      id: "ver-1",
      resumeId: "resume-default",
      version: 1,
      data: DEFAULT_RESUME_DATA,
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    }
  ],
  aiHistory: [
    {
      id: "ai-log-1",
      userId: "user-default",
      resumeId: "resume-default",
      feature: "parse",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      id: "ai-log-2",
      userId: "user-default",
      resumeId: "resume-default",
      feature: "improve-summary",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "ai-log-3",
      userId: "user-default",
      resumeId: "resume-default",
      feature: "ats-score",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  downloads: [
    {
      id: "down-1",
      resumeId: "resume-default",
      format: "pdf",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: "down-2",
      resumeId: "resume-default",
      format: "docx",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ],
  templates: [
    { id: 'modern', name: 'Modern Minimal', description: 'Clean display typography with high readability and balanced borders.', category: 'Tech/Creative' },
    { id: 'professional', name: 'Professional Executive', description: 'Classic sidebar with balanced layout for business operations.', category: 'Corporate' },
    { id: 'minimal', name: 'Classic Minimalist', description: 'Symmetrical structure emphasizing vertical lines and pristine tracking.', category: 'Academic/General' },
    { id: 'creative', name: 'Creative Designer', description: 'Slightly playful headings, left vertical rule, and custom accent colors.', category: 'Marketing/Design' },
    { id: 'corporate', name: 'SaaS Corporate', description: 'High contrast headers with clean horizontal sections, extremely professional.', category: 'Executive' },
    { id: 'ats', name: 'Strict ATS Compliant', description: 'Optimal baseline single-column grid, zero icons or columns, absolute parsed-friendly.', category: 'ATS Standard' }
  ]
};

// Ensure parent dir exists and read/write the JSON DB file
export class LocalDB {
  private static initDB() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
    }
  }

  private static read(): DatabaseSchema {
    this.initDB();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to read database file, restoring defaults.", e);
      return INITIAL_DB;
    }
  }

  private static write(db: DatabaseSchema) {
    this.initDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }

  // --- Users API ---
  static getUsers(): User[] {
    return this.read().users;
  }

  static getOrCreateUser(email: string, name: string): User {
    const db = this.read();
    let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email: email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      this.write(db);
    }
    return user;
  }

  // --- Resumes API ---
  static getResumes(userId: string): Resume[] {
    return this.read().resumes.filter(r => r.userId === userId);
  }

  static getResume(id: string): Resume | null {
    return this.read().resumes.find(r => r.id === id) || null;
  }

  static createResume(userId: string, title: string, data: ResumeData): Resume {
    const db = this.read();
    const resume: Resume = {
      id: `resume-${Date.now()}`,
      title,
      userId,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.resumes.push(resume);
    
    // Save initial version
    const version: ResumeVersion = {
      id: `ver-${Date.now()}`,
      resumeId: resume.id,
      version: 1,
      data: JSON.parse(JSON.stringify(data)),
      createdAt: new Date().toISOString()
    };
    db.resumeVersions.push(version);

    this.write(db);
    return resume;
  }

  static updateResume(id: string, data: ResumeData, title?: string): Resume {
    const db = this.read();
    const index = db.resumes.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Resume with ID ${id} not found.`);
    }

    const original = db.resumes[index];
    db.resumes[index] = {
      ...original,
      title: title || original.title,
      data,
      updatedAt: new Date().toISOString()
    };

    // Auto-save a new version if data changed noticeably (or simple version increment)
    // To keep it simple, we save a history version limit of last 10 versions
    const history = db.resumeVersions.filter(v => v.resumeId === id);
    const nextVerNumber = history.length > 0 ? Math.max(...history.map(h => h.version)) + 1 : 1;
    
    const newVersion: ResumeVersion = {
      id: `ver-${Date.now()}`,
      resumeId: id,
      version: nextVerNumber,
      data: JSON.parse(JSON.stringify(data)),
      createdAt: new Date().toISOString()
    };
    db.resumeVersions.push(newVersion);

    // Keep only last 15 versions
    const filteredVersions = db.resumeVersions.filter(v => v.resumeId !== id)
      .concat(
        db.resumeVersions.filter(v => v.resumeId === id)
          .sort((a,b) => b.version - a.version)
          .slice(0, 15)
      );
    db.resumeVersions = filteredVersions;

    this.write(db);
    return db.resumes[index];
  }

  static deleteResume(id: string) {
    const db = this.read();
    db.resumes = db.resumes.filter(r => r.id !== id);
    db.resumeVersions = db.resumeVersions.filter(v => v.resumeId !== id);
    this.write(db);
  }

  // --- Resume Versions API ---
  static getVersions(resumeId: string): ResumeVersion[] {
    return this.read().resumeVersions
      .filter(v => v.resumeId === resumeId)
      .sort((a, b) => b.version - a.version);
  }

  static restoreVersion(resumeId: string, versionId: string): Resume {
    const db = this.read();
    const ver = db.resumeVersions.find(v => v.id === versionId && v.resumeId === resumeId);
    if (!ver) {
      throw new Error(`Version ${versionId} not found.`);
    }

    const index = db.resumes.findIndex(r => r.id === resumeId);
    if (index === -1) {
      throw new Error(`Resume ${resumeId} not found.`);
    }

    db.resumes[index].data = JSON.parse(JSON.stringify(ver.data));
    db.resumes[index].updatedAt = new Date().toISOString();
    this.write(db);

    return db.resumes[index];
  }

  // --- AI Logs & Analytics ---
  static logAIUsage(userId: string, resumeId: string, feature: string, prompt?: string, result?: string) {
    const db = this.read();
    db.aiHistory.push({
      id: `ai-log-${Date.now()}`,
      userId,
      resumeId,
      feature,
      prompt,
      result: result ? result.substring(0, 200) + '...' : undefined,
      createdAt: new Date().toISOString()
    });
    this.write(db);
  }

  static logDownload(resumeId: string, format: string) {
    const db = this.read();
    db.downloads.push({
      id: `down-${Date.now()}`,
      resumeId,
      format,
      createdAt: new Date().toISOString()
    });
    this.write(db);
  }

  static getDashboardStats(): DashboardStats {
    const db = this.read();
    
    // Compute AI feature counts
    const aiCounts: { [key: string]: number } = {};
    db.aiHistory.forEach(log => {
      aiCounts[log.feature] = (aiCounts[log.feature] || 0) + 1;
    });

    // Create recent activity lists
    const recentActivity: any[] = [];
    
    // Add upload logs
    db.resumes.slice(-3).forEach(r => {
      recentActivity.push({
        id: `act-u-${r.id}`,
        type: 'upload',
        description: `New resume created: "${r.title}"`,
        timestamp: r.createdAt
      });
    });

    // Add AI improvements
    db.aiHistory.slice(-5).forEach(h => {
      recentActivity.push({
        id: `act-h-${h.id}`,
        type: 'improve',
        description: `AI ${h.feature.replace('-', ' ')} executed`,
        timestamp: h.createdAt
      });
    });

    // Add downloads
    db.downloads.slice(-4).forEach(d => {
      recentActivity.push({
        id: `act-d-${d.id}`,
        type: 'download',
        description: `Resume downloaded as ${d.format.toUpperCase()}`,
        timestamp: d.createdAt
      });
    });

    // Sort activity by descending timestamp
    const sortedActivity = recentActivity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalResumes: db.resumes.length,
      totalParsed: db.aiHistory.filter(h => h.feature === 'parse').length + db.resumes.length,
      totalDownloads: db.downloads.length,
      aiFeatureUsage: aiCounts,
      recentActivity: sortedActivity
    };
  }
}
