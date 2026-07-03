import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Download, 
  ChevronRight, 
  ArrowLeft,
  Layout,
  RefreshCw,
  Clock,
  Check,
  Cpu,
  Sun,
  Moon,
  Cloud,
  Share2,
  Trash2,
  Save,
  FileEdit,
  Info,
  ExternalLink,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

// Firebase Cloud Helpers
import { getFirebaseDB, saveResumeToFirebase, getResumeFromFirebase, syncUserResumeToFirebase } from './firebase.ts';

// Components
import LandingPage from './components/LandingPage.tsx';
import ResumeForm from './components/ResumeForm.tsx';
import ResumePreview from './components/ResumePreview.tsx';
import AISuite from './components/AISuite.tsx';
import DashboardStats from './components/DashboardStats.tsx';
import VersionHistory from './components/VersionHistory.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AdDownloadGate from './components/AdDownloadGate.tsx';
import ProfessionHelper from './components/ProfessionHelper.tsx';

// Theme maps for active state controls
const themeGradients: Record<string, string> = {
  indigo: "from-indigo-500 via-purple-500 to-pink-500",
  emerald: "from-emerald-500 via-teal-500 to-cyan-500",
  rose: "from-rose-500 via-pink-500 to-red-500",
  amber: "from-amber-500 via-orange-500 to-yellow-500",
  slate: "from-slate-500 via-slate-600 to-zinc-500",
  violet: "from-violet-500 via-fuchsia-500 to-purple-500",
};

const themeTextColors: Record<string, string> = {
  indigo: "text-indigo-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400",
  amber: "text-amber-400",
  slate: "text-slate-400",
  violet: "text-violet-400",
};

const themeSelectionStyles: Record<string, string> = {
  indigo: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  slate: "bg-slate-500/10 border-slate-500/30 text-slate-400",
  violet: "bg-violet-500/10 border-violet-500/30 text-violet-400",
};

const themeButtonStyles: Record<string, string> = {
  indigo: "bg-indigo-600 hover:bg-indigo-700",
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  rose: "bg-rose-600 hover:bg-rose-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  slate: "bg-slate-600 hover:bg-slate-700",
  violet: "bg-violet-600 hover:bg-violet-700",
};

const themeSelectionBg: Record<string, string> = {
  indigo: "bg-indigo-600",
  emerald: "bg-emerald-600",
  rose: "bg-rose-600",
  amber: "bg-amber-600",
  slate: "bg-slate-600",
  violet: "bg-violet-600",
};

// Types
import { ResumeData, DashboardStats as StatsType, ArchivedResume } from './types.ts';

// Detailed predefined resume mock payload for Ashish Gupta
const DEFAULT_ASHISH_RESUME: ResumeData = {
  personalInformation: {
    fullName: "Ashish Gupta",
    firstName: "Ashish",
    lastName: "Gupta",
    email: "Akgupta2870@gmail.com",
    phone: "+1 (555) 345-6789",
    address: "456 Silicon Valley Blvd",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94107",
    linkedin: "linkedin.com/in/ashishgupta-dev",
    github: "github.com/ashishgupta-dev",
    portfolio: "ashishgupta.engineering",
    website: "ashishgupta.engineering"
  },
  professionalSummary: "Innovative Senior Full-Stack Architect and Solutions Engineer with 8+ years of expertise in building enterprise-scale SaaS web architectures. Highly specialized in React 19, TypeScript, Node.js microservices, and high-performance server-side data processing. Proven success leading agile developer teams, optimizing cloud infrastructure costs, and integrating cutting-edge large language models to maximize efficiency.",
  skills: {
    frontend: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Zustand", "HTML5/CSS3"],
    backend: ["Node.js", "Express", "GraphQL", "REST APIs", "gRPC Services"],
    database: ["PostgreSQL", "MongoDB", "Redis Cache", "Drizzle ORM", "Prisma"],
    cloud: ["AWS (S3, EC2, Lambda)", "Google Cloud Platform", "Docker Containerization"],
    devops: ["Kubernetes", "CI/CD (GitHub Actions)", "Terraform IaC", "Nginx Proxy"],
    languages: ["TypeScript", "JavaScript", "Python", "SQL", "Go"],
    frameworks: ["Vite", "NextAuth", "Framer Motion", "Jest Testing Library"],
    tools: ["Git Versioning", "ESLint & Prettier", "Webpack Builder", "Postman Client"],
    others: ["Generative AI Models", "RAG Pipeline Engineering", "Tesseract OCR Integration"]
  },
  experience: [
    {
      id: "exp-1",
      company: "Scale AI & Technology Co.",
      designation: "Lead Systems Architect & Solutions Engineer",
      employmentType: "Full-time",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      currentlyWorking: true,
      technologies: ["React 19", "Node.js", "AWS Cloud", "TypeScript"],
      responsibilities: [
        "Architected and deployed high-performance document parsing pipeline utilizing Google Gemini models, achieving a 94.6% reduction in resume processing times.",
        "Pioneered migration of legacy microservices to high-speed Node.js handlers, boosting API responsiveness by 40% and supporting 15,000+ active sessions.",
        "Successfully directed a 12-member engineering division delivering critical compliance interfaces under strict financial services SLAs."
      ],
      achievements: []
    },
    {
      id: "exp-2",
      company: "Stripe Developer Labs",
      designation: "Senior Full Stack Software Developer",
      employmentType: "Full-time",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      currentlyWorking: false,
      technologies: ["React", "TypeScript", "Ruby on Rails", "PostgreSQL"],
      responsibilities: [
        "Led client-facing React application architecture overhauls, boosting end-user core web vitals and overall conversions by 18%.",
        "Refined transactional SQL query structures, scaling operational data ingestion rates by 3x during holiday surge traffic periods.",
        "Created shared UI component library adopted across 4 separate design divisions, reducing product time-to-market margins."
      ],
      achievements: []
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Real-Time Resume Parser Platform",
      description: "An AI-powered, production-grade analyzer mapping scanned resumes into clean editable layouts. Features integrated Tesseract OCR pipelines and full-resolution PDF render previews.",
      technologies: ["Next.js", "Tesseract.js", "Express", "Gemini API"],
      github: "github.com/ashishgupta-dev/resume-parser",
      liveDemo: "ai-resume-parser.run",
      features: ["Text character detection", "Segment classification", "Layout matching"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science & Engineering",
      college: "University of California, Berkeley",
      university: "UC Berkeley",
      year: "2018",
      cgpa: "3.9 / 4.0"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect – Professional",
    "Google Professional Cloud Developer Credentials"
  ],
  achievements: [
    "Placed 1st out of 300 developers at global FinTech Hackathon",
    "Authored modular open-source React hydration plugin with 20k+ NPM downloads"
  ],
  languagesKnown: [
    "English (Fluent)",
    "Hindi (Native)",
    "Spanish (Conversational)"
  ],
  interests: [
    "Open Source Contributions",
    "Generative AI Agent Architectures",
    "Backpack Mountain Trekking"
  ],
  references: []
};

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'builder' | 'dashboard' | 'admin'>('landing');
  const [parsedData, setParsedData] = useState<ResumeData>(DEFAULT_ASHISH_RESUME);
  const [originalText, setOriginalText] = useState('');
  
  // Track where current active resume data is coming from (default predefined vs custom uploaded/edited)
  const [resumeSource, setResumeSource] = useState<'default' | 'uploaded'>('default');

  // Background Device Sync Session (Generated once per browser visit)
  const [deviceSessionId] = useState(() => {
    const key = 'ashish_device_session_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `session-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  });

  // Track selected target profession
  const [profession, setProfession] = useState('Software Engineer');

  // Ad Download gate control
  const [showAdGate, setShowAdGate] = useState(false);

  // Firebase status & cloud share state
  const [firebaseChecked, setFirebaseChecked] = useState(false);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);
  const [sharingResume, setSharingResume] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [customShareId, setCustomShareId] = useState('');
  const [isReadOnlyShare, setIsReadOnlyShare] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);

  // Custom templates selector
  const [activeTemplate, setActiveTemplate] = useState('modern');
  
  // Custom theme color state (indigo, emerald, rose, amber, slate, violet)
  const [themeColor, setThemeColor] = useState('indigo');
  
  // App-wide dark/light (bloom) theme
  const [appTheme, setAppTheme] = useState<'dark' | 'bloom'>('bloom');

  // Typography customization options
  const [fontStyle, setFontStyle] = useState('sans');
  const [fontSize, setFontSize] = useState('medium');
  const [fontColor, setFontColor] = useState('#1e293b');

  // Enforce exactly 2-page print layout mode
  const [enforceTwoPages, setEnforceTwoPages] = useState<boolean>(() => {
    const saved = localStorage.getItem('ashish_enforce_two_pages');
    return saved !== null ? saved === 'true' : true;
  });
  
  // Undo/Redo tracking state stacks
  const [historyStack, setHistoryStack] = useState<ResumeData[]>([DEFAULT_ASHISH_RESUME]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Saved resumes archive states
  const [showScratchConfirm, setShowScratchConfirm] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(() => {
    return localStorage.getItem('ashish_current_resume_id');
  });
  const [archivedResumes, setArchivedResumes] = useState<ArchivedResume[]>(() => {
    try {
      const saved = localStorage.getItem('ashish_saved_resumes_archive');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Live Metrics Stats state
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Check for firebase database on mount
  useEffect(() => {
    getFirebaseDB().then((db) => {
      if (db) {
        setFirebaseAvailable(true);
      }
      setFirebaseChecked(true);
    });
  }, []);

  // Check localStorage and shared cloud link on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem('ashish_resume_data');
      const savedText = localStorage.getItem('ashish_resume_text');
      const savedActiveTemplate = localStorage.getItem('ashish_active_template');
      const savedThemeColor = localStorage.getItem('ashish_theme_color');
      const savedAppTheme = localStorage.getItem('ashish_app_theme');
      const savedFontStyle = localStorage.getItem('ashish_font_style');
      const savedFontSize = localStorage.getItem('ashish_font_size');
      const savedFontColor = localStorage.getItem('ashish_font_color');

      // 1. Check if we have a direct shared ID from cloud in URL query string
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get('id');
      if (sharedId) {
        setLoadingShare(true);
        getResumeFromFirebase(sharedId).then((data) => {
          if (data) {
            setParsedData(data);
            setResumeSource('uploaded'); // Treating shared copy as uploaded/custom editable
            setIsReadOnlyShare(true);
            setHistoryStack([data]);
            setHistoryIndex(0);
            setViewMode('builder');
            triggerNotification("Loaded shared resume from Cloud successfully!");
          } else {
            triggerNotification("The shared cloud resume could not be found.");
          }
          setLoadingShare(false);
        }).catch((err) => {
          console.error("Failed to load shared resume:", err);
          setLoadingShare(false);
        });
        return;
      }

      // 2. Otherwise load custom resume from localStorage if present
      if (savedResume) {
        const parsed = JSON.parse(savedResume);
        setParsedData(parsed);
        setResumeSource('uploaded');
        setHistoryStack([parsed]);
        setHistoryIndex(0);
        setViewMode('builder'); // Hold on the second page (builder view) on refresh!
      }
      
      if (savedText) setOriginalText(savedText);
      if (savedActiveTemplate) setActiveTemplate(savedActiveTemplate);
      if (savedThemeColor) setThemeColor(savedThemeColor);
      if (savedAppTheme) setAppTheme(savedAppTheme as 'dark' | 'bloom');
      if (savedFontStyle) setFontStyle(savedFontStyle);
      if (savedFontSize) setFontSize(savedFontSize);
      if (savedFontColor) setFontColor(savedFontColor);

    } catch (e) {
      console.error("Failed to restore state from local storage:", e);
    }
  }, []);

  // Save updates back to localStorage continuously if they belong to "uploaded" source
  useEffect(() => {
    if (resumeSource === 'uploaded' && parsedData !== DEFAULT_ASHISH_RESUME) {
      try {
        localStorage.setItem('ashish_resume_data', JSON.stringify(parsedData));
      } catch (e) {
        console.error("Failed to write resume data:", e);
      }
    }
  }, [parsedData, resumeSource]);

  useEffect(() => {
    if (resumeSource === 'uploaded' && originalText) {
      localStorage.setItem('ashish_resume_text', originalText);
    }
  }, [originalText, resumeSource]);

  useEffect(() => {
    localStorage.setItem('ashish_active_template', activeTemplate);
  }, [activeTemplate]);

  useEffect(() => {
    localStorage.setItem('ashish_theme_color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('ashish_app_theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    localStorage.setItem('ashish_font_style', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('ashish_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ashish_font_color', fontColor);
  }, [fontColor]);

  useEffect(() => {
    localStorage.setItem('ashish_enforce_two_pages', String(enforceTwoPages));
  }, [enforceTwoPages]);

  // Background silent auto-sync to Firebase Firestore (saves progress without prompt)
  useEffect(() => {
    if (!parsedData || parsedData === DEFAULT_ASHISH_RESUME) return;
    const timer = setTimeout(async () => {
      try {
        await syncUserResumeToFirebase(deviceSessionId, parsedData);
      } catch (err) {
        console.warn("Silent background auto-sync to Firestore skipped or failed:", err);
      }
    }, 2000); // 2 second debounce to prevent aggressive write spam
    return () => clearTimeout(timer);
  }, [parsedData, deviceSessionId]);

  // Load stats from server
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load dashboard statistics:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Show floating notifications helper
  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  // Callback when user parses a new document successfully
  const handleParsedSuccess = (newData: any, rawText: string) => {
    const newId = `resume-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const candidateName = newData.personalInformation?.fullName || newData.personalInformation?.firstName || "Uploaded Resume";
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const displayName = `${candidateName} (${dateStr})`;

    const newArchiveItem: ArchivedResume = {
      id: newId,
      name: displayName,
      timestamp: new Date().toISOString(),
      originalText: rawText,
      uploadedFormat: JSON.parse(JSON.stringify(newData)),
      updatedFormat: JSON.parse(JSON.stringify(newData)),
      profession: profession
    };

    const nextArchived = [newArchiveItem, ...archivedResumes];
    setArchivedResumes(nextArchived);
    localStorage.setItem('ashish_saved_resumes_archive', JSON.stringify(nextArchived));

    setCurrentResumeId(newId);
    localStorage.setItem('ashish_current_resume_id', newId);

    setParsedData(newData);
    setOriginalText(rawText);
    setResumeSource('uploaded');
    setIsReadOnlyShare(false); // Enable edits on their newly uploaded resume
    
    try {
      localStorage.setItem('ashish_resume_data', JSON.stringify(newData));
      localStorage.setItem('ashish_resume_text', rawText);
    } catch (e) {
      console.error(e);
    }
    
    // Reset undo-redo stack
    setHistoryStack([newData]);
    setHistoryIndex(0);
    
    setViewMode('builder');
    triggerNotification(`Successfully uploaded & archived "${candidateName}"!`);
    fetchStats(); // Update live statistics logs
  };

  // Trigger Ashish's predefined profile directly
  const handleLoadDefault = () => {
    setResumeSource('default');
    setIsReadOnlyShare(false);
    setCurrentResumeId(null);
    localStorage.removeItem('ashish_current_resume_id');
    setParsedData(DEFAULT_ASHISH_RESUME);
    setOriginalText("Ashish Gupta\nLead Full Stack Architect...");
    setHistoryStack([DEFAULT_ASHISH_RESUME]);
    setHistoryIndex(0);
    setViewMode('builder');
    triggerNotification("Loaded Ashish's premium engineer profile!");
  };

  // Load custom resume from browser storage
  const handleLoadUploaded = () => {
    const savedResume = localStorage.getItem('ashish_resume_data');
    const savedText = localStorage.getItem('ashish_resume_text');
    const savedCurrentId = localStorage.getItem('ashish_current_resume_id');
    if (savedResume) {
      try {
        const parsed = JSON.parse(savedResume);
        setParsedData(parsed);
        if (savedText) setOriginalText(savedText);
        setResumeSource('uploaded');
        setIsReadOnlyShare(false);
        setHistoryStack([parsed]);
        setHistoryIndex(0);
        if (savedCurrentId) {
          setCurrentResumeId(savedCurrentId);
        }
        triggerNotification("Loaded your custom uploaded resume!");
      } catch (e) {
        console.error(e);
      }
    } else {
      triggerNotification("No custom uploaded resume found in browser memory.");
    }
  };

  // Clear local storage and switch to default profile
  const handleClearSavedResume = () => {
    localStorage.removeItem('ashish_resume_data');
    localStorage.removeItem('ashish_resume_text');
    localStorage.removeItem('ashish_current_resume_id');
    setCurrentResumeId(null);
    setResumeSource('default');
    setIsReadOnlyShare(false);
    setParsedData(DEFAULT_ASHISH_RESUME);
    setOriginalText("Ashish Gupta\nLead Full Stack Architect...");
    setHistoryStack([DEFAULT_ASHISH_RESUME]);
    setHistoryIndex(0);
    triggerNotification("Cleared all uploaded resume data from browser storage!");
  };

  // Trigger modal trigger instead of blocked window.confirm
  const handleCreateFromScratch = () => {
    setShowScratchConfirm(true);
  };

  // Actually execute creating from scratch
  const executeCreateFromScratch = () => {
    const EMPTY_RESUME: ResumeData = {
      personalInformation: {
        fullName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        linkedin: "",
        github: "",
        portfolio: "",
        website: ""
      },
      professionalSummary: "",
      skills: {
        frontend: [],
        backend: [],
        database: [],
        cloud: [],
        devops: [],
        languages: [],
        frameworks: [],
        tools: [],
        others: []
      },
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      languagesKnown: [],
      interests: [],
      references: []
    };

    const newId = `scratch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const displayName = `Scratch Resume (${dateStr})`;

    const newArchiveItem: ArchivedResume = {
      id: newId,
      name: displayName,
      timestamp: new Date().toISOString(),
      originalText: "",
      uploadedFormat: JSON.parse(JSON.stringify(EMPTY_RESUME)),
      updatedFormat: JSON.parse(JSON.stringify(EMPTY_RESUME)),
      profession: profession
    };

    const nextArchived = [newArchiveItem, ...archivedResumes];
    setArchivedResumes(nextArchived);
    localStorage.setItem('ashish_saved_resumes_archive', JSON.stringify(nextArchived));

    setCurrentResumeId(newId);
    localStorage.setItem('ashish_current_resume_id', newId);

    setParsedData(EMPTY_RESUME);
    setOriginalText("");
    setResumeSource('uploaded');
    setIsReadOnlyShare(false);
    
    try {
      localStorage.setItem('ashish_resume_data', JSON.stringify(EMPTY_RESUME));
      localStorage.setItem('ashish_resume_text', "");
    } catch (e) {
      console.error("Failed to save blank state to storage:", e);
    }
    
    // Reset history stacks
    setHistoryStack([EMPTY_RESUME]);
    setHistoryIndex(0);
    
    setViewMode('builder');
    setShowScratchConfirm(false);
    triggerNotification("Started building a new resume from scratch! Fill out the editor fields below.");
  };

  // Load a resume from local archive with selection format
  const handleLoadArchivedResume = (resumeId: string, formatToLoad: 'uploaded' | 'updated') => {
    const target = archivedResumes.find(r => r.id === resumeId);
    if (!target) return;

    const dataToLoad = formatToLoad === 'uploaded' ? target.uploadedFormat : target.updatedFormat;
    
    setParsedData(JSON.parse(JSON.stringify(dataToLoad)));
    setOriginalText(target.originalText);
    setResumeSource('uploaded');
    setIsReadOnlyShare(false);
    setCurrentResumeId(target.id);
    localStorage.setItem('ashish_current_resume_id', target.id);

    try {
      localStorage.setItem('ashish_resume_data', JSON.stringify(dataToLoad));
      localStorage.setItem('ashish_resume_text', target.originalText);
    } catch (e) {
      console.error(e);
    }

    setHistoryStack([JSON.parse(JSON.stringify(dataToLoad))]);
    setHistoryIndex(0);

    setViewMode('builder');
    triggerNotification(`Loaded "${target.name.split(' (')[0]}" (${formatToLoad === 'uploaded' ? 'original upload' : 'updated edit'} format)`);
  };

  // Delete resume from archive
  const handleDeleteArchivedResume = (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedArchived = archivedResumes.filter(r => r.id !== resumeId);
    setArchivedResumes(updatedArchived);
    localStorage.setItem('ashish_saved_resumes_archive', JSON.stringify(updatedArchived));

    if (currentResumeId === resumeId) {
      setCurrentResumeId(null);
      localStorage.removeItem('ashish_current_resume_id');
      handleLoadDefault();
    }
    triggerNotification("Archived resume deleted successfully.");
  };

  // Sync and share resume to Firebase Firestore
  const handleShareToCloud = async () => {
    if (!parsedData) return;
    setSharingResume(true);
    try {
      // Clean custom share ID or auto-generate
      const randomId = Math.random().toString(36).substring(2, 10);
      const cleanId = customShareId.trim().replace(/[^a-zA-Z0-9_\-]/g, '') || `resume-${randomId}`;
      setCustomShareId(cleanId);

      const success = await saveResumeToFirebase(cleanId, parsedData);
      if (success) {
        const base = window.location.origin + window.location.pathname;
        const fullLink = `${base}?id=${cleanId}`;
        setShareUrl(fullLink);
        triggerNotification("Resume deployed successfully to Firebase Cloud!");
      } else {
        triggerNotification("Could not deploy. Please make sure Firebase setup is complete.");
      }
    } catch (e: any) {
      console.error(e);
      // Try to parse error if it's JSON from handleFirestoreError
      try {
        const parsedErr = JSON.parse(e.message);
        triggerNotification(`Deployment failed: ${parsedErr.error}`);
      } catch {
        triggerNotification("Deployment failed: " + e.message);
      }
    } finally {
      setSharingResume(false);
    }
  };

  // Handle data updates from editor form
  const handleDataUpdate = (nextData: ResumeData) => {
    setParsedData(nextData);

    // Commit to Undo/Redo stack (slice forward history if we are in middle of undo stack)
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(JSON.parse(JSON.stringify(nextData))); // deep copy
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);

    // Keep active archived resume sync'ed
    if (currentResumeId) {
      const updatedArchived = archivedResumes.map(item => {
        if (item.id === currentResumeId) {
          return {
            ...item,
            updatedFormat: JSON.parse(JSON.stringify(nextData)),
            timestamp: new Date().toISOString()
          };
        }
        return item;
      });
      setArchivedResumes(updatedArchived);
      localStorage.setItem('ashish_saved_resumes_archive', JSON.stringify(updatedArchived));
    }
  };

  // Undo/Redo functions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setParsedData(JSON.parse(JSON.stringify(historyStack[prevIdx])));
      triggerNotification("Action undone");
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setParsedData(JSON.parse(JSON.stringify(historyStack[nextIdx])));
      triggerNotification("Action redone");
    }
  };

  const handleRestoreFromHistory = (targetData: ResumeData) => {
    setParsedData(targetData);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(JSON.parse(JSON.stringify(targetData)));
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
    triggerNotification("Snapshot version restored successfully");
  };

  // Print/Download PDF tracking (Redirects to Sponsored Ad countdown first)
  const handleDownloadPDF = async () => {
    setShowAdGate(true);
  };

  const handleExecuteDownload = async () => {
    setShowAdGate(false);
    // Call server stats tracker to increment download counter
    try {
      await fetch('/api/export/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: "resume-new", format: 'pdf' })
      });
      fetchStats(); // refresh log lists
    } catch (e) {
      console.error(e);
    }

    // Open standard system print dialog
    window.print();
  };

  const handlePrefillSkills = (newSkills: string[]) => {
    const nextSkills = { ...parsedData.skills };
    if (!nextSkills.others) nextSkills.others = [];
    const uniqueSkills = Array.from(new Set([...(nextSkills.others || []), ...newSkills]));
    nextSkills.others = uniqueSkills;
    handleDataUpdate({ ...parsedData, skills: nextSkills });
    triggerNotification("Skills successfully injected into list!");
  };

  const handleSetSummary = (newSummary: string) => {
    handleDataUpdate({ ...parsedData, professionalSummary: newSummary });
    triggerNotification("Professional Summary updated!");
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      appTheme === 'bloom' 
        ? 'bg-gradient-to-br from-[#FFFDFC] via-[#FAF6F0] to-[#F3ECF8] text-slate-850 selection:bg-rose-100 selection:text-rose-800' 
        : 'bg-slate-950 text-slate-100 selection:bg-indigo-500/30'
    }`}>
      
      {/* Floating notification toaster */}
      {showNotification && (
        <div className={`fixed bottom-5 right-5 z-50 border px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-sm animate-bounce no-print ${
          appTheme === 'bloom'
            ? 'bg-white border-rose-200 text-slate-800'
            : 'bg-slate-900 border-indigo-500/40 text-slate-200'
        }`}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold">{showNotification}</span>
        </div>
      )}

      {/* Global Header Navigation - Hidden during Print Mode */}
      <header className={`border-b sticky top-0 z-45 no-print transition-all duration-300 ${
        appTheme === 'bloom'
          ? 'border-amber-100/60 bg-white/75 backdrop-blur-md text-slate-800 shadow-sm'
          : 'border-slate-900 bg-slate-950/80 backdrop-blur-md text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className={`w-9 h-9 bg-gradient-to-r ${themeGradients[themeColor] || 'from-indigo-500 to-purple-500'} rounded-lg flex items-center justify-center shadow-md transition-all duration-300`}>
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-display font-bold text-base tracking-tight block ${
                appTheme === 'bloom' ? 'text-indigo-950' : 'text-white'
              }`}>Ashish's AI Resume Suite</span>
              <span className={`text-[10px] ${themeTextColors[themeColor] || 'text-indigo-400'} font-mono block -mt-1 font-semibold uppercase tracking-wider`}>Gemini 3.5 Engine</span>
            </div>
          </div>

          {/* Nav & Theme buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Switch Toggle */}
            <button
              onClick={() => {
                const nextTheme = appTheme === 'dark' ? 'bloom' : 'dark';
                setAppTheme(nextTheme);
                triggerNotification(`Switched to ${nextTheme === 'bloom' ? 'Bloom Light Theme 🌸' : 'Midnight Dark Theme 🌙'}`);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                appTheme === 'bloom'
                  ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                  : 'bg-slate-900 border-slate-850 text-amber-400 hover:text-amber-300 hover:bg-slate-850'
              }`}
              title="Toggle application theme"
            >
              {appTheme === 'bloom' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                  <span className="hidden sm:inline">Bloom Light 🌸</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Midnight Dark 🌙</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setViewMode(viewMode === 'dashboard' ? 'landing' : 'dashboard');
                fetchStats();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                viewMode === 'dashboard'
                  ? themeSelectionStyles[themeColor] || 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : appTheme === 'bloom'
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'admin' ? 'builder' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                viewMode === 'admin'
                  ? themeSelectionStyles[themeColor] || 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : appTheme === 'bloom'
                    ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-900 border-slate-850 text-yellow-400 hover:text-yellow-300'
              }`}
              title="Secure Admin Leads Dashboard"
            >
              <Lock className="w-3.5 h-3.5 animate-pulse text-yellow-500" />
              <span>Admin Leads</span>
            </button>

            {viewMode !== 'landing' && (
              <button
                onClick={() => setViewMode('landing')}
                className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-semibold rounded-lg transition ${
                  appTheme === 'bloom'
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    : 'bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Upload</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full animate-fadeIn">
        {viewMode === 'landing' && (
          <LandingPage 
            onParsed={handleParsedSuccess}
            onSelectDefault={handleLoadDefault}
            onCreateScratch={handleCreateFromScratch}
            appTheme={appTheme}
            archivedResumes={archivedResumes}
            onLoadArchived={handleLoadArchivedResume}
            onDeleteArchived={handleDeleteArchivedResume}
          />
        )}

        {viewMode === 'dashboard' && (
          <DashboardStats 
            stats={stats}
            loading={loadingStats}
            onRefresh={fetchStats}
            appTheme={appTheme}
          />
        )}

        {viewMode === 'admin' && (
          <AdminPanel 
            onBack={() => setViewMode('builder')}
            appTheme={appTheme}
          />
        )}

        {viewMode === 'builder' && (
          <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
            {isReadOnlyShare && (
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn no-print text-left">
                <div className="flex items-start sm:items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-bold text-xs block">Viewing Cloud-Shared Resume Link 🌐</span>
                    <span className="text-[11px] text-slate-400">You are currently looking at a copy deployed live to the server. You can fully customize, edit, or save a personal copy below!</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsReadOnlyShare(false);
                    setResumeSource('uploaded');
                    triggerNotification("Imported into your local editor copy!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition shrink-0"
                >
                  Edit Local Copy
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Workspace Column: Controls, Forms, Versioning (col-span-5) */}
            <div className="lg:col-span-5 space-y-6 no-print">
              
              {/* Profession Tips Copilot Panel */}
              <ProfessionHelper 
                currentProfession={profession}
                onSelectProfession={setProfession}
                onPrefillSkills={handlePrefillSkills}
                onSetTemplate={setActiveTemplate}
                onSetSummary={handleSetSummary}
                appTheme={appTheme}
              />
              
              {/* Card 1: Template Selection & Global Action Controls */}
              <div className={`rounded-xl p-5 text-left space-y-4 border transition-all duration-300 ${
                appTheme === 'bloom'
                  ? 'bg-white/90 border-rose-100/80 shadow-md shadow-rose-100/10 text-slate-800'
                  : 'bg-slate-900/40 border border-slate-800 text-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className={`w-4 h-4 ${themeTextColors[themeColor]}`} />
                    <h4 className={`text-sm font-semibold ${appTheme === 'bloom' ? 'text-slate-800' : 'text-white'}`}>Layout Settings & Templates</h4>
                  </div>
                  
                  {/* Print / Download Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className={`flex items-center gap-1.5 px-3 py-1.5 ${themeButtonStyles[themeColor]} text-white font-semibold text-xs rounded-lg shadow-md transition`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Templates Selector Dropdown */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'modern', label: 'Modern Minimalist' },
                    { id: 'professional', label: 'Executive Sidebar' },
                    { id: 'minimal', label: 'Classic Symmetry' },
                    { id: 'creative', label: 'Designer Accent' },
                    { id: 'corporate', label: 'SaaS Grid' },
                    { id: 'ats', label: 'Strict ATS Standard' },
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setActiveTemplate(tmpl.id)}
                      className={`px-3 py-2 text-xs text-left font-semibold rounded-lg border transition ${
                        activeTemplate === tmpl.id
                          ? themeSelectionStyles[themeColor]
                          : appTheme === 'bloom'
                            ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50'
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>

                {/* Smart Two-Page Enforcer Switch */}
                <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                  appTheme === 'bloom' 
                    ? 'bg-rose-50/20 border-rose-100/60' 
                    : 'bg-slate-950/40 border-slate-850'
                }`}>
                  <div className="flex flex-col text-left gap-0.5">
                    <span className={`font-bold flex items-center gap-1.5 ${appTheme === 'bloom' ? 'text-slate-700' : 'text-slate-200'}`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Smart Two-Page Enforcer</span>
                    </span>
                    <span className={`text-[10px] leading-snug ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Adjusts padding, margins, and breaks to keep your resume under exactly 2 pages.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnforceTwoPages(!enforceTwoPages);
                      triggerNotification(`Two-page enforcer ${!enforceTwoPages ? 'enabled' : 'disabled'}!`);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                      enforceTwoPages 
                        ? themeSelectionBg[themeColor] || 'bg-indigo-600' 
                        : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        enforceTwoPages ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Accent Theme Color Selector */}
                <div className={`space-y-2 pt-3 border-t ${appTheme === 'bloom' ? 'border-rose-100/60' : 'border-slate-850/60'}`}>
                  <span className={`block text-xs font-semibold uppercase tracking-wider ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>Accent Theme Color</span>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'indigo', name: 'Indigo Dev', color: 'bg-indigo-600' },
                      { id: 'emerald', name: 'Emerald Teal', color: 'bg-emerald-500' },
                      { id: 'rose', name: 'Crimson Rose', color: 'bg-rose-600' },
                      { id: 'amber', name: 'Warm Bronze', color: 'bg-amber-500' },
                      { id: 'slate', name: 'Steel Slate', color: 'bg-slate-600' },
                      { id: 'violet', name: 'Royal Violet', color: 'bg-violet-600' },
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeColor(theme.id)}
                        title={theme.name}
                        className={`w-7 h-7 rounded-full ${theme.color} flex items-center justify-center transition-all hover:scale-110 relative ${
                          themeColor === theme.id 
                            ? `ring-2 ring-indigo-500 ring-offset-2 ${appTheme === 'bloom' ? 'ring-offset-rose-50' : 'ring-offset-slate-950'} scale-105` 
                            : 'opacity-80'
                        }`}
                      >
                        {themeColor === theme.id && (
                          <span className="w-2 h-2 bg-white rounded-full shadow-sm animate-ping absolute" />
                        )}
                        {themeColor === theme.id && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full shadow-sm z-10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Typography & Rich Style Customizer */}
                <div className={`space-y-3 pt-3 border-t ${appTheme === 'bloom' ? 'border-rose-100/60' : 'border-slate-850/60'}`}>
                  <span className={`block text-xs font-semibold uppercase tracking-wider ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Resume Typography & Formatting
                  </span>
                  
                  {/* Font Family */}
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-semibold uppercase ${appTheme === 'bloom' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Font Style (Family)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'sans', label: 'Inter Sans' },
                        { id: 'serif', label: 'Classic Serif' },
                        { id: 'mono', label: 'Tech Mono' },
                        { id: 'editorial', label: 'Editorial Lora' },
                        { id: 'modern-grotesk', label: 'Grotesk Outfit' },
                      ].map(font => (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => {
                            setFontStyle(font.id);
                            triggerNotification(`Font updated to ${font.label}!`);
                          }}
                          className={`px-2 py-1 text-[11px] font-semibold rounded-md border text-left transition ${
                            fontStyle === font.id
                              ? themeSelectionStyles[themeColor]
                              : appTheme === 'bloom'
                                ? 'bg-rose-50/20 border-slate-200 text-slate-600 hover:bg-rose-50'
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size & Body Color row */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-semibold uppercase ${appTheme === 'bloom' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Font Size
                      </label>
                      <select
                        value={fontSize}
                        onChange={(e) => {
                          setFontSize(e.target.value);
                          triggerNotification(`Size set to ${e.target.value}!`);
                        }}
                        className={`w-full bg-transparent border rounded-md px-2 py-1.5 text-xs font-semibold focus:outline-none ${
                          appTheme === 'bloom'
                            ? 'border-slate-200 text-slate-700 bg-white'
                            : 'border-slate-850 text-slate-200 bg-slate-950'
                        }`}
                      >
                        <option value="small">Small (Compact)</option>
                        <option value="medium">Medium (Standard)</option>
                        <option value="large">Large (Comfortable)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={`block text-[10px] font-semibold uppercase ${appTheme === 'bloom' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Body Text Color
                      </label>
                      <div className="flex items-center gap-1.5 h-[32px]">
                        {[
                          { id: '#1e293b', title: 'Slate Charcoal' },
                          { id: '#0f172a', title: 'Midnight Ink' },
                          { id: '#064e3b', title: 'Forest Green' },
                          { id: '#4c1d95', title: 'Plum Violet' },
                          { id: '#881337', title: 'Crimson Burgundy' }
                        ].map(colorSwatch => (
                          <button
                            key={colorSwatch.id}
                            type="button"
                            onClick={() => {
                              setFontColor(colorSwatch.id);
                              triggerNotification(`Text color set to ${colorSwatch.title}!`);
                            }}
                            title={colorSwatch.title}
                            className={`w-4 h-4 rounded-full border transition-all ${
                              fontColor === colorSwatch.id 
                                ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' 
                                : 'opacity-80'
                            }`}
                            style={{ backgroundColor: colorSwatch.id, borderColor: appTheme === 'bloom' ? '#e2e8f0' : '#334155' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 1.5: Data Storage & Firebase Cloud Deployment */}
              <div className={`rounded-xl p-5 text-left space-y-4 border transition-all duration-300 ${
                appTheme === 'bloom'
                  ? 'bg-white/90 border-rose-100/80 shadow-md shadow-rose-100/10 text-slate-800'
                  : 'bg-slate-900/40 border border-slate-800 text-white'
              }`}>
                <div className="flex items-center gap-2">
                  <Cloud className={`w-4 h-4 ${themeTextColors[themeColor]}`} />
                  <h4 className={`text-sm font-semibold ${appTheme === 'bloom' ? 'text-slate-800' : 'text-white'}`}>Cloud Sync & Storage Options</h4>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Local storage source options */}
                  <div className={`p-3 rounded-lg border text-xs space-y-2.5 ${
                    appTheme === 'bloom' ? 'bg-slate-50/55 border-slate-100' : 'bg-slate-950/40 border-slate-850'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${appTheme === 'bloom' ? 'text-slate-600' : 'text-slate-400'}`}>Active Profile Source</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        resumeSource === 'uploaded' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {resumeSource === 'uploaded' ? 'My Uploaded Resume' : "Ashish's Default Profile"}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {resumeSource === 'uploaded' 
                        ? 'Editing your custom uploaded resume. Updates are preserved instantly in your browser (LocalStorage) and will hold on refresh.'
                        : "Editing Ashish's predefined senior tech profile. Changes will not overwrite your uploaded resume."
                      }
                    </p>

                    {archivedResumes.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <label className={`block text-[10px] font-bold uppercase tracking-wider ${appTheme === 'bloom' ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
                          Switch Archived Resume
                        </label>
                        <select
                          value={currentResumeId || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              handleLoadArchivedResume(e.target.value, 'updated');
                            } else {
                              handleLoadDefault();
                            }
                          }}
                          className={`w-full bg-transparent border rounded-md px-2 py-1.5 text-xs font-semibold focus:outline-none ${
                            appTheme === 'bloom'
                              ? 'border-slate-200 text-slate-700 bg-white'
                              : 'border-slate-850 text-slate-200 bg-slate-950'
                          }`}
                        >
                          <option value="">-- Ashish's Default Profile --</option>
                          {archivedResumes.map(res => (
                            <option key={res.id} value={res.id}>{res.name.split(' (')[0]}</option>
                          ))}
                        </select>
                        
                        {currentResumeId && (
                          <div className="flex gap-1.5 pt-1 justify-end">
                            <button
                              type="button"
                              onClick={() => handleLoadArchivedResume(currentResumeId, 'uploaded')}
                              className={`text-[9px] font-semibold px-2 py-1 border rounded transition ${
                                appTheme === 'bloom'
                                  ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-white'
                              }`}
                              title="Revert to original uploaded format for this resume"
                            >
                              Upload Format
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLoadArchivedResume(currentResumeId, 'updated')}
                              className={`text-[9px] font-semibold px-2 py-1 border rounded transition ${
                                appTheme === 'bloom'
                                  ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/25'
                              }`}
                              title="Ensure current updated format is loaded"
                            >
                              Updated Format
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                     <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCreateFromScratch}
                        className={`col-span-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                          appTheme === 'bloom'
                            ? 'bg-rose-50 border-rose-150 text-rose-600 hover:bg-rose-100'
                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse animate-spin-slow" />
                        <span>Create New from Scratch</span>
                      </button>

                      {resumeSource === 'uploaded' ? (
                        <>
                          <button
                            type="button"
                            onClick={handleLoadDefault}
                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                              appTheme === 'bloom'
                                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Load Default Profile</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleClearSavedResume}
                            className="px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 text-[11px] font-semibold transition flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Custom Resume</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleLoadUploaded}
                            disabled={!localStorage.getItem('ashish_resume_data')}
                            className={`col-span-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                              !localStorage.getItem('ashish_resume_data')
                                ? 'opacity-40 cursor-not-allowed border-slate-300 text-slate-400'
                                : appTheme === 'bloom'
                                  ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                            }`}
                          >
                            <Save className="w-3 h-3" />
                            <span>Switch to My Uploaded Resume</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Firebase Cloud Sync Control */}
                  <div className={`p-3 rounded-lg border text-xs space-y-3 ${
                    appTheme === 'bloom' ? 'bg-slate-50/55 border-slate-100' : 'bg-slate-950/40 border-slate-850'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${appTheme === 'bloom' ? 'text-slate-600' : 'text-slate-400'}`}>Firebase Live Deployment</span>
                      <span className={`flex items-center gap-1 text-[10px] font-semibold ${
                        firebaseAvailable ? 'text-emerald-400' : 'text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${firebaseAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {firebaseAvailable ? 'Cloud Connected' : 'Local Storage Mode'}
                      </span>
                    </div>

                    {!firebaseAvailable ? (
                      <div className="space-y-2">
                        <p className={`text-[11px] leading-relaxed ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Cloud database is ready for provisioning. Accept the database terms in the workspace Setup UI to enable server deployments and shareable URLs!
                        </p>
                        <button
                          type="button"
                          onClick={() => triggerNotification("Please complete Firebase Database setup in the platform UI first!")}
                          className="w-full px-3 py-2 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
                        >
                          <Cloud className="w-3.5 h-3.5" />
                          <span>Provision Firebase Database</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className={`text-[11px] leading-relaxed ${appTheme === 'bloom' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Deploy your customized resume structure to Firebase Firestore to secure a unique production URL hosted on the server.
                        </p>

                        <div className="space-y-1.5">
                          <label className={`block text-[10px] font-semibold uppercase ${appTheme === 'bloom' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Custom Link Slug / URL ID
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. lead-fullstack-dev"
                              value={customShareId}
                              onChange={(e) => setCustomShareId(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_\-]/g, ''))}
                              className={`flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                appTheme === 'bloom'
                                  ? 'border-slate-200 text-slate-700 bg-white placeholder-slate-400'
                                  : 'border-slate-850 text-slate-200 bg-slate-950 placeholder-slate-600'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={handleShareToCloud}
                              disabled={sharingResume}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs text-white transition flex items-center gap-1 shadow-md ${
                                themeButtonStyles[themeColor] || 'bg-indigo-600'
                              } ${sharingResume ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                            >
                              {sharingResume ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Deploying...</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>Deploy to Server</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {shareUrl && (
                          <div className={`p-2.5 rounded-lg border space-y-1.5 animate-fadeIn ${
                            appTheme === 'bloom' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-emerald-950/10 border-emerald-900/30'
                          }`}>
                            <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Server URL:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 bg-transparent text-xs font-mono text-emerald-500 border-none outline-none focus:ring-0 p-0"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(shareUrl);
                                  triggerNotification("Copied shareable URL to clipboard!");
                                }}
                                className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 transition"
                              >
                                Copy Link
                              </button>
                              <a
                                href={shareUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Resume Form controls */}
              <div className={`rounded-xl border transition-all duration-300 ${
                appTheme === 'bloom'
                  ? 'bg-white/90 border-rose-100/60 shadow-md shadow-rose-100/10'
                  : 'bg-slate-900/40 border border-slate-800'
              }`}>
                <ResumeForm 
                  data={parsedData}
                  onChange={handleDataUpdate}
                  appTheme={appTheme}
                />
              </div>

              {/* Card 3: Version snap controller */}
              <VersionHistory 
                currentData={parsedData}
                historyStack={historyStack}
                historyIndex={historyIndex}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onRestore={handleRestoreFromHistory}
                appTheme={appTheme}
              />

            </div>

            {/* Right Workspace Column: Live Preview Render & Copilot Panel (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dynamic Live Preview Screen (Print Target) */}
              <div className={`rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 border ${
                appTheme === 'bloom'
                  ? 'bg-white/80 border-rose-100/70 shadow-rose-100/10'
                  : 'bg-slate-900/20 border border-slate-800/80'
              }`}>
                {/* Print Banner helper */}
                <div className={`absolute right-4 top-4 px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider no-print select-none border ${
                  appTheme === 'bloom'
                    ? 'bg-rose-50/80 border-rose-100 text-rose-500'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}>
                  Live Preview Workspace
                </div>
                
                <div className="mt-4 print:mt-0">
                  <ResumePreview 
                    data={parsedData}
                    templateId={activeTemplate}
                    themeColor={themeColor}
                    fontStyle={fontStyle}
                    fontSize={fontSize}
                    fontColor={fontColor}
                    enforceTwoPages={enforceTwoPages}
                  />
                </div>
              </div>

              {/* Full Interactive AI Analysis & Chat Panel */}
              <div className="no-print">
                <AISuite 
                  resumeData={parsedData}
                  appTheme={appTheme}
                />
              </div>

            </div>

          </div>
          </div>
        )}
      </main>

      {/* Footer System credits */}
      <footer className={`border-t py-5 text-center text-xs mt-10 no-print transition-all duration-300 ${
        appTheme === 'bloom'
          ? 'border-rose-100 bg-white/70 text-slate-400'
          : 'border-slate-900 bg-slate-950 text-slate-500'
      }`}>
        <p>Ashish's AI Resume Suite &bull; Powered by Google Gemini 3.5 & Tesseract OCR</p>
      </footer>

      {showAdGate && (
        <AdDownloadGate 
          onAdCompleted={handleExecuteDownload}
          onCancel={() => setShowAdGate(false)}
          appTheme={appTheme}
        />
      )}

      {showScratchConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl transition-all duration-300 ${
            appTheme === 'bloom'
              ? 'bg-white border-rose-100 text-slate-800'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${appTheme === 'bloom' ? 'bg-rose-50 text-rose-500' : 'bg-slate-950 text-indigo-400'}`}>
                <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
              </div>
              <h3 className="text-base font-bold">Start from Scratch?</h3>
            </div>
            
            <p className={`text-xs leading-relaxed mb-6 ${appTheme === 'bloom' ? 'text-slate-600' : 'text-slate-400'}`}>
              Are you sure you want to create a new resume from scratch? This will initialize a clean, blank editor profile and won't affect any of your saved resumes in the archive.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowScratchConfirm(false)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                  appTheme === 'bloom'
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeCreateFromScratch}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition ${
                  appTheme === 'bloom'
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-md'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md'
                }`}
              >
                Yes, Create Blank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
