import { Resume } from '../Models/Resume.js';
import { Job } from '../Models/Job.js';

interface JobMatch {
  job: any;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export const apiService = {
  async getJobRecommendations(resumeId: string): Promise<JobMatch[]> {
    const resume = await Resume.findById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const jobs = await Job.find({ status: 'active' });
    
    return jobs.map((job: any) => {
      const matchingSkills = job.requiredSkills.filter((skill: string) => 
        resume.skills.includes(skill)
      );
      
      return {
        job,
        matchScore: (matchingSkills.length / job.requiredSkills.length) * 100,
        matchingSkills,
        missingSkills: job.requiredSkills.filter((skill: string) => 
          !resume.skills.includes(skill)
        )
      };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore);
  },

  async searchJobs(query: string) {
    return await Job.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      status: 'active'
    });
  },

  async saveJob(jobData: any) {
    return await Job.create(jobData);
  },

  async updateJob(jobId: string, jobData: any) {
    return await Job.findByIdAndUpdate(jobId, jobData, { new: true });
  }
};