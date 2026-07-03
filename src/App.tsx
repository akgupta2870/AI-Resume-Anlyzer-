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
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';

// Components
import LandingPage from './components/LandingPage.tsx';
import ResumeForm from './components/ResumeForm.tsx';
import ResumePreview from './components/ResumePreview.tsx';
import AISuite from './components/AISuite.tsx';
import DashboardStats from './components/DashboardStats.tsx';
import VersionHistory from './components/VersionHistory.tsx';

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

// Types
import { ResumeData, DashboardStats as StatsType } from './types.ts';

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
  const [viewMode, setViewMode] = useState<'landing' | 'builder' | 'dashboard'>('landing');
  const [parsedData, setParsedData] = useState<ResumeData>(DEFAULT_ASHISH_RESUME);
  const [originalText, setOriginalText] = useState('');
  
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
  
  // Undo/Redo tracking state stacks
  const [historyStack, setHistoryStack] = useState<ResumeData[]>([DEFAULT_ASHISH_RESUME]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Live Metrics Stats state
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

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
    setParsedData(newData);
    setOriginalText(rawText);
    
    // Reset undo-redo stack
    setHistoryStack([newData]);
    setHistoryIndex(0);
    
    setViewMode('builder');
    triggerNotification("Resume successfully structured and optimized!");
    fetchStats(); // Update live statistics logs
  };

  // Trigger Ashish's predefined profile directly
  const handleLoadDefault = () => {
    setParsedData(DEFAULT_ASHISH_RESUME);
    setOriginalText("Ashish Gupta\nLead Full Stack Architect...");
    setHistoryStack([DEFAULT_ASHISH_RESUME]);
    setHistoryIndex(0);
    setViewMode('builder');
    triggerNotification("Loaded Ashish's premium engineer profile!");
  };

  // Handle data updates from editor form
  const handleDataUpdate = (nextData: ResumeData) => {
    setParsedData(nextData);

    // Commit to Undo/Redo stack (slice forward history if we are in middle of undo stack)
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(JSON.parse(JSON.stringify(nextData))); // deep copy
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
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

  // Print/Download PDF tracking
  const handleDownloadPDF = async () => {
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
                appTheme === 'bloom' ? 'text-indigo-850' : 'text-white'
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
            appTheme={appTheme}
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

        {viewMode === 'builder' && (
          <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Workspace Column: Controls, Forms, Versioning (col-span-5) */}
            <div className="lg:col-span-5 space-y-6 no-print">
              
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
    </div>
  );
}
