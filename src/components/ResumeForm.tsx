import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Award, 
  Languages, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Wand2, 
  Loader2, 
  PlusCircle, 
  X,
  PlusSquare,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ResumeData, Experience, Project, Education } from '../types.ts';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  appTheme?: 'dark' | 'bloom';
}

export default function ResumeForm({ data, onChange, appTheme = 'dark' }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');

  // Rich Text Formatting Helper for textareas
  const handleFormatText = (
    textareaId: string, 
    value: string, 
    setValue: (val: string) => void,
    tagStart: string,
    tagEnd: string
  ) => {
    const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!el) {
      setValue(value + tagStart + tagEnd);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = tagStart + selectedText + tagEnd;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    setValue(newValue);
    
    // Restore focus and selection
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tagStart.length, start + tagStart.length + selectedText.length);
    }, 50);
  };

  const renderFormattingToolbar = (textareaId: string, value: string, setValue: (val: string) => void) => {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 p-1 border rounded-md mb-1.5 no-print ${
        appTheme === 'bloom' ? 'bg-rose-50/50 border-rose-100/60' : 'bg-slate-900 border-slate-850'
      }`}>
        <button
          type="button"
          onClick={() => handleFormatText(textareaId, value, setValue, '<b>', '</b>')}
          className="px-2.5 py-1 text-xs font-bold rounded hover:bg-indigo-500/10 hover:text-indigo-400 transition"
          title="Make Bold (<b>)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleFormatText(textareaId, value, setValue, '<i>', '</i>')}
          className="px-2.5 py-1 text-xs font-serif italic rounded hover:bg-indigo-500/10 hover:text-indigo-400 transition"
          title="Make Italic (<i>)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleFormatText(textareaId, value, setValue, '<u>', '</u>')}
          className="px-2.5 py-1 text-xs underline rounded hover:bg-indigo-500/10 hover:text-indigo-400 transition"
          title="Underline (<u>)"
        >
          U
        </button>
        
        <div className={`w-[1px] h-3 mx-1 ${appTheme === 'bloom' ? 'bg-rose-200' : 'bg-slate-800'}`} />

        {/* Custom Preset Colors dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleFormatText(textareaId, value, setValue, `<span style="color: ${e.target.value}">`, '</span>');
              e.target.value = ''; // reset dropdown
            }
          }}
          className={`bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer ${
            appTheme === 'bloom' ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Highlight Color"
        >
          <option value="">Color Highlight</option>
          <option value="#ef4444" className="text-[#ef4444]">🔴 Red Accent</option>
          <option value="#3b82f6" className="text-[#3b82f6]">🔵 Blue Action</option>
          <option value="#10b981" className="text-[#10b981]">🟢 Green Metric</option>
          <option value="#f59e0b" className="text-[#f59e0b]">🟡 Amber Award</option>
          <option value="#8b5cf6" className="text-[#8b5cf6]">🟣 Purple Goal</option>
        </select>

        <div className={`w-[1px] h-3 mx-1 ${appTheme === 'bloom' ? 'bg-rose-200' : 'bg-slate-800'}`} />

        {/* Font Size dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleFormatText(textareaId, value, setValue, `<span style="font-size: ${e.target.value}">`, '</span>');
              e.target.value = ''; // reset
            }
          }}
          className={`bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer ${
            appTheme === 'bloom' ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Font Size Modifier"
        >
          <option value="">Font Size</option>
          <option value="1.25em">Large</option>
          <option value="1.45em">Extra Large</option>
          <option value="0.85em">Small (Sub)</option>
        </select>

        <div className={`w-[1px] h-3 mx-1 ${appTheme === 'bloom' ? 'bg-rose-200' : 'bg-slate-800'}`} />

        {/* Font Style/Family dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleFormatText(textareaId, value, setValue, `<span style="font-family: ${e.target.value}">`, '</span>');
              e.target.value = ''; // reset
            }
          }}
          className={`bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer ${
            appTheme === 'bloom' ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Font Style"
        >
          <option value="">Font Family</option>
          <option value="sans-serif">Modern Sans</option>
          <option value="serif">Classic Serif</option>
          <option value="monospace">Tech Mono</option>
        </select>
      </div>
    );
  };
  
  // Track open/collapsed indices for array fields
  const [expandedExp, setExpandedExp] = useState<{ [key: number]: boolean }>({ 0: true });
  const [expandedProj, setExpandedProj] = useState<{ [key: number]: boolean }>({ 0: true });
  const [expandedEdu, setExpandedEdu] = useState<{ [key: number]: boolean }>({ 0: true });

  // AI Loaders
  const [improvingSummary, setImprovingSummary] = useState(false);
  const [improvingBullet, setImprovingBullet] = useState<{ [key: string]: boolean }>({});

  // AI Profile Generator state
  const [profileRole, setProfileRole] = useState('Senior Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [generatingProfile, setGeneratingProfile] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  const handleGenerateAIProfile = async () => {
    const roleToGenerate = profileRole === 'custom' ? customRole.trim() : profileRole;
    if (!roleToGenerate) {
      setGenerationError("Please specify a custom role to generate.");
      return;
    }
    setGeneratingProfile(true);
    setGenerationError(null);
    setGenerationSuccess(null);
    try {
      const res = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profession: roleToGenerate })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to generate profile.");
      }
      onChange(result);
      setGenerationSuccess(`Successfully generated complete resume for "${roleToGenerate}"! All sections are fully populated.`);
      // Clear success message after 6 seconds
      setTimeout(() => setGenerationSuccess(null), 6000);
    } catch (e: any) {
      console.error(e);
      setGenerationError(e.message || "An error occurred while generating the profile.");
    } finally {
      setGeneratingProfile(false);
    }
  };

  const updatePersonal = (field: string, value: string) => {
    onChange({
      ...data,
      personalInformation: {
        ...data.personalInformation,
        [field]: value
      }
    });
  };

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      professionalSummary: value
    });
  };

  const handleImproveSummary = async () => {
    if (!data.professionalSummary.trim()) return;
    setImprovingSummary(true);
    try {
      const allSkills = [
        ...data.skills.frontend,
        ...data.skills.backend,
        ...data.skills.frameworks
      ];
      const res = await fetch('/api/improve-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: data.professionalSummary, skills: allSkills.slice(0, 10) })
      });
      const result = await res.json();
      if (result.improved) {
        updateSummary(result.improved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingSummary(false);
    }
  };

  const handleImproveBullet = async (expIndex: number, respIndex: number, bullet: string, designation: string) => {
    const key = `${expIndex}-${respIndex}`;
    setImprovingBullet(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch('/api/improve-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, designation })
      });
      const result = await res.json();
      if (result.improved) {
        const nextExp = [...data.experience];
        nextExp[expIndex].responsibilities[respIndex] = result.improved;
        onChange({ ...data, experience: nextExp });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingBullet(prev => ({ ...prev, [key]: false }));
    }
  };

  // --- Skills categories helper ---
  const handleAddSkill = (category: keyof typeof data.skills, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value) {
        const nextSkills = { ...data.skills };
        nextSkills[category] = [...nextSkills[category], value];
        onChange({ ...data, skills: nextSkills });
        input.value = '';
      }
    }
  };

  const handleDeleteSkill = (category: keyof typeof data.skills, skillIndex: number) => {
    const nextSkills = { ...data.skills };
    nextSkills[category] = nextSkills[category].filter((_, i) => i !== skillIndex);
    onChange({ ...data, skills: nextSkills });
  };

  // --- Experience Handlers ---
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      designation: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      technologies: [],
      responsibilities: [''],
      achievements: []
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
    setExpandedExp(prev => ({ ...prev, [data.experience.length]: true }));
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: any) => {
    const nextExp = [...data.experience];
    nextExp[index] = { ...nextExp[index], [field]: value };
    onChange({ ...data, experience: nextExp });
  };

  const handleDeleteExperience = (index: number) => {
    const nextExp = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: nextExp });
  };

  const handleDuplicateExperience = (index: number) => {
    const source = data.experience[index];
    const duplicated: Experience = {
      ...JSON.parse(JSON.stringify(source)),
      id: `exp-${Date.now()}`
    };
    onChange({ ...data, experience: [...data.experience, duplicated] });
  };

  const handleMoveExp = (index: number, dir: 'up' | 'down') => {
    if (dir === 'up' && index === 0) return;
    if (dir === 'down' && index === data.experience.length - 1) return;
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    const nextExp = [...data.experience];
    const temp = nextExp[index];
    nextExp[index] = nextExp[targetIndex];
    nextExp[targetIndex] = temp;
    onChange({ ...data, experience: nextExp });
  };

  // --- Projects Handlers ---
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      technologies: [],
      github: '',
      liveDemo: '',
      features: ['']
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
    setExpandedProj(prev => ({ ...prev, [data.projects.length]: true }));
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: any) => {
    const nextProj = [...data.projects];
    nextProj[index] = { ...nextProj[index], [field]: value };
    onChange({ ...data, projects: nextProj });
  };

  const handleDeleteProject = (index: number) => {
    const nextProj = data.projects.filter((_, i) => i !== index);
    onChange({ ...data, projects: nextProj });
  };

  const handleDuplicateProject = (index: number) => {
    const source = data.projects[index];
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(source)),
      id: `proj-${Date.now()}`
    };
    onChange({ ...data, projects: [...data.projects, duplicated] });
  };

  const handleMoveProject = (index: number, dir: 'up' | 'down') => {
    if (dir === 'up' && index === 0) return;
    if (dir === 'down' && index === data.projects.length - 1) return;
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    const nextProj = [...data.projects];
    const temp = nextProj[index];
    nextProj[index] = nextProj[targetIndex];
    nextProj[targetIndex] = temp;
    onChange({ ...data, projects: nextProj });
  };

  // --- Education Handlers ---
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      college: '',
      university: '',
      year: '',
      cgpa: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
    setExpandedEdu(prev => ({ ...prev, [data.education.length]: true }));
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: any) => {
    const nextEdu = [...data.education];
    nextEdu[index] = { ...nextEdu[index], [field]: value };
    onChange({ ...data, education: nextEdu });
  };

  const handleDeleteEducation = (index: number) => {
    const nextEdu = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: nextEdu });
  };

  const handleMoveEdu = (index: number, dir: 'up' | 'down') => {
    if (dir === 'up' && index === 0) return;
    if (dir === 'down' && index === data.education.length - 1) return;
    const targetIndex = dir === 'up' ? index - 1 : index + 1;
    const nextEdu = [...data.education];
    const temp = nextEdu[index];
    nextEdu[index] = nextEdu[targetIndex];
    nextEdu[targetIndex] = temp;
    onChange({ ...data, education: nextEdu });
  };

  // --- Flat String Arrays Handlers (Achievements, Certs, etc) ---
  const handleUpdateFlatArray = (field: 'certifications' | 'achievements' | 'languagesKnown' | 'interests', index: number, value: string) => {
    const nextArr = [...data[field]];
    nextArr[index] = value;
    onChange({ ...data, [field]: nextArr });
  };

  const handleAddFlatArrayItem = (field: 'certifications' | 'achievements' | 'languagesKnown' | 'interests') => {
    onChange({ ...data, [field]: [...data[field], ''] });
  };

  const handleDeleteFlatArrayItem = (field: 'certifications' | 'achievements' | 'languagesKnown' | 'interests', index: number) => {
    onChange({ ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  return (
    <div id="resume-form-panel" className="space-y-6">
      
      {/* AI Auto-Fill Profile Section */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left space-y-3 shadow-inner">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">AI Instant Resume Auto-Filler</h4>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Don't want to type? Select or type any profession below, and Gemini will instantly auto-fill the entire resume form with optimized achievements, metrics, skills, and projects!
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex-1 min-w-[200px]">
            <select
              value={profileRole}
              onChange={(e) => setProfileRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Senior Software Engineer">Senior Software Engineer (Full Stack)</option>
              <option value="Frontend Developer">Frontend Developer (React & TS)</option>
              <option value="Data Scientist">Data Scientist & ML Engineer</option>
              <option value="Product Manager">Product Manager (Tech SaaS)</option>
              <option value="Cybersecurity Analyst">Cybersecurity & SecOps Specialist</option>
              <option value="Graduate Software Engineer">Graduate Software Engineer (Entry Level)</option>
              <option value="custom">Other (Type custom profession...)</option>
            </select>
          </div>

          {profileRole === 'custom' && (
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="e.g. Financial Consultant, UX Researcher..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <button
            type="button"
            disabled={generatingProfile}
            onClick={handleGenerateAIProfile}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition shadow-md"
          >
            {generatingProfile ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Profile...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Fill Entire Form</span>
              </>
            )}
          </button>
        </div>

        {/* Success/Error Feedback inside Form */}
        {generationSuccess && (
          <div className="p-2.5 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{generationSuccess}</span>
          </div>
        )}

        {generationError && (
          <div className="p-2.5 bg-rose-950/30 border border-rose-900/50 rounded-lg text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{generationError}</span>
          </div>
        )}
      </div>

      {/* Horizontal Tabs to toggle main form sections */}
      <div className="flex flex-wrap gap-2 border-b border-slate-850 pb-3">
        {[
          { id: 'personal', name: 'Personal', icon: <User className="w-4 h-4" /> },
          { id: 'summary', name: 'Summary', icon: <FileText className="w-4 h-4" /> },
          { id: 'skills', name: 'Skills', icon: <Award className="w-4 h-4" /> },
          { id: 'experience', name: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'projects', name: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
          { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'extras', name: 'Extras', icon: <Languages className="w-4 h-4" /> },
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              activeSection === section.id
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300 hover:bg-slate-850'
            }`}
          >
            {section.icon}
            <span>{section.name}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: Personal Info */}
      {activeSection === 'personal' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Full Display Name</label>
            <input 
              type="text" 
              value={data.personalInformation.fullName}
              onChange={(e) => updatePersonal('fullName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">First Name</label>
            <input 
              type="text" 
              value={data.personalInformation.firstName}
              onChange={(e) => updatePersonal('firstName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Last Name</label>
            <input 
              type="text" 
              value={data.personalInformation.lastName}
              onChange={(e) => updatePersonal('lastName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Email Address</label>
            <input 
              type="email" 
              value={data.personalInformation.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Phone Number</label>
            <input 
              type="text" 
              value={data.personalInformation.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Street Address</label>
            <input 
              type="text" 
              value={data.personalInformation.address}
              onChange={(e) => updatePersonal('address', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">City</label>
            <input 
              type="text" 
              value={data.personalInformation.city}
              onChange={(e) => updatePersonal('city', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">State / Province</label>
            <input 
              type="text" 
              value={data.personalInformation.state}
              onChange={(e) => updatePersonal('state', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Country</label>
            <input 
              type="text" 
              value={data.personalInformation.country}
              onChange={(e) => updatePersonal('country', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Postal Code</label>
            <input 
              type="text" 
              value={data.personalInformation.postalCode}
              onChange={(e) => updatePersonal('postalCode', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">LinkedIn Link</label>
            <input 
              type="text" 
              value={data.personalInformation.linkedin}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">GitHub URL</label>
            <input 
              type="text" 
              value={data.personalInformation.github}
              onChange={(e) => updatePersonal('github', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Portfolio Link</label>
            <input 
              type="text" 
              value={data.personalInformation.portfolio}
              onChange={(e) => updatePersonal('portfolio', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase">Personal Website</label>
            <input 
              type="text" 
              value={data.personalInformation.website}
              onChange={(e) => updatePersonal('website', e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
            />
          </div>
        </div>
      )}

      {/* SECTION 2: Professional Summary with AI rewrite */}
      {activeSection === 'summary' && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <label className="block text-slate-400 text-xs font-semibold uppercase">Professional Summary</label>
            <button
              id="btn-improve-summary"
              type="button"
              disabled={improvingSummary || !data.professionalSummary}
              onClick={handleImproveSummary}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-medium text-[11px] rounded-md shadow transition"
            >
              {improvingSummary ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Rewriting summary...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Improve with Gemini AI</span>
                </>
              )}
            </button>
          </div>
          {renderFormattingToolbar('summary-textarea', data.professionalSummary, updateSummary)}
          <textarea
            id="summary-textarea"
            rows={6}
            value={data.professionalSummary}
            onChange={(e) => updateSummary(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
            placeholder="Write a compelling professional summary detailing your career achievements..."
          />
        </div>
      )}

      {/* SECTION 3: Skills Categories */}
      {activeSection === 'skills' && (
        <div className="space-y-5 text-left">
          {[
            { id: 'frontend', label: 'Frontend Technologies' },
            { id: 'backend', label: 'Backend Architectures' },
            { id: 'database', label: 'Databases & ORMs' },
            { id: 'cloud', label: 'Cloud Infrastructure' },
            { id: 'devops', label: 'DevOps & Toolchains' },
            { id: 'languages', label: 'Programming Languages' },
            { id: 'frameworks', label: 'Frameworks / Libraries' },
            { id: 'tools', label: 'Tools / Utilities' },
            { id: 'others', label: 'Other/AI Skills' }
          ].map(category => {
            const catKey = category.id as keyof typeof data.skills;
            return (
              <div key={category.id} className="bg-slate-900/40 border border-slate-850 rounded-xl p-4">
                <label className="block text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wide">
                  {category.label}
                </label>
                
                {/* Chip container */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills[catKey]?.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-indigo-300 font-mono">
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSkill(catKey, sIdx)}
                        className="text-slate-500 hover:text-slate-300 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(!data.skills[catKey] || data.skills[catKey].length === 0) && (
                    <span className="text-slate-500 text-xs italic">No skills added.</span>
                  )}
                </div>

                {/* Input trigger */}
                <input
                  type="text"
                  onKeyDown={(e) => handleAddSkill(catKey, e)}
                  placeholder="Type skill and press Enter..."
                  className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 4: Experience Panel (dynamic expandable) */}
      {activeSection === 'experience' && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm font-semibold uppercase">Employment History</h3>
            <button
              type="button"
              onClick={handleAddExperience}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={exp.id || idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => setExpandedExp(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-slate-850/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-white text-sm font-semibold truncate">
                      {exp.designation || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {/* Reorder Buttons */}
                    <button 
                      onClick={() => handleMoveExp(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMoveExp(idx, 'down')}
                      disabled={idx === data.experience.length - 1}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {/* Duplicate button */}
                    <button 
                      onClick={() => handleDuplicateExperience(idx)}
                      className="p-1 text-slate-500 hover:text-indigo-400 transition"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete button */}
                    <button 
                      onClick={() => handleDeleteExperience(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {expandedExp[idx] && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Company Name</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Designation / Title</label>
                      <input 
                        type="text" 
                        value={exp.designation}
                        onChange={(e) => handleUpdateExperience(idx, 'designation', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Employment Type</label>
                      <select
                        value={exp.employmentType}
                        onChange={(e) => handleUpdateExperience(idx, 'employmentType', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Location</label>
                      <input 
                        type="text" 
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Start Date (YYYY-MM)</label>
                      <input 
                        type="text" 
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">End Date (or Present)</label>
                      <input 
                        type="text" 
                        value={exp.endDate}
                        disabled={exp.currentlyWorking}
                        onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-45" 
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`currentlyWorking-${idx}`}
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          handleUpdateExperience(idx, 'currentlyWorking', e.target.checked);
                          if (e.target.checked) handleUpdateExperience(idx, 'endDate', 'Present');
                        }}
                        className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0" 
                      />
                      <label htmlFor={`currentlyWorking-${idx}`} className="text-slate-300 text-xs font-medium cursor-pointer">
                        I am currently working in this role
                      </label>
                    </div>

                    {/* Dynamic array responsibilities */}
                    <div className="col-span-1 sm:col-span-2 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-400 text-xs font-semibold uppercase">Responsibilities & Core Achievements</label>
                        <button
                          type="button"
                          onClick={() => {
                            const nextResp = [...exp.responsibilities, ''];
                            handleUpdateExperience(idx, 'responsibilities', nextResp);
                          }}
                          className="flex items-center gap-0.5 px-2 py-1 bg-slate-950 hover:bg-slate-850 text-indigo-400 font-medium text-[10px] rounded border border-slate-800 hover:border-slate-700 transition"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Line</span>
                        </button>
                      </div>

                      {exp.responsibilities.map((resp, rIdx) => {
                        const bulletKey = `${idx}-${rIdx}`;
                        return (
                          <div key={rIdx} className="flex items-start gap-2">
                            <span className="text-slate-500 text-xs mt-2 font-mono">#{rIdx + 1}</span>
                            <div className="flex-1 min-w-0 space-y-1">
                              {renderFormattingToolbar(`resp-textarea-${bulletKey}`, resp, (newVal) => {
                                const nextResp = [...exp.responsibilities];
                                nextResp[rIdx] = newVal;
                                handleUpdateExperience(idx, 'responsibilities', nextResp);
                              })}
                              <textarea
                                id={`resp-textarea-${bulletKey}`}
                                value={resp}
                                onChange={(e) => {
                                  const nextResp = [...exp.responsibilities];
                                  nextResp[rIdx] = e.target.value;
                                  handleUpdateExperience(idx, 'responsibilities', nextResp);
                                }}
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                                placeholder="Worked on React frontend modules..."
                              />
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  disabled={improvingBullet[bulletKey] || !resp.trim()}
                                  onClick={() => handleImproveBullet(idx, rIdx, resp, exp.designation)}
                                  className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-medium text-[9px] rounded border border-indigo-500/25 transition disabled:opacity-40"
                                >
                                  {improvingBullet[bulletKey] ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                      <span>Converting to Metrics...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Wand2 className="w-2.5 h-2.5" />
                                      <span>Refine with AI metrics</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const nextResp = exp.responsibilities.filter((_, ri) => ri !== rIdx);
                                handleUpdateExperience(idx, 'responsibilities', nextResp);
                              }}
                              className="p-1 text-slate-600 hover:text-rose-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Projects Panel */}
      {activeSection === 'projects' && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm font-semibold uppercase">Personal & Work Projects</h3>
            <button
              type="button"
              onClick={handleAddProject}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={proj.id || idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <div 
                  onClick={() => setExpandedProj(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-slate-850/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-white text-sm font-semibold truncate">
                      {proj.title || 'New Project'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => handleMoveProject(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMoveProject(idx, 'down')}
                      disabled={idx === data.projects.length - 1}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateProject(idx)}
                      className="p-1 text-slate-500 hover:text-indigo-400 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {expandedProj[idx] && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Project Title</label>
                      <input 
                        type="text" 
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Description</label>
                      {renderFormattingToolbar(`proj-desc-${idx}`, proj.description, (newVal) => handleUpdateProject(idx, 'description', newVal))}
                      <textarea
                        id={`proj-desc-${idx}`}
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">GitHub Repository Link</label>
                      <input 
                        type="text" 
                        value={proj.github}
                        onChange={(e) => handleUpdateProject(idx, 'github', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Live Demo Link</label>
                      <input 
                        type="text" 
                        value={proj.liveDemo}
                        onChange={(e) => handleUpdateProject(idx, 'liveDemo', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Education Panel */}
      {activeSection === 'education' && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm font-semibold uppercase">Academic Qualifications</h3>
            <button
              type="button"
              onClick={handleAddEducation}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={edu.id || idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <div 
                  onClick={() => setExpandedEdu(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-slate-850/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-white text-sm font-semibold truncate">
                      {edu.degree || 'New Education'} {edu.college ? `@ ${edu.college}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => handleMoveEdu(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMoveEdu(idx, 'down')}
                      disabled={idx === data.education.length - 1}
                      className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEducation(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {expandedEdu[idx] && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Degree Name</label>
                      <input 
                        type="text" 
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">College / Institution</label>
                      <input 
                        type="text" 
                        value={edu.college}
                        onChange={(e) => handleUpdateEducation(idx, 'college', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">University</label>
                      <input 
                        type="text" 
                        value={edu.university}
                        onChange={(e) => handleUpdateEducation(idx, 'university', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">Year Completed / Expected</label>
                      <input 
                        type="text" 
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase">GPA / Marks</label>
                      <input 
                        type="text" 
                        value={edu.cgpa}
                        onChange={(e) => handleUpdateEducation(idx, 'cgpa', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: Extra Flat arrays (Certifications, Achievements, Languages, Interests) */}
      {activeSection === 'extras' && (
        <div className="space-y-6 text-left">
          
          {/* Certifications list */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-slate-300 text-xs font-semibold uppercase">Certifications</label>
              <button
                type="button"
                onClick={() => handleAddFlatArrayItem('certifications')}
                className="flex items-center gap-0.5 text-indigo-400 font-medium text-[11px] hover:text-indigo-300 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Certificate</span>
              </button>
            </div>
            <div className="space-y-2">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleUpdateFlatArray('certifications', index, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFlatArrayItem('certifications', index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.certifications.length === 0 && (
                <p className="text-slate-500 text-xs italic">No certifications added yet.</p>
              )}
            </div>
          </div>

          {/* Achievements list */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-slate-300 text-xs font-semibold uppercase">Key Achievements</label>
              <button
                type="button"
                onClick={() => handleAddFlatArrayItem('achievements')}
                className="flex items-center gap-0.5 text-indigo-400 font-medium text-[11px] hover:text-indigo-300 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>
            <div className="space-y-2">
              {data.achievements.map((ach, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleUpdateFlatArray('achievements', index, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFlatArrayItem('achievements', index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.achievements.length === 0 && (
                <p className="text-slate-500 text-xs italic">No achievements added yet.</p>
              )}
            </div>
          </div>

          {/* LanguagesKnown list */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-slate-300 text-xs font-semibold uppercase">Languages Spoken</label>
              <button
                type="button"
                onClick={() => handleAddFlatArrayItem('languagesKnown')}
                className="flex items-center gap-0.5 text-indigo-400 font-medium text-[11px] hover:text-indigo-300 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Language</span>
              </button>
            </div>
            <div className="space-y-2">
              {data.languagesKnown.map((lang, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => handleUpdateFlatArray('languagesKnown', index, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFlatArrayItem('languagesKnown', index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.languagesKnown.length === 0 && (
                <p className="text-slate-500 text-xs italic">No languages added yet.</p>
              )}
            </div>
          </div>

          {/* Interests list */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-slate-300 text-xs font-semibold uppercase">Interests / Hobbies</label>
              <button
                type="button"
                onClick={() => handleAddFlatArrayItem('interests')}
                className="flex items-center gap-0.5 text-indigo-400 font-medium text-[11px] hover:text-indigo-300 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Interest</span>
              </button>
            </div>
            <div className="space-y-2">
              {data.interests.map((interest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => handleUpdateFlatArray('interests', index, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFlatArrayItem('interests', index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.interests.length === 0 && (
                <p className="text-slate-500 text-xs italic">No interests added yet.</p>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
