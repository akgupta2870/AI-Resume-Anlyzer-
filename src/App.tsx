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
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

// Components
import LandingPage from './components/LandingPage.tsx';
import ResumeForm from './components/ResumeForm.tsx';
import ResumePreview from './components/ResumePreview.tsx';
import AISuite from './components/AISuite.tsx';
import DashboardStats from './components/DashboardStats.tsx';
import VersionHistory from './components/VersionHistory.tsx';

// Types
import { ResumeData, DashboardStats as StatsType } from './types.ts';

// Detailed predefined resume mock payload for Amit Gupta
const DEFAULT_AMIT_RESUME: ResumeData = {
  personalInformation: {
    fullName: "Amit Gupta",
    firstName: "Amit",
    lastName: "Gupta",
    email: "Akgupta2870@gmail.com",
    phone: "+1 (555) 345-6789",
    address: "456 Silicon Valley Blvd",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94107",
    linkedin: "linkedin.com/in/amitgupta-dev",
    github: "github.com/akgupta2870",
    portfolio: "amitgupta.engineering",
    website: "amitgupta.engineering"
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
      github: "github.com/akgupta2870/resume-parser",
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
  const [parsedData, setParsedData] = useState<ResumeData>(DEFAULT_AMIT_RESUME);
  const [originalText, setOriginalText] = useState('');
  
  // Custom templates selector
  const [activeTemplate, setActiveTemplate] = useState('modern');
  
  // Undo/Redo tracking state stacks
  const [historyStack, setHistoryStack] = useState<ResumeData[]>([DEFAULT_AMIT_RESUME]);
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

  // Trigger Amit's predefined profile directly
  const handleLoadDefault = () => {
    setParsedData(DEFAULT_AMIT_RESUME);
    setOriginalText("Amit Gupta\nLead Full Stack Architect...");
    setHistoryStack([DEFAULT_AMIT_RESUME]);
    setHistoryIndex(0);
    setViewMode('builder');
    triggerNotification("Loaded Amit Gupta's engineer profile!");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 font-sans">
      
      {/* Floating notification toaster */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-indigo-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-sm animate-bounce no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-200 font-semibold">{showNotification}</span>
        </div>
      )}

      {/* Global Header Navigation - Hidden during Print Mode */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-45 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white block">AI Resume Suite</span>
              <span className="text-[10px] text-indigo-400 font-mono block -mt-1 font-semibold uppercase">Gemini 3.5 Engine</span>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewMode(viewMode === 'dashboard' ? 'landing' : 'dashboard');
                fetchStats();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                viewMode === 'dashboard'
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>System Analytics</span>
            </button>

            {viewMode !== 'landing' && (
              <button
                onClick={() => setViewMode('landing')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-850 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Upload</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full">
        {viewMode === 'landing' && (
          <LandingPage 
            onParsed={handleParsedSuccess}
            onSelectDefault={handleLoadDefault}
          />
        )}

        {viewMode === 'dashboard' && (
          <DashboardStats 
            stats={stats}
            loading={loadingStats}
            onRefresh={fetchStats}
          />
        )}

        {viewMode === 'builder' && (
          <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Workspace Column: Controls, Forms, Versioning (col-span-5) */}
            <div className="lg:col-span-5 space-y-6 no-print">
              
              {/* Card 1: Template Selection & Global Action Controls */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-md text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-white text-sm font-semibold">Layout Settings & Templates</h4>
                  </div>
                  
                  {/* Print / Download Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md transition"
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
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Interactive Resume Form controls */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
                <ResumeForm 
                  data={parsedData}
                  onChange={handleDataUpdate}
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
              />

            </div>

            {/* Right Workspace Column: Live Preview Render & Copilot Panel (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dynamic Live Preview Screen (Print Target) */}
              <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
                {/* Print Banner helper */}
                <div className="absolute right-4 top-4 px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[9px] text-slate-500 uppercase font-mono tracking-wider no-print select-none">
                  Live Preview Workspace
                </div>
                
                <div className="mt-4 print:mt-0">
                  <ResumePreview 
                    data={parsedData}
                    templateId={activeTemplate}
                  />
                </div>
              </div>

              {/* Full Interactive AI Analysis & Chat Panel */}
              <div className="no-print">
                <AISuite 
                  resumeData={parsedData}
                />
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Footer System credits */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-slate-500 text-xs mt-10 no-print">
        <p>AI Resume PDF Analyzer & Editor Platform &bull; Powered by Google Gemini 3.5 & Tesseract OCR</p>
      </footer>
    </div>
  );
}
