import { Types } from 'mongoose';

export interface Resume {
  _id: Types.ObjectId;
  user_id: string;
  file_name: string;
  file_url?: string;
  raw_text?: string;
  parsed_data?: ParsedResumeData;
  created_at: Date;
  updated_at: Date;
}

export interface ParsedResumeData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

export interface JobPosting {
  _id: Types.ObjectId;
  external_id?: string;
  platform: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  location?: string;
  salary_range?: string;
  url?: string;
  posted_at?: Date;
  created_at: Date;
  expires_at?: Date;
}

export interface JobRecommendation {
  _id: Types.ObjectId;
  resume_id: Types.ObjectId;
  job_posting_id: Types.ObjectId;
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  created_at: Date;
  job: JobPosting;
}

export interface ATSScore {
  _id: Types.ObjectId;
  resume_id: Types.ObjectId;
  job_posting_id?: Types.ObjectId;
  overall_score: number;
  keyword_score: number;
  formatting_score: number;
  experience_score: number;
  education_score: number;
  suggestions: ATSSuggestion[];
  created_at: Date;
}

export interface ATSSuggestion {
  category: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SkillsGapAnalysis {
  matchingSkills: string[];
  missingSkills: string[];
  recommendedActions: string[];
}