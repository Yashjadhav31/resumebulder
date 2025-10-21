import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

interface MLAnalysisResult {
  skills: {
    skills_by_category: Record<string, string[]>;
    all_skills: string[];
  };
  experience: {
    years_of_experience: number;
    companies: string[];
    job_titles: string[];
  };
  structure_score: number;
  suggestions: string[];
  word_count: number;
  character_count: number;
}

interface ATSScoreResult {
  ats_score: number;
  matching_skills: string[];
  missing_skills: string[];
  resume_skills: string[];
  job_skills: string[];
}

interface JobRecommendation {
  job_id: string;
  title: string;
  company: string;
  location: string;
  ats_score: number;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  salary_range: any;
  job_type: string;
}

interface SkillsGapAnalysis {
  job_title: string;
  company: string;
  ats_score: number;
  required_skills_analysis: {
    matching: string[];
    missing: string[];
    match_percentage: number;
  };
  preferred_skills_analysis: {
    matching: string[];
    missing: string[];
    match_percentage: number;
  };
  recommendations: string[];
}

export class PythonMLService {
  private static async makeRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`ML Service Error: ${error.message}`);
      }
      throw error;
    }
  }

  static async analyzeResume(resumeText: string): Promise<MLAnalysisResult> {
    const response = await this.makeRequest('/analyze-resume', {
      resume_text: resumeText
    });

    if (!response.success) {
      throw new Error(response.error || 'Analysis failed');
    }

    return response.analysis;
  }

  static async calculateATSScore(resumeText: string, jobDescription: string): Promise<ATSScoreResult> {
    const response = await this.makeRequest('/calculate-ats-score', {
      resume_text: resumeText,
      job_description: jobDescription
    });

    if (!response.success) {
      throw new Error(response.error || 'ATS score calculation failed');
    }

    return {
      ats_score: response.ats_score,
      matching_skills: response.matching_skills,
      missing_skills: response.missing_skills,
      resume_skills: response.resume_skills,
      job_skills: response.job_skills
    };
  }

  static async recommendJobs(resumeText: string): Promise<JobRecommendation[]> {
    const response = await this.makeRequest('/recommend-jobs', {
      resume_text: resumeText
    });

    if (!response.success) {
      throw new Error(response.error || 'Job recommendation failed');
    }

    return response.recommendations;
  }

  static async analyzeSkillsGap(resumeText: string, jobId: string): Promise<SkillsGapAnalysis> {
    const response = await this.makeRequest('/skills-gap-analysis', {
      resume_text: resumeText,
      job_id: jobId
    });

    if (!response.success) {
      throw new Error(response.error || 'Skills gap analysis failed');
    }

    return response;
  }

  static async extractSkills(text: string): Promise<{ skills_by_category: Record<string, string[]>; all_skills: string[] }> {
    const response = await this.makeRequest('/extract-skills', {
      text: text
    });

    if (!response.success) {
      throw new Error(response.error || 'Skill extraction failed');
    }

    return response.skills;
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, {
        timeout: 5000
      });
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}
