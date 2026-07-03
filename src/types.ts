/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
}

export interface Skills {
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  devops: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  others: string[];
}

export interface Experience {
  id: string;
  company: string;
  designation: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github: string;
  liveDemo: string;
  features: string[];
}

export interface Education {
  id: string;
  degree: string;
  college: string;
  university: string;
  year: string;
  cgpa: string;
}

export interface ResumeData {
  personalInformation: PersonalInformation;
  professionalSummary: string;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  achievements: string[];
  languagesKnown: string[];
  interests: string[];
  references: string[];
}

export interface ATSReport {
  overallScore: number;
  keywordMatch: number;
  formattingScore: number;
  actionVerbsScore: number;
  readabilityScore: number;
  suggestions: string[];
  missingKeywords: string[];
}

export interface JobMatchReport {
  matchPercentage: number;
  missingSkills: string[];
  suggestedKeywords: string[];
  experienceGap: string;
  improvedResumeSuggestions: string;
}

export interface Resume {
  id: string;
  title: string;
  userId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  data: ResumeData;
  createdAt: string;
}

export interface AIHistoryLog {
  id: string;
  userId: string;
  resumeId: string;
  feature: string;
  prompt?: string;
  result?: string;
  createdAt: string;
}

export interface DownloadLog {
  id: string;
  resumeId: string;
  format: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface DashboardStats {
  totalResumes: number;
  totalParsed: number;
  totalDownloads: number;
  aiFeatureUsage: { [key: string]: number };
  recentActivity: {
    id: string;
    type: 'upload' | 'parse' | 'improve' | 'download';
    description: string;
    timestamp: string;
  }[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ArchivedResume {
  id: string;
  name: string;
  timestamp: string;
  originalText: string;
  uploadedFormat: ResumeData;
  updatedFormat: ResumeData;
  profession?: string;
}

