import { Resume } from '../Models/Resume.js';

interface AnalysisResult {
  atsScore: number;
  missingSkills: string[];
  recommendations: string[];
}

export const resumeService = {
  async uploadResume(userId: string, fileData: {
    fileName: string;
    fileUrl: string;
    skills: string[];
  }) {
    const resume = await Resume.create({
      userId,
      ...fileData,
      createdAt: new Date()
    });
    return resume;
  },

  async getResumeById(id: string) {
    return await Resume.findById(id).populate('userId');
  },

  async getUserResumes(userId: string) {
    return await Resume.find({ userId }).sort({ createdAt: -1 });
  },

  async analyzeResume(resumeId: string): Promise<AnalysisResult> {
    const resume = await Resume.findById(resumeId);
    if (!resume) throw new Error('Resume not found');

    // Implement your resume analysis logic here
    return {
      atsScore: 85, // Example score
      missingSkills: ['React Native', 'AWS'],
      recommendations: [
        'Add more keywords related to your target role',
        'Include quantifiable achievements'
      ]
    };
  },

  async updateResumeAnalysis(resumeId: string, analysis: AnalysisResult) {
    return await Resume.findByIdAndUpdate(
      resumeId,
      { 
        atsScore: analysis.atsScore,
        analysisResults: {
          missingSkills: analysis.missingSkills,
          recommendations: analysis.recommendations
        }
      },
      { new: true }
    );
  }
};