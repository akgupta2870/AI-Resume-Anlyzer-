import React from 'react';
import { ResumeData } from '../types.ts';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string; // 'modern' | 'professional' | 'minimal' | 'creative' | 'corporate' | 'ats'
}

export default function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const { personalInformation: info, professionalSummary: summary, skills, experience, projects, education } = data;

  // Render social/contact chips safely
  const renderContactItem = (icon: React.ReactNode, value: string, linkPrefix?: string) => {
    if (!value) return null;
    const isLink = !!linkPrefix;
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="shrink-0 text-slate-500 no-print">{icon}</span>
        {isLink ? (
          <a href={`${linkPrefix}${value}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-400 print:text-black">
            {value}
          </a>
        ) : (
          <span className="text-slate-700 font-medium">{value}</span>
        )}
      </div>
    );
  };

  // --- TEMPLATE 1: Modern Minimal ---
  const renderModern = () => (
    <div className="p-8 font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2 uppercase">
          {info.fullName}
        </h1>
        <p className="text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-3">
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
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start font-semibold text-slate-900">
                      <span>{exp.designation} <span className="text-indigo-600 font-medium">@ {exp.company}</span></span>
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
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Key Initiatives & Projects
              </h3>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <span>{proj.title}</span>
                      <div className="flex gap-2 text-[10px] font-mono">
                        {proj.github && <a href={`https://${proj.github}`} target="_blank" className="text-indigo-600">Repo</a>}
                        {proj.liveDemo && <a href={`https://${proj.liveDemo}`} target="_blank" className="text-indigo-600">Demo</a>}
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
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-[11px]">
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
    <div className="p-8 font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left">
      {/* Name and Header block with sidebar accent */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-indigo-950 mb-1">
            {info.fullName}
          </h1>
          <p className="text-indigo-600 font-bold text-sm tracking-wider uppercase mb-3">
            {experience[0]?.designation || "Solutions Specialist"}
          </p>
          <p className="text-slate-600 text-xs leading-relaxed pr-2">{summary}</p>
        </div>
        
        <div className="md:col-span-1 bg-slate-50 p-4 border border-slate-200/50 rounded-lg space-y-2">
          <h4 className="text-indigo-950 font-bold text-xs uppercase border-b border-indigo-200 pb-1">Contact</h4>
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
        <div className="bg-indigo-950/5 p-4 rounded-lg border border-indigo-950/10">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-indigo-950 mb-3">
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
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-950/30 pb-1 mb-4">
            Professional Experience
          </h3>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-indigo-950 text-[13px]">
                  <span>{exp.designation} <span className="text-slate-500 font-normal">| {exp.company}</span></span>
                  <span className="text-[10px] font-mono text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[10px] text-indigo-600 font-semibold mb-2">{exp.location}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-3">
              Academic Background
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px] mb-2">
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <div className="text-slate-600">{edu.college} ({edu.year})</div>
                <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">GPA: {edu.cgpa}</div>
              </div>
            ))}
          </div>

          {data.certifications.length > 0 && (
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-3">
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
    <div className="p-8 font-serif bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left">
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
              <div key={idx} className="text-xs">
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
        <div>
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
              <div key={idx} className="flex justify-between text-xs text-slate-800">
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
    <div className="p-8 font-sans bg-white text-slate-900 border-l-[10px] border-l-indigo-600 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-black text-indigo-900 mb-1 uppercase tracking-tight">
          {info.fullName}
        </h1>
        <div className="w-16 h-1.5 bg-indigo-500 mb-4 rounded-full"></div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
          <span>{info.email}</span>
          <span>|</span>
          <span>{info.phone}</span>
          <span>|</span>
          <span>{info.city}, {info.state}</span>
          {info.portfolio && (
            <>
              <span>|</span>
              <span className="text-indigo-600">{info.portfolio}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-slate-700 text-xs mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl leading-relaxed">
        {summary}
      </p>

      <div className="space-y-6">
        {/* Experience */}
        <div>
          <h3 className="font-display text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-sm"></span> Experience Timeline
          </h3>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs border-l border-indigo-100 pl-4 relative ml-1">
                <span className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white -left-[5px] top-1"></span>
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{exp.designation} @ <span className="text-indigo-600">{exp.company}</span></span>
                  <span className="text-[10px] text-indigo-500 font-mono">{exp.startDate} - {exp.endDate}</span>
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
        <div>
          <h3 className="font-display text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-sm"></span> Key Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(skills).flat().map((skill, index) => {
              if (!skill) return null;
              return (
                <span key={index} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-display text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-sm"></span> Academic Background
          </h3>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-500">{edu.college} | CGPA: {edu.cgpa}</div>
                <div className="text-[10px] font-mono text-indigo-600 mt-0.5">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 5: SaaS Corporate (Sleek sections, professional dark headings) ---
  const renderCorporate = () => (
    <div className="p-8 font-sans bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto text-left">
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
              <div key={idx} className="text-xs">
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
        <div>
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
              <div key={idx} className="text-[11px] text-slate-850">
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
    <div className="p-8 font-sans bg-white text-black leading-snug max-w-[21cm] min-h-[29.7cm] mx-auto text-left text-xs font-normal">
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
                <div key={idx} className="text-[11px]">
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
          <div>
            <div className="font-bold uppercase border-b border-black text-[11px] tracking-wide mb-1">Education & Qualifications</div>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
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

  switch (templateId) {
    case 'professional':
      return renderProfessional();
    case 'minimal':
      return renderMinimal();
    case 'creative':
      return renderCreative();
    case 'corporate':
      return renderCorporate();
    case 'ats':
      return renderATS();
    case 'modern':
    default:
      return renderModern();
  }
}
