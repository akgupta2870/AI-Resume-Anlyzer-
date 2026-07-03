import React, { useRef, useEffect } from 'react';
import { ResumeData } from '../types.ts';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string; // 'modern' | 'professional' | 'minimal' | 'creative' | 'corporate' | 'ats'
  themeColor?: string; // 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'violet'
  fontStyle?: string;  // 'sans' | 'serif' | 'mono' | 'editorial' | 'modern-grotesk'
  fontSize?: string;   // 'small' | 'medium' | 'large'
  fontColor?: string;  // hex color
  enforceTwoPages?: boolean;
}

export default function ResumePreview({ 
  data, 
  templateId, 
  themeColor = 'indigo',
  fontStyle = 'sans',
  fontSize = 'medium',
  fontColor = '#1e293b',
  enforceTwoPages = true
}: ResumePreviewProps) {
  const { personalInformation: info, professionalSummary: summary, skills, experience, projects, education } = data;

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      // Find all text elements to clean and convert bold/italic tags
      const textElements = previewRef.current.querySelectorAll('p, li');
      textElements.forEach(el => {
        let content = el.innerHTML;
        
        // Only convert if there are tags or markdown sequences
        if (
          content.includes('&lt;') || 
          content.includes('<') ||
          content.includes('**') || 
          content.includes('*')
        ) {
          // Temporarily unescape safe tags
          let parsed = content
            .replace(/&lt;b&gt;/gi, '<strong>')
            .replace(/&lt;\/b&gt;/gi, '</strong>')
            .replace(/&lt;strong&gt;/gi, '<strong>')
            .replace(/&lt;\/strong&gt;/gi, '</strong>')
            .replace(/&lt;i&gt;/gi, '<em>')
            .replace(/&lt;\/i&gt;/gi, '</em>')
            .replace(/&lt;em&gt;/gi, '<em>')
            .replace(/&lt;\/em&gt;/gi, '</em>')
            .replace(/&lt;u&gt;/gi, '<span class="underline">')
            .replace(/&lt;\/u&gt;/gi, '</span>')
            .replace(/&lt;span style=&quot;(.*?)&quot;&gt;/gi, '<span style="$1">')
            .replace(/&lt;span style="(.*?)"&gt;/gi, '<span style="$1">')
            .replace(/&lt;\/span&gt;/gi, '</span>');

          // Convert Markdown formats
          parsed = parsed
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

          el.innerHTML = parsed;
        }
      });
    }
  }, [data, templateId, themeColor, fontStyle, fontSize, fontColor]);

  const colors: Record<string, {
    primaryText: string;
    secondaryText: string;
    heavyText: string;
    primaryBg: string;
    lightBg: string;
    primaryBorder: string;
    lightBorder: string;
    mediumBorder: string;
    thickBorder: string;
    linkText: string;
    badgeText: string;
  }> = {
    indigo: {
      primaryText: 'text-indigo-600',
      secondaryText: 'text-indigo-500',
      heavyText: 'text-indigo-950',
      primaryBg: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      primaryBorder: 'border-indigo-600',
      lightBorder: 'border-indigo-100',
      mediumBorder: 'border-indigo-200',
      thickBorder: 'border-l-indigo-600',
      linkText: 'text-indigo-400',
      badgeText: 'text-indigo-700 bg-indigo-50'
    },
    emerald: {
      primaryText: 'text-emerald-600',
      secondaryText: 'text-emerald-500',
      heavyText: 'text-emerald-950',
      primaryBg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      primaryBorder: 'border-emerald-600',
      lightBorder: 'border-emerald-100',
      mediumBorder: 'border-emerald-200',
      thickBorder: 'border-l-emerald-600',
      linkText: 'text-emerald-400',
      badgeText: 'text-emerald-700 bg-emerald-50'
    },
    rose: {
      primaryText: 'text-rose-600',
      secondaryText: 'text-rose-500',
      heavyText: 'text-rose-950',
      primaryBg: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      primaryBorder: 'border-rose-600',
      lightBorder: 'border-rose-100',
      mediumBorder: 'border-rose-200',
      thickBorder: 'border-l-rose-600',
      linkText: 'text-rose-400',
      badgeText: 'text-rose-700 bg-rose-50'
    },
    amber: {
      primaryText: 'text-amber-600',
      secondaryText: 'text-amber-500',
      heavyText: 'text-amber-950',
      primaryBg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      primaryBorder: 'border-amber-600',
      lightBorder: 'border-amber-100',
      mediumBorder: 'border-amber-200',
      thickBorder: 'border-l-amber-600',
      linkText: 'text-amber-400',
      badgeText: 'text-amber-700 bg-amber-50'
    },
    slate: {
      primaryText: 'text-slate-600',
      secondaryText: 'text-slate-500',
      heavyText: 'text-slate-900',
      primaryBg: 'bg-slate-500',
      lightBg: 'bg-slate-50',
      primaryBorder: 'border-slate-600',
      lightBorder: 'border-slate-100',
      mediumBorder: 'border-slate-200',
      thickBorder: 'border-l-slate-600',
      linkText: 'text-slate-500',
      badgeText: 'text-slate-700 bg-slate-50'
    },
    violet: {
      primaryText: 'text-violet-600',
      secondaryText: 'text-violet-500',
      heavyText: 'text-violet-950',
      primaryBg: 'bg-violet-500',
      lightBg: 'bg-violet-50',
      primaryBorder: 'border-violet-600',
      lightBorder: 'border-violet-100',
      mediumBorder: 'border-violet-200',
      thickBorder: 'border-l-violet-600',
      linkText: 'text-violet-400',
      badgeText: 'text-violet-700 bg-violet-50'
    }
  };

  const activeTheme = colors[themeColor] || colors.indigo;

  // Render social/contact chips safely
  const renderContactItem = (icon: React.ReactNode, value: string, linkPrefix?: string) => {
    if (!value) return null;
    const isLink = !!linkPrefix;
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="shrink-0 text-slate-500 no-print">{icon}</span>
        {isLink ? (
          <a href={`${linkPrefix}${value}`} target="_blank" rel="noopener noreferrer" className={`hover:underline ${activeTheme.primaryText} print:text-black`}>
            {value}
          </a>
        ) : (
          <span className="text-slate-700 font-medium">{value}</span>
        )}
      </div>
    );
  };

  // Render a smart Page 2 transition marker for screen and print
  const renderPageBreakIndicator = (sectionLabel: string = "PAGE 2 BOUNDARY") => {
    if (!enforceTwoPages) return null;
    return (
      <div className="no-print border-t-2 border-dashed border-rose-400/40 my-6 relative text-center select-none page-break-after-section page-break-force col-span-full w-full">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-rose-300 text-[10px] font-mono font-bold text-rose-500 shadow-sm z-20">
          ✂️ SMART TWO-PAGE ENFORCER: {sectionLabel} ✂️
        </span>
      </div>
    );
  };

  // --- TEMPLATE 1: Modern Minimal ---
  const renderModern = () => (
    <div className={`font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2 uppercase">
          {info.fullName}
        </h1>
        <p className={`${activeTheme.primaryText} font-semibold text-xs uppercase tracking-wider mb-3`}>
          {experience[0]?.designation || "Solutions Engineer / Architect"}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          {renderContactItem(<Mail className="w-3.5 h-3.5" />, info.email, "mailto:")}
          {renderContactItem(<Phone className="w-3.5 h-3.5" />, info.phone, "tel:")}
          {renderContactItem(<MapPin className="w-3.5 h-3.5" />, `${info.city}, ${info.state}, ${info.country}`)}
          {renderContactItem(<Linkedin className="w-3.5 h-3.5" />, info.linkedin, "https://")}
          {renderContactItem(<Github className="w-3.5 h-3.5" />, info.github, "https://")}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-slate-700 text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Grid body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Side - Experience & Projects */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-xs experience-item">
                    <div className="flex justify-between items-start font-semibold text-slate-900">
                      <span>{exp.designation} <span className={`${activeTheme.primaryText} font-medium`}>@ {exp.company}</span></span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium italic mb-1.5">{exp.location}</div>
                    
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className={enforceTwoPages ? "print:break-before-page pt-4" : ""}>
              {renderPageBreakIndicator("PROJECTS & INITIATIVES")}
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Key Initiatives & Projects
              </h3>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs project-item">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <span>{proj.title}</span>
                      <div className="flex gap-2 text-[10px] font-mono">
                        {proj.github && <a href={`https://${proj.github}`} target="_blank" className={`${activeTheme.primaryText}`}>Repo</a>}
                        {proj.liveDemo && <a href={`https://${proj.liveDemo}`} target="_blank" className={`${activeTheme.primaryText}`}>Demo</a>}
                      </div>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Skills & Education */}
        <div className="space-y-6">
          {/* Skills list */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Core Skills
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(skills).map(([cat, list]) => {
                if (!list || list.length === 0) return null;
                return (
                  <div key={cat} className="text-[11px]">
                    <span className="font-semibold text-slate-800 capitalize">{cat}: </span>
                    <span className="text-slate-600">{list.join(", ")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className={enforceTwoPages ? "print:break-before-page pt-3" : ""}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-[11px] education-item">
                    <div className="font-semibold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.college}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{edu.year} | GPA: {edu.cgpa}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & extras */}
          {data.certifications.length > 0 && (
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Credentials
              </h3>
              <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-1">
                {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 2: Professional Executive ---
  const renderProfessional = () => (
    <div className={`font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      {/* Name and Header block with sidebar accent */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <h1 className={`font-display text-4xl font-extrabold tracking-tight ${activeTheme.heavyText} mb-1`}>
            {info.fullName}
          </h1>
          <p className={`${activeTheme.primaryText} font-bold text-sm tracking-wider uppercase mb-3`}>
            {experience[0]?.designation || "Solutions Specialist"}
          </p>
          <p className="text-slate-600 text-xs leading-relaxed pr-2">{summary}</p>
        </div>
        
        <div className="md:col-span-1 bg-slate-50 p-4 border border-slate-200/50 rounded-lg space-y-2">
          <h4 className={`${activeTheme.heavyText} font-bold text-xs uppercase border-b ${activeTheme.mediumBorder} pb-1`}>Contact</h4>
          <div className="text-[11px] text-slate-700 space-y-1.5 break-all">
            <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-500" /> <span>{info.email}</span></div>
            <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-500" /> <span>{info.phone}</span></div>
            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-500" /> <span className="capitalize">{info.city}, {info.state}</span></div>
            {info.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-indigo-500" /> <span>{info.linkedin}</span></div>}
            {info.github && <div className="flex items-center gap-1.5"><Github className="w-3 h-3 text-indigo-500" /> <span>{info.github}</span></div>}
          </div>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="space-y-6">
        {/* Core Skills section */}
        <div className={`p-4 rounded-lg border border-slate-100 ${activeTheme.lightBg}`}>
          <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${activeTheme.heavyText} mb-3`}>
            Expertise & Core Competencies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
            {Object.entries(skills).map(([cat, list]) => {
              if (!list || list.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="font-bold text-slate-800 capitalize">{cat}</div>
                  <div className="text-slate-600 mt-0.5">{list.join(", ")}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional Experience */}
        <div>
          <h3 className={`font-display text-sm font-bold uppercase tracking-wider ${activeTheme.heavyText} border-b-2 ${activeTheme.mediumBorder} pb-1 mb-4`}>
            Professional Experience
          </h3>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs experience-item">
                <div className={`flex justify-between items-baseline font-bold ${activeTheme.heavyText} text-[13px]`}>
                  <span>{exp.designation} <span className="text-slate-500 font-normal">| {exp.company}</span></span>
                  <span className="text-[10px] font-mono text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className={`text-[10px] ${activeTheme.primaryText} font-semibold mb-2`}>{exp.location}</div>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-[11px]">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Qualifications */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${enforceTwoPages ? "print:break-before-page pt-4" : ""}`}>
          {renderPageBreakIndicator("ACADEMICS & CERTIFICATIONS")}
          <div>
            <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${activeTheme.heavyText} border-b ${activeTheme.mediumBorder} pb-1 mb-3`}>
              Academic Background
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px] mb-2 education-item">
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <div className="text-slate-600">{edu.college} ({edu.year})</div>
                <div className={`text-[10px] ${activeTheme.primaryText} font-semibold mt-0.5`}>GPA: {edu.cgpa}</div>
              </div>
            ))}
          </div>

          {data.certifications.length > 0 && (
            <div>
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${activeTheme.heavyText} border-b ${activeTheme.mediumBorder} pb-1 mb-3`}>
                Key Certifications
              </h3>
              <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-1">
                {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 3: Classic Minimalist (Symmetrical centered) ---
  const renderMinimal = () => (
    <div className={`font-serif bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      {/* Symmetrical Centered Header */}
      <div className="text-center border-b border-slate-200 pb-4 mb-5">
        <h1 className="font-display text-3xl font-bold tracking-normal text-slate-900 mb-1">
          {info.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-2 font-sans">
          <span>{info.email}</span>
          <span>&bull;</span>
          <span>{info.phone}</span>
          <span>&bull;</span>
          <span>{info.city}, {info.state}</span>
          {info.linkedin && (
            <>
              <span>&bull;</span>
              <span>{info.linkedin}</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-5 font-sans">
        {/* Summary */}
        {summary && (
          <div className="text-xs text-slate-700 italic text-center max-w-2xl mx-auto border-b border-slate-100 pb-4">
            "{summary}"
          </div>
        )}

        {/* Experience */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs experience-item">
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span>{exp.designation} &mdash; <span className="font-normal italic">{exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} &ndash; {exp.endDate}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium italic mb-1">{exp.location}</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className={enforceTwoPages ? "print:break-before-page pt-4" : ""}>
          {renderPageBreakIndicator("TECHNICAL ARSENAL & EDUCATION")}
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Technical Arsenal
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            {Object.entries(skills).map(([cat, list]) => {
              if (!list || list.length === 0) return null;
              return (
                <div key={cat} className="flex gap-2">
                  <span className="font-bold text-slate-800 capitalize min-w-[80px] shrink-0">{cat}:</span>
                  <span className="text-slate-600">{list.join(", ")}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Education
          </h3>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs text-slate-800 education-item">
                <div>
                  <span className="font-bold">{edu.degree}</span> &mdash; <span className="italic text-slate-600">{edu.college}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{edu.year} (GPA: {edu.cgpa})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 4: Creative Designer (Accent borders, left display rule) ---
  const renderCreative = () => (
    <div className={`font-sans bg-white text-slate-900 border-l-[10px] ${activeTheme.primaryBorder} border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      <div className="mb-6">
        <h1 className={`font-display text-4xl font-black ${activeTheme.heavyText} mb-1 uppercase tracking-tight`}>
          {info.fullName}
        </h1>
        <div className={`w-16 h-1.5 ${activeTheme.primaryBg} mb-4 rounded-full`}></div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
          <span>{info.email}</span>
          <span>|</span>
          <span>{info.phone}</span>
          <span>|</span>
          <span>{info.city}, {info.state}</span>
          {info.portfolio && (
            <>
              <span>|</span>
              <span className={`${activeTheme.primaryText}`}>{info.portfolio}</span>
            </>
          )}
        </div>
      </div>

      <p className={`text-slate-700 text-xs mb-6 ${activeTheme.lightBg} border ${activeTheme.lightBorder} p-4 rounded-xl leading-relaxed`}>
        {summary}
      </p>

      <div className="space-y-6">
        {/* Experience */}
        <div>
          <h3 className={`font-display text-sm font-bold ${activeTheme.heavyText} mb-3 flex items-center gap-2 uppercase tracking-wider`}>
            <span className={`w-1.5 h-4 ${activeTheme.primaryBg} rounded-sm`}></span> Experience Timeline
          </h3>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className={`text-xs border-l ${activeTheme.lightBorder} pl-4 relative ml-1 experience-item`}>
                <span className={`absolute w-2.5 h-2.5 ${activeTheme.primaryBg} rounded-full border-2 border-white -left-[5px] top-1`}></span>
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{exp.designation} @ <span className={`${activeTheme.primaryText}`}>{exp.company}</span></span>
                  <span className={`text-[10px] ${activeTheme.secondaryText} font-mono`}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mb-1.5">{exp.location}</div>
                <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-1">
                  {exp.responsibilities.map((resp, rIdx) => <li key={rIdx}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills as badges */}
        <div className={enforceTwoPages ? "print:break-before-page pt-4" : ""}>
          {renderPageBreakIndicator("SPECIALIZATIONS & EDUCATION")}
          <h3 className={`font-display text-sm font-bold ${activeTheme.heavyText} mb-3 flex items-center gap-2 uppercase tracking-wider`}>
            <span className={`w-1.5 h-4 ${activeTheme.primaryBg} rounded-sm`}></span> Key Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(skills).flat().map((skill, index) => {
              if (!skill) return null;
              return (
                <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${activeTheme.badgeText}`}>
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className={`font-display text-sm font-bold ${activeTheme.heavyText} mb-3 flex items-center gap-2 uppercase tracking-wider`}>
            <span className={`w-1.5 h-4 ${activeTheme.primaryBg} rounded-sm`}></span> Academic Background
          </h3>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs p-3 bg-slate-50 border border-slate-100 rounded-lg education-item">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-500">{edu.college} | CGPA: {edu.cgpa}</div>
                <div className={`text-[10px] font-mono ${activeTheme.primaryText} mt-0.5`}>{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 5: SaaS Corporate (Sleek sections, professional dark headings) ---
  const renderCorporate = () => (
    <div className={`font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-4 mb-5">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
            {info.fullName}
          </h1>
          <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">
            {experience[0]?.designation || "Enterprise Solutions Engineer"}
          </p>
        </div>
        
        <div className="text-xs text-slate-600 text-left md:text-right mt-3 md:mt-0 space-y-1 font-mono">
          <div>{info.email}</div>
          <div>{info.phone}</div>
          <div>{info.city}, {info.state}</div>
          {info.linkedin && <div className="text-slate-800 font-semibold">{info.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">Executive Summary</h4>
            <p className="text-slate-700 text-xs leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-3">Employment Experience</h4>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs experience-item">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.designation} <span className="font-normal text-slate-500">at {exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic mb-1.5">{exp.location}</div>
                <ul className="list-disc pl-4 text-slate-700 text-[11px] space-y-1 leading-relaxed">
                  {exp.responsibilities.map((resp, rIdx) => <li key={rIdx}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Skills categories */}
        <div className={enforceTwoPages ? "print:break-before-page pt-4" : ""}>
          {renderPageBreakIndicator("CORE EXPERTISE & ACADEMICS")}
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-3">Core Expertise</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            {Object.entries(skills).map(([cat, list]) => {
              if (!list || list.length === 0) return null;
              return (
                <div key={cat} className="p-2 bg-slate-50 border border-slate-100 rounded">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">{cat}</div>
                  <div className="text-slate-600 text-[10px] leading-relaxed">{list.join(", ")}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-2">Education Background</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px] text-slate-850 education-item">
                <div className="font-bold">{edu.degree}</div>
                <div>{edu.college} | GPA: {edu.cgpa}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 6: Strict ATS Compliant (Symmetrical baseline, single-column) ---
  const renderATS = () => (
    <div className={`font-sans bg-white text-black leading-snug max-w-[21cm] min-h-[29.7cm] mx-auto text-left text-xs font-normal ${
      enforceTwoPages ? 'p-6 md:p-7 print:p-5 print:pt-4' : 'p-8'
    }`}>
      {/* Centered flat name */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold tracking-tight uppercase mb-1">
          {info.fullName}
        </h1>
        <p className="text-[11px] text-black">
          {info.address}, {info.city}, {info.state} {info.postalCode} | {info.phone} | {info.email}
        </p>
        {info.linkedin && (
          <p className="text-[10px] text-black font-mono mt-0.5">
            {info.linkedin} {info.github ? ` | ${info.github}` : ''}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Professional Summary */}
        {summary && (
          <div>
            <div className="font-bold uppercase border-b border-black text-[11px] tracking-wide mb-1">Professional Summary</div>
            <p className="text-[11px] leading-relaxed text-black">{summary}</p>
          </div>
        )}

        {/* Technical skills list (No blocks or borders, pure commas) */}
        <div>
          <div className="font-bold uppercase border-b border-black text-[11px] tracking-wide mb-1">Core Competencies & Skills</div>
          <div className="space-y-1 text-[11px]">
            {Object.entries(skills).map(([cat, list]) => {
              if (!list || list.length === 0) return null;
              return (
                <div key={cat} className="leading-normal">
                  <span className="font-bold capitalize">{cat}: </span>
                  <span className="text-black">{list.join(", ")}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience (Flat text list, perfect formatting) */}
        {experience.length > 0 && (
          <div>
            <div className="font-bold uppercase border-b border-black text-[11px] tracking-wide mb-1">Professional Experience</div>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-[11px] experience-item">
                  <div className="flex justify-between items-baseline font-bold">
                    <span>{exp.company} &mdash; {exp.location}</span>
                    <span className="font-medium">{exp.startDate} &ndash; {exp.endDate}</span>
                  </div>
                  <div className="italic font-medium">{exp.designation}</div>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-black">
                    {exp.responsibilities.map((resp, rIdx) => <li key={rIdx}>{resp}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className={enforceTwoPages ? "print:break-before-page pt-4" : ""}>
            {renderPageBreakIndicator("EDUCATION & QUALIFICATIONS")}
            <div className="font-bold uppercase border-b border-black text-[11px] tracking-wide mb-1">Education & Qualifications</div>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px] education-item">
                  <div className="flex justify-between font-bold">
                    <span>{edu.college} &mdash; {edu.university}</span>
                    <span className="font-medium">{edu.year}</span>
                  </div>
                  <div>{edu.degree} {edu.cgpa ? `(GPA: ${edu.cgpa})` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const fontFamilies: Record<string, string> = {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, 'JetBrains Mono', 'Fira Code', monospace",
    editorial: "'Playfair Display', Lora, Georgia, serif",
    'modern-grotesk': "Outfit, 'Space Grotesk', sans-serif"
  };

  const selectedFontFamily = fontFamilies[fontStyle] || fontFamilies.sans;
  
  const sizeStyles: Record<string, string> = {
    small: '11px',
    medium: '12.5px',
    large: '14px'
  };
  const selectedFontSize = sizeStyles[fontSize] || sizeStyles.medium;

  const renderWithStyles = (element: React.ReactElement) => {
    return (
      <div 
        ref={previewRef}
        className="resume-styled-wrapper w-full"
        style={{
          fontFamily: selectedFontFamily,
          fontSize: selectedFontSize,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .resume-styled-wrapper,
          .resume-styled-wrapper p, 
          .resume-styled-wrapper li, 
          .resume-styled-wrapper span, 
          .resume-styled-wrapper h1,
          .resume-styled-wrapper h2,
          .resume-styled-wrapper h3,
          .resume-styled-wrapper h4,
          .resume-styled-wrapper div {
            font-family: ${selectedFontFamily} !important;
          }
          .resume-styled-wrapper p,
          .resume-styled-wrapper li {
            font-size: ${selectedFontSize} !important;
            color: ${fontColor} !important;
          }
        ` }} />
        {element}
      </div>
    );
  };

  let renderedElement: React.ReactElement;
  switch (templateId) {
    case 'professional':
      renderedElement = renderProfessional();
      break;
    case 'minimal':
      renderedElement = renderMinimal();
      break;
    case 'creative':
      renderedElement = renderCreative();
      break;
    case 'corporate':
      renderedElement = renderCorporate();
      break;
    case 'ats':
      renderedElement = renderATS();
      break;
    case 'modern':
    default:
      renderedElement = renderModern();
      break;
  }

  return renderWithStyles(renderedElement);
}
